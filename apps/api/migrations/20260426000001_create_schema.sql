-- +goose Up

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- +goose StatementBegin
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- +goose StatementEnd

CREATE TABLE users (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        UNIQUE NOT NULL,
  display_name TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE transplant_profiles (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organ             TEXT        NOT NULL,
  transplant_date   DATE,
  transplant_center TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER set_updated_at_transplant_profiles
  BEFORE UPDATE ON transplant_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Reference table: drugs used in transplant immunosuppression regimens
CREATE TABLE medications (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        UNIQUE NOT NULL,
  brand_name  TEXT,
  drug_class  TEXT        NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_medications (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medication_id UUID        NOT NULL REFERENCES medications(id),
  dose_mg       NUMERIC,
  frequency     TEXT,
  started_at    DATE        NOT NULL,
  ended_at      DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ended_at IS NULL OR ended_at > started_at)
);
CREATE TRIGGER set_updated_at_user_medications
  BEFORE UPDATE ON user_medications FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Reference table: dietary restriction categories assigned to patients
CREATE TABLE dietary_restrictions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_restrictions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restriction_id UUID        NOT NULL REFERENCES dietary_restrictions(id),
  started_at     DATE        NOT NULL,
  ended_at       DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ended_at IS NULL OR ended_at > started_at)
);
CREATE TRIGGER set_updated_at_user_restrictions
  BEFORE UPDATE ON user_restrictions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE lab_results (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_name    TEXT        NOT NULL,
  value        NUMERIC     NOT NULL,
  unit         TEXT        NOT NULL,
  collected_at TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE foods (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        UNIQUE NOT NULL,
  category   TEXT        NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER set_updated_at_foods
  BEFORE UPDATE ON foods FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- GIN index enables pg_trgm fuzzy search on food names (handles misspellings)
CREATE INDEX foods_name_trgm ON foods USING GIN (name gin_trgm_ops);

-- Rules engine: each row is one food/trigger pair with a verdict.
-- trigger_type discriminates between medication-driven and restriction-driven rules.
-- Exactly one of medication_id or restriction_id must be set (enforced by CHECK).
CREATE TABLE food_interactions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id        UUID        NOT NULL REFERENCES foods(id),
  trigger_type   TEXT        NOT NULL CHECK (trigger_type IN ('medication', 'restriction')),
  medication_id  UUID        REFERENCES medications(id),
  restriction_id UUID        REFERENCES dietary_restrictions(id),
  verdict        TEXT        NOT NULL CHECK (verdict IN ('avoid', 'caution', 'ok')),
  severity       TEXT        NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  reason         TEXT        NOT NULL,
  source         TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (trigger_type = 'medication' AND medication_id  IS NOT NULL AND restriction_id IS NULL)
    OR
    (trigger_type = 'restriction' AND restriction_id IS NOT NULL AND medication_id  IS NULL)
  )
);
CREATE TRIGGER set_updated_at_food_interactions
  BEFORE UPDATE ON food_interactions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE food_logs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_id    UUID        NOT NULL REFERENCES foods(id),
  logged_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  verdict    TEXT        NOT NULL,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- +goose Down

DROP TABLE IF EXISTS food_logs;
DROP TABLE IF EXISTS food_interactions;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS user_restrictions;
DROP TABLE IF EXISTS lab_results;
DROP TABLE IF EXISTS user_medications;
DROP TABLE IF EXISTS transplant_profiles;
DROP TABLE IF EXISTS dietary_restrictions;
DROP TABLE IF EXISTS medications;
DROP TABLE IF EXISTS users;
DROP FUNCTION IF EXISTS set_updated_at();
DROP EXTENSION IF EXISTS pg_trgm;
DROP EXTENSION IF EXISTS pgcrypto;
