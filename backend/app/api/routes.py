from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.api import dependencies as deps
from app.core.security import create_access_token
from app.domain.models import OrderIntent

router = APIRouter()


class TokenRequest(BaseModel):
    email: str
    password: str = Field(min_length=8)


class KillSwitchRequest(BaseModel):
    enabled: bool


class BacktestRequest(BaseModel):
    strategy_id: str
    capital: float = Field(gt=0, default=1_000_000)
    bars: int = Field(ge=50, le=25_000, default=500)
    commission_bps: float = Field(ge=0, le=50, default=1.0)


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "aster-backend"}


@router.post("/auth/token")
def token(request: TokenRequest) -> dict[str, str]:
    return {"access_token": create_access_token(request.email, "operator"), "token_type": "bearer"}


@router.get("/market/snapshot")
def market_snapshot() -> dict[str, object]:
    snapshot = deps.market_data.snapshot()
    marks = {tick["symbol"]: tick["price"] for tick in snapshot["ticks"]}
    deps.portfolio.update_marks(marks)
    return snapshot


@router.post("/orders")
def submit_order(intent: OrderIntent) -> dict[str, object]:
    price = intent.limit_price or deps.market_data._last.get(intent.symbol)
    if price is None:
        raise HTTPException(status_code=404, detail="Unknown symbol")
    return deps.execution.submit(intent, price).model_dump(mode="json")


@router.post("/orders/{order_id}/cancel")
def cancel_order(order_id: str) -> dict[str, object]:
    state = deps.execution.cancel(order_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return state.model_dump(mode="json")


@router.get("/portfolio")
def portfolio() -> dict[str, object]:
    return deps.portfolio.snapshot()


@router.get("/risk")
def risk() -> dict[str, object]:
    return deps.risk.snapshot(list(deps.portfolio.positions.values())).model_dump(mode="json")


@router.post("/risk/kill-switch")
def kill_switch(request: KillSwitchRequest) -> dict[str, object]:
    deps.risk.kill_switch = request.enabled
    return deps.risk.snapshot(list(deps.portfolio.positions.values())).model_dump(mode="json")


@router.get("/strategies")
def strategies() -> dict[str, object]:
    return {"strategies": deps.strategy.installed()}


@router.post("/backtests")
def run_backtest(request: BacktestRequest) -> dict[str, object]:
    return deps.backtest.run(request.strategy_id, request.capital, request.bars, request.commission_bps)


@router.get("/analytics/assistant")
def assistant() -> dict[str, object]:
    return deps.analytics.assistant()

