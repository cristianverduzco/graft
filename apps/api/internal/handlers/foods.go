package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type checkFoodRequest struct {
	FoodName string `json:"food_name"`
	UserID   string `json:"user_id"`
}

type foodReason struct {
	TriggerType string `json:"trigger_type"`
	TriggerName string `json:"trigger_name"`
	Verdict     string `json:"verdict"`
	Severity    string `json:"severity"`
	Reason      string `json:"reason"`
	Source      string `json:"source,omitempty"`
}

type checkFoodResponse struct {
	Food         string       `json:"food"`
	Verdict      string       `json:"verdict"`
	Personalized bool         `json:"personalized"`
	Reasons      []foodReason `json:"reasons"`
}

const (
	verdictAvoid   = "avoid"
	verdictCaution = "caution"
	verdictOk      = "ok"
)

// 0.3 threshold: catches single-character typos without false positives on short names.
const sqlFindFood = `
	SELECT id, name
	FROM foods
	WHERE similarity(name, $1) > 0.3
	ORDER BY similarity(name, $1) DESC
	LIMIT 1
`

const sqlAllInteractions = `
	SELECT
		fi.trigger_type,
		CASE fi.trigger_type
			WHEN 'medication'  THEN m.name
			WHEN 'restriction' THEN dr.name
		END AS trigger_name,
		fi.verdict,
		fi.severity,
		fi.reason,
		COALESCE(fi.source, '') AS source
	FROM food_interactions fi
	LEFT JOIN medications          m  ON m.id  = fi.medication_id
	LEFT JOIN dietary_restrictions dr ON dr.id = fi.restriction_id
	WHERE fi.food_id = $1
	ORDER BY
		CASE fi.verdict  WHEN 'avoid'  THEN 1 WHEN 'caution' THEN 2 ELSE 3 END,
		CASE fi.severity WHEN 'high'   THEN 1 WHEN 'medium'  THEN 2 ELSE 3 END
`

// Only interactions that apply to this user's active medications and restrictions.
// The LEFT JOINs on user_medications / user_restrictions act as existence checks:
// a rule fires only when the user actually takes that drug or carries that restriction.
const sqlPersonalizedInteractions = `
	SELECT
		fi.trigger_type,
		CASE fi.trigger_type
			WHEN 'medication'  THEN m.name
			WHEN 'restriction' THEN dr.name
		END AS trigger_name,
		fi.verdict,
		fi.severity,
		fi.reason,
		COALESCE(fi.source, '') AS source
	FROM food_interactions fi
	LEFT JOIN medications          m  ON m.id  = fi.medication_id
	LEFT JOIN dietary_restrictions dr ON dr.id = fi.restriction_id
	LEFT JOIN user_medications     um ON um.medication_id  = fi.medication_id
		AND um.user_id   = $2
		AND um.ended_at  IS NULL
	LEFT JOIN user_restrictions    ur ON ur.restriction_id = fi.restriction_id
		AND ur.user_id   = $2
		AND ur.ended_at  IS NULL
	WHERE fi.food_id = $1
	  AND (
		    (fi.trigger_type = 'medication'  AND um.id IS NOT NULL)
		 OR (fi.trigger_type = 'restriction' AND ur.id IS NOT NULL)
	  )
	ORDER BY
		CASE fi.verdict  WHEN 'avoid'  THEN 1 WHEN 'caution' THEN 2 ELSE 3 END,
		CASE fi.severity WHEN 'high'   THEN 1 WHEN 'medium'  THEN 2 ELSE 3 END
`

func (h *Handler) CheckFood(w http.ResponseWriter, r *http.Request) {
	var req checkFoodRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}
	if req.FoodName == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "food_name is required"})
		return
	}

	ctx := r.Context()

	var foodID pgtype.UUID
	var foodName string
	err := h.db.QueryRow(ctx, sqlFindFood, req.FoodName).Scan(&foodID, &foodName)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "food not found"})
			return
		}
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
		return
	}

	personalized := req.UserID != ""
	var rows pgx.Rows
	if personalized {
		var userID pgtype.UUID
		if err := userID.Scan(req.UserID); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid user_id"})
			return
		}
		rows, err = h.db.Query(ctx, sqlPersonalizedInteractions, foodID, userID)
	} else {
		rows, err = h.db.Query(ctx, sqlAllInteractions, foodID)
	}
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
		return
	}
	defer rows.Close()

	reasons := make([]foodReason, 0, 8)
	for rows.Next() {
		var fr foodReason
		if err := rows.Scan(
			&fr.TriggerType,
			&fr.TriggerName,
			&fr.Verdict,
			&fr.Severity,
			&fr.Reason,
			&fr.Source,
		); err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "scan failed"})
			return
		}
		reasons = append(reasons, fr)
	}
	if err := rows.Err(); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "database error"})
		return
	}

	writeJSON(w, http.StatusOK, checkFoodResponse{
		Food:         foodName,
		Verdict:      worstVerdict(reasons),
		Personalized: personalized,
		Reasons:      reasons,
	})
}

func worstVerdict(reasons []foodReason) string {
	worst := verdictOk
	for _, r := range reasons {
		if r.Verdict == verdictAvoid {
			return verdictAvoid
		}
		if r.Verdict == verdictCaution {
			worst = verdictCaution
		}
	}
	return worst
}
