export type Side = "buy" | "sell";

export interface Tick {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  ts: string;
}

export interface Bar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  avg_price: number;
  realized_pnl: number;
  market_price: number;
  market_value: number;
  unrealized_pnl: number;
}

export interface RiskSnapshot {
  gross_exposure: number;
  net_exposure: number;
  var_95: number;
  max_drawdown: number;
  daily_pnl: number;
  kill_switch: boolean;
  correlation_matrix: Record<string, Record<string, number>>;
  ts: string;
}

export interface TerminalSnapshot {
  type: "terminal.snapshot";
  market: {
    ticks: Tick[];
    bars: Record<string, Bar[]>;
    books: Array<{
      symbol: string;
      bids: Array<{ price: number; size: number }>;
      asks: Array<{ price: number; size: number }>;
    }>;
    trades: Array<{ symbol: string; side: Side; price: number; quantity: number; ts: string }>;
  };
  portfolio: {
    equity: number;
    cash: number;
    positions: Position[];
    allocations: Array<{ symbol: string; weight: number }>;
  };
  risk: RiskSnapshot;
  execution: {
    orders: unknown[];
    fills: unknown[];
  };
  strategies: Array<{ id: string; name: string; status: string; capital: number }>;
  signals: Array<{
    strategy_id: string;
    symbol: string;
    side: Side;
    confidence: number;
    target_weight: number;
    rationale: string;
  }>;
  analytics: {
    regime: string;
    volatility_forecast: string;
    recommendations: string[];
    sentiment: Array<{ topic: string; score: number }>;
  };
}

