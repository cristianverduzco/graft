# graft-api

Go backend for the Graft transplant nutrition app.

## Stack

- Go 1.22+
- chi (HTTP router)
- pgx (Postgres driver)
- air (hot reload)

## Setup

```bash
go mod download
createdb graft_dev
air
```

## Endpoints

- `GET /healthz` — liveness probe
- `GET /readyz` — readiness probe (checks DB)
- `GET /api/v1/ping` — sanity check
