import type { TerminalSnapshot } from "@/lib/types";

const now = new Date().toISOString();

export const mockSnapshot: TerminalSnapshot = {
  type: "terminal.snapshot",
  market: {
    ticks: [
      { symbol: "AAPL", price: 211.72, bid: 211.69, ask: 211.75, volume: 482330, ts: now },
      { symbol: "MSFT", price: 428.13, bid: 428.07, ask: 428.18, volume: 311904, ts: now },
      { symbol: "NVDA", price: 914.55, bid: 914.42, ask: 914.7, volume: 776102, ts: now },
      { symbol: "BTC-USD", price: 67450.25, bid: 67442.8, ask: 67457.7, volume: 12844, ts: now },
      { symbol: "ETH-USD", price: 3560.1, bid: 3559.4, ask: 3560.8, volume: 42302, ts: now },
      { symbol: "SPY", price: 532.22, bid: 532.18, ask: 532.25, volume: 890120, ts: now }
    ],
    bars: {
      AAPL: Array.from({ length: 90 }, (_, index) => {
        const base = 207 + Math.sin(index / 7) * 2.8 + index * 0.045;
        return {
          time: new Date(Date.now() - (90 - index) * 60_000).toISOString(),
          open: base,
          high: base + 1.2,
          low: base - 0.9,
          close: base + Math.sin(index / 3) * 0.7,
          volume: 120000 + index * 750
        };
      })
    },
    books: [
      {
        symbol: "AAPL",
        bids: Array.from({ length: 15 }, (_, index) => ({ price: 211.69 - index * 0.03, size: 1100 + index * 180 })),
        asks: Array.from({ length: 15 }, (_, index) => ({ price: 211.75 + index * 0.03, size: 980 + index * 165 }))
      }
    ],
    trades: []
  },
  portfolio: {
    equity: 10184250,
    cash: 4250000,
    positions: [
      {
        symbol: "AAPL",
        quantity: 1200,
        avg_price: 203.4,
        realized_pnl: 0,
        market_price: 211.72,
        market_value: 254064,
        unrealized_pnl: 9984
      },
      {
        symbol: "MSFT",
        quantity: 700,
        avg_price: 411.2,
        realized_pnl: 0,
        market_price: 428.13,
        market_value: 299691,
        unrealized_pnl: 11851
      },
      {
        symbol: "NVDA",
        quantity: 260,
        avg_price: 875,
        realized_pnl: 0,
        market_price: 914.55,
        market_value: 237783,
        unrealized_pnl: 10283
      },
      {
        symbol: "BTC-USD",
        quantity: 5.2,
        avg_price: 62100,
        realized_pnl: 0,
        market_price: 67450.25,
        market_value: 350741.3,
        unrealized_pnl: 27821.3
      }
    ],
    allocations: [
      { symbol: "AAPL", weight: 0.025 },
      { symbol: "MSFT", weight: 0.029 },
      { symbol: "NVDA", weight: 0.023 },
      { symbol: "BTC-USD", weight: 0.034 }
    ]
  },
  risk: {
    gross_exposure: 1142279.3,
    net_exposure: 1142279.3,
    var_95: 68210.5,
    max_drawdown: 0.071,
    daily_pnl: 84250,
    kill_switch: false,
    correlation_matrix: {},
    ts: now
  },
  execution: { orders: [], fills: [] },
  strategies: [
    { id: "mean_reversion_v1", name: "Mean Reversion", status: "live", capital: 1500000 },
    { id: "momentum_breakout_v2", name: "Momentum Breakout", status: "live", capital: 2000000 },
    { id: "pairs_stat_arb_v1", name: "Pairs Stat Arb", status: "paused", capital: 1000000 },
    { id: "mm_crypto_v1", name: "Crypto Market Making", status: "sim", capital: 750000 }
  ],
  signals: [
    {
      strategy_id: "momentum_breakout_v2",
      symbol: "NVDA",
      side: "buy",
      confidence: 0.78,
      target_weight: 0.03,
      rationale: "Positive momentum regime with breakout confirmation."
    },
    {
      strategy_id: "mean_reversion_v1",
      symbol: "AAPL",
      side: "buy",
      confidence: 0.64,
      target_weight: 0.04,
      rationale: "Price trades below short-term fair value."
    }
  ],
  analytics: {
    regime: "risk-on with elevated single-name dispersion",
    volatility_forecast: "moderate-to-high next 5 sessions",
    recommendations: [
      "Reduce gross beta if VaR rises above 2.2% of NAV.",
      "Prefer pair hedges in semiconductors over index-only hedges.",
      "Throttle VWAP participation when spread widens beyond 18 bps."
    ],
    sentiment: [
      { topic: "AI infrastructure", score: 0.71 },
      { topic: "rates", score: -0.24 },
      { topic: "crypto liquidity", score: 0.38 }
    ]
  }
};

