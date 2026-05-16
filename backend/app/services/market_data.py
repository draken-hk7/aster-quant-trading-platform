import math
import random
from collections import deque
from datetime import UTC, datetime

from app.domain.models import MarketTick, OrderBook, OrderBookLevel, Side, TradePrint


class MarketDataService:
    """Deterministic synthetic market-data engine for local simulation and UI development."""

    def __init__(self) -> None:
        self.symbols = ["AAPL", "MSFT", "NVDA", "BTC-USD", "ETH-USD", "SPY"]
        self._step = 0
        self._last = {
            "AAPL": 211.7,
            "MSFT": 428.1,
            "NVDA": 914.5,
            "BTC-USD": 67450.0,
            "ETH-USD": 3560.0,
            "SPY": 532.2,
        }
        self._bars: dict[str, deque[dict[str, float | str]]] = {
            symbol: deque(maxlen=240) for symbol in self.symbols
        }

    def next_ticks(self) -> list[MarketTick]:
        self._step += 1
        ticks: list[MarketTick] = []
        for idx, symbol in enumerate(self.symbols):
            base = self._last[symbol]
            wave = math.sin((self._step + idx * 7) / 12) * 0.0015
            noise = random.uniform(-0.0012, 0.0012)
            price = max(0.01, base * (1 + wave + noise))
            spread = max(price * 0.00012, 0.01)
            tick = MarketTick(
                symbol=symbol,
                price=round(price, 4),
                bid=round(price - spread / 2, 4),
                ask=round(price + spread / 2, 4),
                volume=round(random.uniform(10_000, 900_000), 2),
            )
            self._last[symbol] = tick.price
            self._bars[symbol].append(
                {
                    "time": tick.ts.isoformat(),
                    "open": round(base, 4),
                    "high": round(max(base, tick.price) * 1.001, 4),
                    "low": round(min(base, tick.price) * 0.999, 4),
                    "close": tick.price,
                    "volume": tick.volume,
                }
            )
            ticks.append(tick)
        return ticks

    def snapshot(self) -> dict[str, object]:
        ticks = self.next_ticks()
        return {
            "ticks": [tick.model_dump(mode="json") for tick in ticks],
            "books": [self.order_book(tick.symbol).model_dump(mode="json") for tick in ticks[:4]],
            "trades": [self.trade_print(tick).model_dump(mode="json") for tick in ticks],
            "bars": {symbol: list(bars) for symbol, bars in self._bars.items()},
        }

    def order_book(self, symbol: str) -> OrderBook:
        mid = self._last[symbol]
        tick = max(mid * 0.00015, 0.01)
        bids = [
            OrderBookLevel(price=round(mid - tick * level, 4), size=round(1000 + level * 240, 2))
            for level in range(1, 16)
        ]
        asks = [
            OrderBookLevel(price=round(mid + tick * level, 4), size=round(950 + level * 220, 2))
            for level in range(1, 16)
        ]
        return OrderBook(symbol=symbol, bids=bids, asks=asks)

    def trade_print(self, tick: MarketTick) -> TradePrint:
        return TradePrint(
            symbol=tick.symbol,
            side=random.choice([Side.BUY, Side.SELL]),
            price=tick.price,
            quantity=round(random.uniform(10, 500), 2),
            ts=datetime.now(UTC),
        )

