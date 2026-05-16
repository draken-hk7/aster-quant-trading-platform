"use client";

import { useTerminalStore } from "@/store/terminal-store";

export function OrderBook() {
  const { snapshot, selectedSymbol } = useTerminalStore();
  const book = snapshot?.market.books.find((item) => item.symbol === selectedSymbol) ?? snapshot?.market.books[0];
  const asks = [...(book?.asks ?? [])].reverse();
  const bids = book?.bids ?? [];

  return (
    <section className="panel col-start-3 row-start-2 overflow-hidden rounded">
      <div className="flex h-9 items-center justify-between border-b border-line px-3">
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Depth</span>
        <span className="font-mono text-xs text-slate-300">{book?.symbol ?? selectedSymbol}</span>
      </div>
      <div className="grid h-[calc(100%-36px)] grid-cols-2 gap-px overflow-hidden bg-line/60">
        <div className="bg-panel p-2">
          {bids.slice(0, 14).map((level) => (
            <div key={level.price} className="grid h-6 grid-cols-2 font-mono text-xs">
              <span className="text-buy mono-tabular">{level.price.toLocaleString()}</span>
              <span className="text-right text-slate-400 mono-tabular">{level.size.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="bg-panel p-2">
          {asks.slice(0, 14).map((level) => (
            <div key={level.price} className="grid h-6 grid-cols-2 font-mono text-xs">
              <span className="text-sell mono-tabular">{level.price.toLocaleString()}</span>
              <span className="text-right text-slate-400 mono-tabular">{level.size.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

