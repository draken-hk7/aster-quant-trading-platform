"use client";

import { Activity, Cpu, LockKeyhole, Power } from "lucide-react";
import { useTerminalStore } from "@/store/terminal-store";

export function TopBar() {
  const { connected, snapshot } = useTerminalStore();
  const regime = snapshot?.analytics.regime ?? "initializing";

  return (
    <header className="panel col-span-3 row-start-1 flex items-center justify-between rounded px-3">
      <div className="flex items-center gap-3">
        <div className="font-mono text-sm tracking-[0.2em] text-slate-100">ASTER</div>
        <div className="h-4 w-px bg-line" />
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Activity className="h-4 w-4 text-buy" />
          <span className="truncate">{regime}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
        <span className="flex items-center gap-1">
          <Cpu className="h-3.5 w-3.5" /> Sim
        </span>
        <span className="flex items-center gap-1">
          <LockKeyhole className="h-3.5 w-3.5" /> MFA
        </span>
        <span className={connected ? "flex items-center gap-1 text-buy" : "flex items-center gap-1 text-sell"}>
          <Power className="h-3.5 w-3.5" /> {connected ? "Live" : "Offline"}
        </span>
      </div>
    </header>
  );
}

