import asyncio
from contextlib import suppress

from fastapi import WebSocket, WebSocketDisconnect

from app.api import dependencies as deps


async def terminal_socket(websocket: WebSocket) -> None:
    await websocket.accept()
    try:
        while True:
            market = deps.market_data.snapshot()
            marks = {tick["symbol"]: tick["price"] for tick in market["ticks"]}
            deps.portfolio.update_marks(marks)
            payload = {
                "type": "terminal.snapshot",
                "market": market,
                "portfolio": deps.portfolio.snapshot(),
                "risk": deps.risk.snapshot(list(deps.portfolio.positions.values())).model_dump(mode="json"),
                "execution": deps.execution.snapshot(),
                "strategies": deps.strategy.installed(),
                "signals": [
                    signal.model_dump(mode="json")
                    for signal in deps.strategy.signals(market["bars"])
                ],
                "analytics": deps.analytics.assistant(),
            }
            await websocket.send_json(payload)
            with suppress(asyncio.TimeoutError):
                message = await asyncio.wait_for(websocket.receive_json(), timeout=0.75)
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        return

