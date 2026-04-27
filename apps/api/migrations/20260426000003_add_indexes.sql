-- +goose Up

-- food_interactions is queried by food_id on every /foods/check call
CREATE INDEX food_interactions_food_id ON food_interactions (food_id);

-- +goose Down

DROP INDEX IF EXISTS food_interactions_food_id;
