import type { Parsed } from "@/lib/types";
import {
  generateRecommendations,
  moneySupermarketUrl,
  type Recommendation,
} from "@/lib/recommendations";

export function Recommendations({ data }: { data: Parsed }) {
  const recs = generateRecommendations(data);
  if (recs.length === 0) return null;

  const warnCount = recs.filter((r) => r.tone === "warn").length;
  const cta = moneySupermarketUrl(data);

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          What to do about it
        </h2>
        {warnCount > 0 ? (
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            {warnCount} cover gap{warnCount > 1 ? "s" : ""} flagged
          </span>
        ) : null}
      </div>

      <div className="space-y-3">
        {recs.map((r, i) => (
          <RecommendationCard key={i} rec={r} />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-brand/10 via-card to-card p-6">
        <h3 className="text-lg font-semibold tracking-tight">
          Ready to compare alternatives?
        </h3>
        <p className="mt-1.5 max-w-xl text-sm text-muted">
          Get live quotes from 30+ UK insurers and switch on renewal if a
          better-cover policy comes in cheaper.
        </p>
        <a
          href={cta}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
        >
          Compare quotes on MoneySupermarket
          <span aria-hidden className="ml-2">
            →
          </span>
        </a>
        <p className="mt-3 text-xs text-muted">
          Affiliate link · PolicyScanner may earn a small commission at no cost
          to you.
        </p>
      </div>
    </section>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const toneStyles: Record<Recommendation["tone"], string> = {
    warn: "border-amber-500/30 bg-amber-500/5",
    info: "border-border bg-card",
    good: "border-emerald-500/30 bg-emerald-500/5",
  };
  const toneDot: Record<Recommendation["tone"], string> = {
    warn: "bg-amber-500",
    info: "bg-brand",
    good: "bg-emerald-500",
  };

  return (
    <div className={`rounded-2xl border p-5 ${toneStyles[rec.tone]}`}>
      <div className="flex items-start gap-3">
        <span
          className={`mt-2 h-2 w-2 shrink-0 rounded-full ${toneDot[rec.tone]}`}
          aria-hidden
        />
        <div className="flex-1">
          <h3 className="text-base font-semibold tracking-tight">
            {rec.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {rec.body}
          </p>
          {rec.insurers && rec.insurers.length > 0 ? (
            <div className="mt-3">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">
                Insurers worth checking
              </div>
              <div className="flex flex-wrap gap-2">
                {rec.insurers.map((insurer) => (
                  <span
                    key={insurer}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium"
                  >
                    {insurer}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
