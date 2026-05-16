# Aster Quant Trading Platform

Aster is an institutional-grade trading platform scaffold for multi-asset systematic trading, execution simulation, realtime risk, portfolio analytics, AI-assisted research, and operator-grade dashboards.

The repository is intentionally structured like a professional hedge fund platform: independently deployable services, typed API contracts, event-driven streaming, risk gates before execution, and a dense multi-monitor terminal UI.

## System Shape

- `frontend/` - Next.js, React, TypeScript, TailwindCSS trading workstation.
- `backend/` - FastAPI service exposing REST and WebSocket APIs for market data, execution, risk, strategy, backtesting, analytics, and auth.
- `infra/` - Docker, NGINX, Kubernetes-ready manifests, monitoring and deployment templates.
- `docs/` - Architecture, database schema, API design, security model, and operations notes.

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Local services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- WebSocket stream: `ws://localhost:8000/ws/terminal`

## Production Notes

This platform is a professional foundation, not a broker-certified live trading appliance. Before live capital deployment, connect broker-specific FIX/REST/WebSocket adapters, run exchange conformance tests, add exchange-level drop-copy reconciliation, enable hardware-backed secrets, enforce disaster recovery runbooks, and complete model/risk governance sign-off.

