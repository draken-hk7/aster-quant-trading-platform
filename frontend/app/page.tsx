"use client";

import { motion } from "framer-motion";
import { ChartPanel } from "@/components/chart-panel";
import { OrderBook } from "@/components/order-book";
import { RiskDashboard } from "@/components/risk-dashboard";
import { StrategyConsole } from "@/components/strategy-console";
import { TopBar } from "@/components/top-bar";
import { Watchlist } from "@/components/watchlist";
import { useTerminalStream } from "@/lib/use-terminal-stream";

export default function TerminalPage() {
  useTerminalStream();

  return (
    <main className="h-screen w-screen p-2">
      <motion.div
        className="terminal-grid grid h-full w-full gap-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <TopBar />
        <Watchlist />
        <ChartPanel />
        <OrderBook />
        <RiskDashboard />
        <StrategyConsole />
      </motion.div>
    </main>
  );
}

