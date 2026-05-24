type RowTone = "neutral" | "warn" | "good";

function Row({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: RowTone;
}) {
  const valueClass =
    tone === "warn"
      ? "text-amber-700 dark:text-amber-400"
      : tone === "good"
        ? "text-emerald-700 dark:text-emerald-400"
        : "text-foreground";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-b-0">
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-xs font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

export function SampleResult() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-brand/20 via-brand/5 to-transparent blur-2xl" />
      <div className="absolute -right-3 -top-3 hidden h-24 w-24 rotate-6 rounded-2xl border border-border bg-card sm:block" />
      <div className="absolute -left-4 -bottom-4 hidden h-20 w-20 -rotate-6 rounded-2xl border border-border bg-card sm:block" />

      <div className="relative rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-brand/10 sm:p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted">
              Scanned policy
            </div>
            <div className="mt-0.5 text-sm font-semibold tracking-tight">
              Aviva Home · 2026 renewal
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Parsed in 8s
          </div>
        </div>

        <div className="mt-4 space-y-0.5">
          <Row label="Buildings sum insured" value="£500,000" />
          <Row label="Contents sum insured" value="£75,000" />
          <Row label="Accidental damage" value="Not included" tone="warn" />
          <Row label="Escape of water excess" value="£500" />
          <Row label="Subsidence excess" value="£1,000" tone="warn" />
          <Row
            label="Personal possessions"
            value="£3,500 · away cover"
            tone="good"
          />
          <Row label="Alt. accommodation" value="£50,000" />
        </div>

        <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <div className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 text-amber-600 dark:text-amber-500">●</span>
            <span className="leading-relaxed text-muted">
              <span className="font-semibold text-foreground">
                3 cover gaps
              </span>{" "}
              vs last year — accidental damage dropped, subsidence excess up
              £500, valuables limit cut.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
