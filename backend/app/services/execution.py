from datetime import UTC, datetime

from app.domain.models import Fill, OrderIntent, OrderState, OrderStatus, RiskDecision
from app.services.portfolio import PortfolioService
from app.services.risk import RiskEngine


class ExecutionEngine:
    def __init__(self, risk: RiskEngine, portfolio: PortfolioService) -> None:
        self.risk = risk
        self.portfolio = portfolio
        self.orders: dict[str, OrderState] = {}
        self.fills: list[Fill] = []

    def submit(self, intent: OrderIntent, reference_price: float) -> OrderState:
        decision, reason = self.risk.evaluate_order(
            intent,
            list(self.portfolio.positions.values()),
            reference_price,
        )
        if decision == RiskDecision.REJECTED:
            state = OrderState(
                intent=intent,
                status=OrderStatus.REJECTED,
                risk_status=decision,
                reason=reason,
            )
            self.orders[str(intent.id)] = state
            return state

        fill_price = intent.limit_price or reference_price
        fill = Fill(
            order_id=intent.id,
            symbol=intent.symbol,
            side=intent.side,
            quantity=intent.quantity,
            price=fill_price,
            fees=round(abs(intent.quantity * fill_price) * 0.0002, 4),
            liquidity="taker",
        )
        self.fills.append(fill)
        self.portfolio.apply_fill(fill)
        state = OrderState(
            intent=intent,
            status=OrderStatus.FILLED,
            risk_status=decision,
            avg_fill_price=fill_price,
            filled_quantity=intent.quantity,
            updated_at=datetime.now(UTC),
        )
        self.orders[str(intent.id)] = state
        return state

    def cancel(self, order_id: str) -> OrderState | None:
        state = self.orders.get(order_id)
        if state is None:
            return None
        canceled = state.model_copy(update={"status": OrderStatus.CANCELED, "updated_at": datetime.now(UTC)})
        self.orders[order_id] = canceled
        return canceled

    def snapshot(self) -> dict[str, object]:
        return {
            "orders": [state.model_dump(mode="json") for state in self.orders.values()][-25:],
            "fills": [fill.model_dump(mode="json") for fill in self.fills[-25:]],
        }

