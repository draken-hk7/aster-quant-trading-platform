from app.domain.models import Fill, Position, Side


class PortfolioService:
    def __init__(self) -> None:
        self.positions: dict[str, Position] = {
            "AAPL": Position(symbol="AAPL", quantity=1200, avg_price=203.4, market_price=211.7),
            "MSFT": Position(symbol="MSFT", quantity=700, avg_price=411.2, market_price=428.1),
            "NVDA": Position(symbol="NVDA", quantity=260, avg_price=875.0, market_price=914.5),
            "BTC-USD": Position(symbol="BTC-USD", quantity=5.2, avg_price=62100, market_price=67450),
        }

    def update_marks(self, marks: dict[str, float]) -> None:
        for symbol, price in marks.items():
            if symbol in self.positions:
                pos = self.positions[symbol]
                self.positions[symbol] = pos.model_copy(update={"market_price": price})

    def apply_fill(self, fill: Fill) -> Position:
        signed_qty = fill.quantity if fill.side == Side.BUY else -fill.quantity
        existing = self.positions.get(
            fill.symbol,
            Position(symbol=fill.symbol, quantity=0, avg_price=fill.price, market_price=fill.price),
        )
        new_qty = existing.quantity + signed_qty
        if new_qty == 0:
            avg_price = fill.price
        elif existing.quantity == 0 or (existing.quantity > 0) == (signed_qty > 0):
            avg_price = ((existing.quantity * existing.avg_price) + (signed_qty * fill.price)) / new_qty
        else:
            avg_price = existing.avg_price
        position = existing.model_copy(
            update={"quantity": new_qty, "avg_price": avg_price, "market_price": fill.price}
        )
        self.positions[fill.symbol] = position
        return position

    def snapshot(self) -> dict[str, object]:
        positions = list(self.positions.values())
        equity = 10_000_000 + sum(p.unrealized_pnl + p.realized_pnl for p in positions)
        return {
            "equity": round(equity, 2),
            "cash": 4_250_000,
            "positions": [p.model_dump() for p in positions],
            "allocations": [
                {"symbol": p.symbol, "weight": round(abs(p.market_value) / max(equity, 1), 4)}
                for p in positions
            ],
        }

