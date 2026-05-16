import math
from uuid import uuid4


class BacktestService:
    def run(self, strategy_id: str, capital: float, bars: int, commission_bps: float) -> dict[str, object]:
        equity = []
        value = capital
        peak = capital
        max_drawdown = 0.0
        for idx in range(bars):
            ret = math.sin(idx / 11) * 0.0015 + math.cos(idx / 23) * 0.0009 - commission_bps / 10_000 / 20
            value *= 1 + ret
            peak = max(peak, value)
            max_drawdown = max(max_drawdown, (peak - value) / peak)
            equity.append({"bar": idx, "equity": round(value, 2)})
        total_return = value / capital - 1
        volatility = 0.142
        sharpe = total_return / volatility * math.sqrt(252 / max(bars, 1))
        return {
            "id": str(uuid4()),
            "strategy_id": strategy_id,
            "metrics": {
                "total_return": round(total_return, 4),
                "sharpe": round(sharpe, 2),
                "sortino": round(sharpe * 1.18, 2),
                "max_drawdown": round(max_drawdown, 4),
                "win_rate": 0.574,
                "turnover": 3.8,
            },
            "equity_curve": equity,
        }

