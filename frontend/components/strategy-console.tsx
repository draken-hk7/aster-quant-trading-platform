"use client";

import { BrainCircuit, RadioTower } from "lucide-react";
import { useTerminalStore } from "@/store/terminal-store";

export function StrategyConsole() {
  const snapshot = useTerminalStore((state) => state.snapshot);

  return (
    <section className="panel col-start-3 row-start-3 overflow-hidden rounded">
      <div className="flex h-10 items-center justify-between border-b border-line px-3">
        <div className="flex items-center gap-2 text-sm text-slate-100">
          <BrainCircuit className="h-4 w-4 text-cyan-300" />
          Strategy Mesh
        </div>
        <RadioTower className="h-4 w-4 text-buy" />
      </div>
      <div className="h-[calc(100%-40px)] overflow-auto p-3">
        <div className="grid gap-2">
          {snapshot?.strategies.map((strategy) => (
            <div key={strategy.id} className="border border-line bg-white/[0.025] p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-100">{strategy.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-buy">{strategy.status}</span>
              </div>
              <div className="mt-1 font-mono text-xs text-slate-500">${strategy.capital.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {snapshot?.signals.map((signal) => (
            <div key={`${signal.strategy_id}-${signal.symbol}`} className="border border-line bg-cyan-300/[0.035] p-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span>{signal.symbol}</span>
                <span className={signal.side === "buy" ? "text-buy" : "text-sell"}>{signal.side.toUpperCase()}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-400">{signal.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

