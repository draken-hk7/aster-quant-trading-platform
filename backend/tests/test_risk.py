from app.domain.models import OrderIntent, OrderType, Side
from app.services.portfolio import PortfolioService
from app.services.risk import RiskEngine


def test_kill_switch_rejects_orders() -> None:
    risk = RiskEngine()
    risk.kill_switch = True
    portfolio = PortfolioService()
    intent = OrderIntent(symbol="AAPL", side=Side.BUY, order_type=OrderType.MARKET, quantity=1)

    decision, reason = risk.evaluate_order(intent, list(portfolio.positions.values()), 211.0)

    assert decision == "rejected"
    assert reason == "Kill switch is active"

