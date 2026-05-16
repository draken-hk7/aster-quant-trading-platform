import clsx from "clsx";

export function MetricTile({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative" | "warning";
}) {
  return (
    <div className="min-h-[72px] border border-line bg-white/[0.025] p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div
        className={clsx("mt-2 truncate font-mono text-lg mono-tabular", {
          "text-buy": tone === "positive",
          "text-sell": tone === "negative",
          "text-amber": tone === "warning",
          "text-slate-100": tone === "neutral"
        })}
      >
        {value}
      </div>
    </div>
  );
}

