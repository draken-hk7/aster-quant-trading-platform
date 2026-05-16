"use client";

import { create } from "zustand";
import { mockSnapshot } from "@/lib/mock-snapshot";
import type { TerminalSnapshot } from "@/lib/types";

interface TerminalState {
  snapshot: TerminalSnapshot | null;
  selectedSymbol: string;
  connected: boolean;
  setSnapshot: (snapshot: TerminalSnapshot) => void;
  setSelectedSymbol: (symbol: string) => void;
  setConnected: (connected: boolean) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  snapshot: mockSnapshot,
  selectedSymbol: "AAPL",
  connected: false,
  setSnapshot: (snapshot) => set({ snapshot }),
  setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
  setConnected: (connected) => set({ connected })
}));
