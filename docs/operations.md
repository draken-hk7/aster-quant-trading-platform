# Operations

## Scaling Considerations

- Partition market-data Kafka topics by venue and symbol hash.
- Keep execution services single-writer per account to preserve deterministic order state.
- Cache terminal snapshots in Redis and stream deltas through Redis Streams or Kafka.
- Deploy strategy workers by strategy family and isolate CPU/GPU-heavy AI workloads.
- Use PostgreSQL for authoritative transactional state and columnar storage such as ClickHouse for historical ticks in production.

## Observability

- Emit structured JSON logs with trace IDs, strategy IDs, order IDs, and account IDs.
- Track market-data lag, order round-trip latency, WebSocket queue depth, strategy loop duration, risk rejection rate, and broker reject rate.
- Page on kill-switch activation, stale market data, broker disconnect, database write failures, and reconciliation breaks.

## Production Optimization

- Pin dependency versions and build immutable container images.
- Run backend with `uvicorn` workers behind NGINX or an ingress controller.
- Use CPU affinity and tuned network buffers for latency-sensitive execution services.
- Keep simulation and research workloads separate from live trading clusters.

