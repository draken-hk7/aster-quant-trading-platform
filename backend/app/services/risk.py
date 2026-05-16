import numpy as np

from app.core.config import settings
from app.domain.models import OrderIntent, Position, RiskDecision, RiskSnapshot


class RiskEngine:
    def __init__(self) -> None:
        self.kill_switch = False
        self.daily_pnl = 84_250.0

    def evaluate_order(
        self,
        intent: OrderIntent,
        positions: list[Position],
        reference_price: float,
    ) -> tuple[RiskDecision, str | None]:
        if self.kill_switch:
            return RiskDecision.REJECTED, "Kill switch is active"

        notional = abs(intent.quantity * reference_price)
        if notional > settings.max_order_notional:
            return RiskDecision.REJECTED, "Order notional exceeds max order limit"

        gross_after = sum(abs(p.market_value) for p in positions) + notional
        if gross_after > settings.max_gross_exposure:
            return RiskDecision.REJECTED, "Gross exposure limit would be breached"

        if self.daily_pnl <= -abs(settings.daily_loss_limit):
            return RiskDecision.REJECTED, "Daily loss limit breached"

        return RiskDecision.APPROVED, None

    def snapshot(self, positions: list[Position]) -> RiskSnapshot:
        values = np.array([p.market_value for p in positions], dtype=float)
        gross = float(np.abs(values).sum())
        net = float(values.sum())
        returns = np.array([0.004, -0.002, 0.001, -0.006, 0.003, -0.001, 0.002])
        var_95 = float(max(0, gross * abs(np.percentile(returns, 5))))
        symbols = [p.symbol for p in positions]
        matrix = {
            left: {right: round(1.0 if left == right else 0.15 + 0.6 / (1 + abs(i - j)), 3)
                   for j, right in enumerate(symbols)}
            for i, left in enumerate(symbols)
        }
        return RiskSnapshot(
            gross_exposure=gross,
            net_exposure=net,
            var_95=round(var_95, 2),
            max_drawdown=0.071,
            daily_pnl=self.daily_pnl,
            kill_switch=self.kill_switch,
            correlation_matrix=matrix,
        )

    def set_kill_switch(self, enabled: bool) -> RiskSnapshot:
        self.kill_switch = enabled
        return self.snapshot([])

