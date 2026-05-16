"use client";

import { ShieldAlert } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { MetricTile } from "@/components/metric-tile";
import { useTerminalStore } from "@/store/terminal-store";

export function RiskDashboard() {
  const snapshot = useTerminalStore((state) => state.snapshot);
  const risk = snapshot?.risk;
  const allocations = snapshot?.portfolio.allocations ?? [];

  return (
    <section className="panel col-span-2 col-start-1 row-start-3 overflow-hidden rounded">
      <div className="flex h-10 items-center justify-between border-b border-line px-3">
        <div className="flex items-center gap-2 text-sm text-slate-100">
          <ShieldAlert className="h-4 w-4 text-amber" />
          Risk & Portfolio
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">VaR / Exposure / Allocation</div>
      </div>
      <div className="grid h-[calc(100%-40px)] grid-cols-[1.2fr_0.8fr] gap-3 p-3">
        <div className="grid grid-cols-4 gap-2">
          <MetricTile label="Equity" value={`$${(snapshot?.portfolio.equity ?? 0).toLocaleString()}`} />
          <MetricTile label="Daily PnL" value={`$${(risk?.daily_pnl ?? 0).toLocaleString()}`} tone="positive" />
          <MetricTile label="VaR 95" value={`$${(risk?.var_95 ?? 0).toLocaleString()}`} tone="warning" />
          <MetricTile label="Drawdown" value={`${((risk?.max_drawdown ?? 0) * 100).toFixed(1)}%`} />
          <div className="col-span-4 overflow-hidden border border-line bg-white/[0.025]">
            <div className="grid h-8 grid-cols-[1fr_90px_110px_110px] border-b border-line px-3 text-[10px] uppercase tracking-[0.16em] text-slate-500">
              <span className="flex items-center">Position</span>
              <span className="flex items-center justify-end">Qty</span>
              <span className="flex items-center justify-end">Mark</span>
              <span className="flex items-center justify-end">Unrealized</span>
            </div>
            {snapshot?.portfolio.positions.map((position) => (
              <div
                key={position.symbol}
                className="grid h-8 grid-cols-[1fr_90px_110px_110px] border-b border-line/60 px-3 font-mono text-xs"
              >
                <span className="flex items-center text-slate-200">{position.symbol}</span>
                <span className="flex items-center justify-end text-slate-400 mono-tabular">
                  {position.quantity.toLocaleString()}
                </span>
                <span className="flex items-center justify-end mono-tabular">
                  {position.market_price.toLocaleString()}
                </span>
                <span className="flex items-center justify-end text-buy mono-tabular">
                  {position.unrealized_pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={allocations} dataKey="weight" nameKey="symbol" innerRadius={58} outerRadius={96} paddingAngle={2}>
              {allocations.map((entry, index) => (
                <Cell
                  key={entry.symbol}
                  fill={["#21c17a", "#3aa7ff", "#f5b942", "#ff5567", "#b982ff"][index % 5]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

