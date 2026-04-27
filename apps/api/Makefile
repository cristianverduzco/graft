.PHONY: help dev migrate-up migrate-down migrate-status migrate-create db-reset db-shell

DB_URL ?= postgres://localhost:5432/graft_dev?sslmode=disable
GOOSE := goose -dir migrations postgres "$(DB_URL)"

help:
	@echo "graft-api commands:"
	@echo "  make dev             - run server with hot reload (air)"
	@echo "  make migrate-up      - apply all pending migrations"
	@echo "  make migrate-down    - roll back the most recent migration"
	@echo "  make migrate-status  - show which migrations are applied"
	@echo "  make migrate-create name=description - create a new migration"
	@echo "  make db-reset        - DROP and recreate graft_dev (destructive)"
	@echo "  make db-shell        - open psql connected to graft_dev"

dev:
	air

migrate-up:
	$(GOOSE) up

migrate-down:
	$(GOOSE) down

migrate-status:
	$(GOOSE) status

migrate-create:
	@if [ -z "$(name)" ]; then echo "usage: make migrate-create name=add_something"; exit 1; fi
	$(GOOSE) create $(name) sql

db-reset:
	@echo "Dropping graft_dev..."
	dropdb --if-exists graft_dev
	createdb graft_dev
	@echo "Database recreated. Run 'make migrate-up' to apply migrations."

db-shell:
	psql $(DB_URL)
