"use client";

import clsx from "clsx";
import { useTerminalStore } from "@/store/terminal-store";

export function Watchlist() {
  const { snapshot, selectedSymbol, setSelectedSymbol } = useTerminalStore();
  const ticks = snapshot?.market.ticks ?? [];

  return (
    <section className="panel col-start-1 row-start-2 overflow-hidden rounded">
      <div className="grid h-9 grid-cols-[1fr_90px_90px] border-b border-line px-3 text-[10px] uppercase tracking-[0.16em] text-slate-500">
        <div className="flex items-center">Symbol</div>
        <div className="flex items-center justify-end">Last</div>
        <div className="flex items-center justify-end">Spread</div>
      </div>
      <div className="h-[calc(100%-36px)] overflow-auto">
        {ticks.map((tick) => {
          const spread = tick.ask - tick.bid;
          return (
            <button
              key={tick.symbol}
              className={clsx(
                "grid h-11 w-full grid-cols-[1fr_90px_90px] border-b border-line/70 px-3 text-left font-mono text-xs transition",
                selectedSymbol === tick.symbol ? "bg-cyan-400/10 text-cyan-100" : "hover:bg-white/[0.04]"
              )}
              onClick={() => setSelectedSymbol(tick.symbol)}
            >
              <span className="flex items-center text-slate-200">{tick.symbol}</span>
              <span className="flex items-center justify-end mono-tabular">{tick.price.toLocaleString()}</span>
              <span className="flex items-center justify-end text-slate-500 mono-tabular">
                {spread.toFixed(3)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

