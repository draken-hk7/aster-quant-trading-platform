# Security, Controls, and Governance

## Security Model

- Use short-lived JWT access tokens with issuer/audience validation.
- Store production secrets in Vault, AWS Secrets Manager, GCP Secret Manager, or Kubernetes sealed secrets.
- Enable MFA for all human operators.
- Require idempotency keys on order-entry endpoints.
- Log every order intent, risk decision, kill-switch change, configuration change, and operator action.
- Segment market-data, strategy, risk, execution, and admin service accounts.
- Use TLS everywhere, including internal mesh traffic in production.
- Use broker-specific subaccounts and exchange-side limits so application controls are never the only guardrail.

## Risk Controls

- Pre-trade checks: max notional, daily loss, gross exposure, net exposure, concentration, symbol halt, stale market data, strategy enablement, and kill switch.
- Intraday controls: drawdown monitor, VaR monitor, slippage drift, fill-ratio alerting, rejected-order spike detection, and market-data gap detection.
- Post-trade controls: reconciliation, drop-copy comparison, broker statement checks, and T+1 exception reports.

## Testing Strategy

- Unit tests for domain objects, order state transitions, strategy signals, risk decisions, backtest fills, and analytics metrics.
- Contract tests for REST and WebSocket payloads.
- Simulation tests for market-order, limit-order, partial-fill, cancel-replace, and kill-switch flows.
- Replay tests using recorded tick streams.
- Frontend component tests for keyboard shortcuts, panel layout, and trading-ticket validation.
- Load tests for WebSocket fanout and order-entry throughput.

