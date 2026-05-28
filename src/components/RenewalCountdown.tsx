import type { Parsed } from "@/lib/types";

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function RenewalCountdown({ data }: { data: Parsed }) {
  const policy = data.policy ?? {};
  const date = parseDate(policy.renewal_date) ?? parseDate(policy.end_date);
  if (!date) return null;

  const now = new Date();
  const days = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (days < -7 || days > 120) return null;

  const formatted = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const past = days < 0;
  const urgent = days >= 0 && days <= 30;
  const tone =
    past || urgent
      ? "border-amber-500/40 bg-amber-500/10"
      : "border-border bg-card";
  const labelTone =
    past || urgent ? "text-amber-700" : "text-foreground";

  const headline = past
    ? `Renewed ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`
    : days === 0
      ? "Renews today"
      : `Renews in ${days} day${days === 1 ? "" : "s"}`;

  return (
    <div className={`mb-6 rounded-2xl border ${tone} px-5 py-4`}>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-lg">
            ⏳
          </span>
          <div>
            <div className={`font-semibold tracking-tight ${labelTone}`}>
              {headline}
            </div>
            <div className="text-xs text-muted">{formatted}</div>
          </div>
        </div>
        {urgent ? (
          <span className="text-xs font-medium text-amber-700">
            Time to compare
          </span>
        ) : past ? (
          <span className="text-xs font-medium text-amber-700">
            Already renewed — set a reminder for next year
          </span>
        ) : null}
      </div>
    </div>
  );
}
