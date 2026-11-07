"""
GOLDSHIELD AI — FastAPI Python MT5 Bridge Server
Architecture: MetaTrader 5 -> Python MT5 Bridge -> FastAPI -> WebSocket -> Next.js

Provides REST and WebSocket endpoints matching the frontend contract in src/services/api.ts.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import json
import os
from datetime import datetime

app = FastAPI(
    title="GoldShield AI MT5 Bridge",
    description="Institutional MetaTrader 5 Bridge & AI Intelligence API",
    version="1.0.0"
)

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check MT5 Availability
MT5_AVAILABLE = False
try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    pass

@app.on_event("startup")
async def startup_event():
    if MT5_AVAILABLE:
        initialized = mt5.initialize()
        if initialized:
            print("MetaTrader 5 Python bridge initialized successfully.")
        else:
            print(f"MetaTrader 5 init failed: {mt5.last_error()}")
    else:
        print("MetaTrader 5 module not installed or running in simulation mode.")

@app.on_event("shutdown")
async def shutdown_event():
    if MT5_AVAILABLE:
        mt5.shutdown()

@app.get("/")
def read_root():
    return {
        "service": "GoldShield AI MT5 Bridge",
        "status": "online",
        "mt5_driver": "connected" if MT5_AVAILABLE else "simulation_fallback",
        "timestamp": datetime.utcnow().isoformat()
    }

# Endpoint contracts
@app.get("/api/accounts")
def get_accounts():
    if MT5_AVAILABLE and mt5.terminal_info():
        info = mt5.account_info()
        if info:
            return [{
                "id": f"mt5-{info.login}",
                "broker": info.company,
                "accountNumber": str(info.login),
                "type": "real" if info.trade_mode == 0 else "demo",
                "currency": info.currency,
                "balance": info.balance,
                "equity": info.equity,
                "floatingPnL": info.profit,
                "freeMargin": info.margin_free,
                "marginLevel": (info.equity / info.margin * 100) if info.margin > 0 else 0,
                "leverage": f"1:{info.leverage}",
                "server": info.server,
                "connectionStatus": "connected",
                "lastSync": datetime.utcnow().isoformat()
            }]
    # Return mock baseline if MT5 is offline
    return [
        {
            "id": "acc-1",
            "broker": "Exness",
            "accountNumber": "71024589",
            "type": "demo",
            "currency": "USD",
            "balance": 52481.37,
            "equity": 53126.84,
            "floatingPnL": 645.47,
            "freeMargin": 48923.17,
            "marginLevel": 1285.42,
            "leverage": "1:500",
            "server": "Exness-MT5Trial7",
            "connectionStatus": "connected",
            "lastSync": datetime.utcnow().isoformat()
        }
    ]

@app.get("/api/positions")
def get_positions():
    if MT5_AVAILABLE and mt5.terminal_info():
        pos = mt5.positions_get()
        if pos is not None:
            return [
                {
                    "ticket": str(p.ticket),
                    "symbol": p.symbol,
                    "type": "BUY" if p.type == 0 else "SELL",
                    "lots": p.volume,
                    "entryPrice": p.price_open,
                    "currentPrice": p.price_current,
                    "stopLoss": p.sl if p.sl > 0 else None,
                    "takeProfit": p.tp if p.tp > 0 else None,
                    "floatingPnL": p.profit,
                    "floatingPips": round((p.price_current - p.price_open) * 10000, 1),
                    "duration": int(datetime.utcnow().timestamp() - p.time),
                    "strategy": p.comment or "Manual / EA",
                    "openTime": datetime.fromtimestamp(p.time).isoformat(),
                    "commission": p.commission,
                    "swap": p.swap
                }
                for p in pos
            ]
    # Simulation fallback
    return [
        {
            "ticket": "90127834",
            "symbol": "XAUUSD",
            "type": "BUY",
            "lots": 0.5,
            "entryPrice": 2341.5,
            "currentPrice": 2348.75,
            "stopLoss": 2325.0,
            "takeProfit": 2370.0,
            "floatingPnL": 362.5,
            "floatingPips": 72.5,
            "duration": 14400,
            "strategy": "GoldShield Trend v3",
            "openTime": datetime.utcnow().isoformat(),
            "commission": -3.5,
            "swap": -1.2
        }
    ]

@app.websocket("/ws/market")
async def websocket_market_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Broadcast simulated/live ticks every 1 second
            data = {
                "symbol": "XAUUSD",
                "bid": 2348.50,
                "ask": 2348.75,
                "timestamp": datetime.utcnow().isoformat()
            }
            await websocket.send_json(data)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
