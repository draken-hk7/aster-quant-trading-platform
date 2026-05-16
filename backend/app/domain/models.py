from datetime import UTC, datetime
from enum import StrEnum
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, computed_field


class Side(StrEnum):
    BUY = "buy"
    SELL = "sell"


class OrderType(StrEnum):
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"
    TWAP = "twap"
    VWAP = "vwap"


class OrderStatus(StrEnum):
    NEW = "new"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    PARTIALLY_FILLED = "partially_filled"
    FILLED = "filled"
    CANCELED = "canceled"


class RiskDecision(StrEnum):
    APPROVED = "approved"
    REJECTED = "rejected"


class MarketTick(BaseModel):
    symbol: str
    price: float
    bid: float
    ask: float
    volume: float
    ts: datetime = Field(default_factory=lambda: datetime.now(UTC))


class OrderBookLevel(BaseModel):
    price: float
    size: float


class OrderBook(BaseModel):
    symbol: str
    bids: list[OrderBookLevel]
    asks: list[OrderBookLevel]
    ts: datetime = Field(default_factory=lambda: datetime.now(UTC))


class TradePrint(BaseModel):
    symbol: str
    side: Side
    price: float
    quantity: float
    ts: datetime = Field(default_factory=lambda: datetime.now(UTC))


class OrderIntent(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    strategy_id: str = "manual"
    symbol: str
    side: Side
    order_type: OrderType
    quantity: float = Field(gt=0)
    limit_price: float | None = None
    stop_price: float | None = None
    time_in_force: Literal["day", "gtc", "ioc", "fok"] = "day"

    @computed_field
    @property
    def notional_hint(self) -> float:
        price = self.limit_price or self.stop_price or 0
        return abs(self.quantity * price)


class OrderState(BaseModel):
    intent: OrderIntent
    status: OrderStatus
    risk_status: RiskDecision
    avg_fill_price: float = 0
    filled_quantity: float = 0
    reason: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class Fill(BaseModel):
    order_id: UUID
    symbol: str
    side: Side
    quantity: float
    price: float
    fees: float
    liquidity: Literal["maker", "taker"]
    filled_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class Position(BaseModel):
    symbol: str
    quantity: float
    avg_price: float
    realized_pnl: float = 0
    market_price: float

    @computed_field
    @property
    def market_value(self) -> float:
        return self.quantity * self.market_price

    @computed_field
    @property
    def unrealized_pnl(self) -> float:
        return (self.market_price - self.avg_price) * self.quantity


class RiskSnapshot(BaseModel):
    gross_exposure: float
    net_exposure: float
    var_95: float
    max_drawdown: float
    daily_pnl: float
    kill_switch: bool
    correlation_matrix: dict[str, dict[str, float]]
    ts: datetime = Field(default_factory=lambda: datetime.now(UTC))


class StrategySignal(BaseModel):
    strategy_id: str
    symbol: str
    side: Side
    confidence: float = Field(ge=0, le=1)
    target_weight: float = Field(ge=-1, le=1)
    rationale: str

