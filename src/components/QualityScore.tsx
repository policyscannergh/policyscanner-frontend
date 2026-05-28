import type { Parsed } from "@/lib/types";
import { computeQualityScore, type ScoreBand } from "@/lib/qualityScore";

const BAND_STYLES: Record<
  ScoreBand,
  {
    text: string;
    bg: string;
    border: string;
    arcClass: string;
    arcStroke: string;
  }
> = {
  excellent: {
    text: "text-emerald-700",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    arcClass: "text-emerald-500",
    arcStroke: "#10b981",
  },
  good: {
    text: "text-brand",
    bg: "bg-brand/10",
    border: "border-brand/30",
    arcClass: "text-brand",
    arcStroke: "#e11d48",
  },
  fair: {
    text: "text-amber-700",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    arcClass: "text-amber-500",
    arcStroke: "#f59e0b",
  },
  poor: {
    text: "text-red-700",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    arcClass: "text-red-500",
    arcStroke: "#dc2626",
  },
};

export function QualityScore({ data }: { data: Parsed }) {
  const result = computeQualityScore(data);
  const style = BAND_STYLES[result.band];

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const progress = (result.score / 100) * circumference;

  return (
    <section
      className={`mb-8 rounded-2xl border-2 ${style.border} ${style.bg} p-6 sm:p-8`}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div
          className="relative flex h-32 w-32 shrink-0 items-center justify-center"
          aria-label={`Cover quality score ${result.score} out of 100`}
        >
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 128 128"
            aria-hidden
          >
            <circle
              cx="64"
              cy="64"
              r={radius}
              strokeWidth="10"
              fill="none"
              stroke="currentColor"
              className="text-border"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              strokeWidth="10"
              fill="none"
              stroke={style.arcStroke}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-semibold tracking-tight tabular-nums">
              {result.score}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted">
              / 100
            </span>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted">
            Cover quality score
          </div>
          <div
            className={`mt-1 text-2xl font-semibold tracking-tight ${style.text}`}
          >
            {result.bandLabel}
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            {result.bandDescription}
          </p>
        </div>
      </div>

      {result.deductions.length > 0 || result.bonuses.length > 0 ? (
        <div className="mt-6 border-t border-border/60 pt-4">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">
            Breakdown
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {result.bonuses.map((b) => (
              <li key={b.label} className="text-foreground/75">
                {b.label}
                <span className="ml-1 font-semibold text-emerald-700">
                  +{b.points}
                </span>
              </li>
            ))}
            {result.deductions.map((d) => (
              <li key={d.label} className="text-foreground/75">
                {d.label}
                <span className="ml-1 font-semibold text-red-700">
                  −{d.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
