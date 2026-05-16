"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp
} from "lightweight-charts";
import { useTerminalStore } from "@/store/terminal-store";

export function ChartPanel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const { snapshot, selectedSymbol } = useTerminalStore();
  const bars = snapshot?.market.bars[selectedSymbol] ?? [];

  useEffect(() => {
    if (!ref.current) return;
    chart.current = createChart(ref.current, {
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#94a3b8" },
      grid: { vertLines: { color: "rgba(148,163,184,0.08)" }, horzLines: { color: "rgba(148,163,184,0.08)" } },
      rightPriceScale: { borderColor: "rgba(148,163,184,0.16)" },
      timeScale: { borderColor: "rgba(148,163,184,0.16)", timeVisible: true },
      crosshair: { mode: 0 }
    });
    series.current = chart.current.addCandlestickSeries({
      upColor: "#21c17a",
      downColor: "#ff5567",
      borderUpColor: "#21c17a",
      borderDownColor: "#ff5567",
      wickUpColor: "#21c17a",
      wickDownColor: "#ff5567"
    });
    const resize = () => {
      if (ref.current) {
        chart.current?.applyOptions({ width: ref.current.clientWidth, height: ref.current.clientHeight });
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      chart.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!series.current || bars.length === 0) return;
    series.current.setData(
      bars.map((bar, index) => ({
        time: (Math.floor(new Date(bar.time).getTime() / 1000) + index) as UTCTimestamp,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close
      }))
    );
  }, [bars]);

  return (
    <section className="panel relative col-start-2 row-start-2 overflow-hidden rounded">
      <div className="flex h-10 items-center justify-between border-b border-line px-3">
        <div className="font-mono text-sm text-slate-100">{selectedSymbol}</div>
        <div className="flex gap-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
          <span>1m</span>
          <span>5m</span>
          <span>1h</span>
          <span>1d</span>
        </div>
      </div>
      <div ref={ref} className="h-[calc(100%-40px)] w-full" />
    </section>
  );
}
