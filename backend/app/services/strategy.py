import statistics

from app.domain.models import Side, StrategySignal


class StrategyEngine:
    def __init__(self) -> None:
        self.enabled = True

    def installed(self) -> list[dict[str, object]]:
        return [
            {"id": "mean_reversion_v1", "name": "Mean Reversion", "status": "live", "capital": 1_500_000},
            {"id": "momentum_breakout_v2", "name": "Momentum Breakout", "status": "live", "capital": 2_000_000},
            {"id": "pairs_stat_arb_v1", "name": "Pairs Stat Arb", "status": "paused", "capital": 1_000_000},
            {"id": "mm_crypto_v1", "name": "Crypto Market Making", "status": "sim", "capital": 750_000},
        ]

    def signals(self, bars: dict[str, list[dict[str, float | str]]]) -> list[StrategySignal]:
        output: list[StrategySignal] = []
        for symbol, series in bars.items():
            closes = [float(bar["close"]) for bar in series[-30:]]
            if len(closes) < 8:
                continue
            mean = statistics.fmean(closes)
            last = closes[-1]
            deviation = (last - mean) / mean
            if deviation < -0.004:
                output.append(
                    StrategySignal(
                        strategy_id="mean_reversion_v1",
                        symbol=symbol,
                        side=Side.BUY,
                        confidence=min(0.95, abs(deviation) * 80),
                        target_weight=0.04,
                        rationale="Price trades below short-term fair value.",
                    )
                )
            elif deviation > 0.006:
                output.append(
                    StrategySignal(
                        strategy_id="momentum_breakout_v2",
                        symbol=symbol,
                        side=Side.BUY,
                        confidence=min(0.95, abs(deviation) * 65),
                        target_weight=0.03,
                        rationale="Positive momentum regime with breakout confirmation.",
                    )
                )
        return output[:8]

