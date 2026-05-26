import type { Parsed } from "@/lib/types";
import { generateAlternatives, type AlternativeQuote } from "@/lib/quotes";
import { gbp } from "@/lib/format";

export function QuoteComparison({ data }: { data: Parsed }) {
  const alternatives = generateAlternatives(data);
  const currentPremium = data.policy?.annual_premium_gbp ?? null;

  return (
    <section className="mt-12">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Estimated alternatives
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Illustrative
        </span>
      </div>
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Indicative pricing based on typical UK market rates for properties in
        your bracket — not live quotes. Use the link at the bottom of the page
        to get real quotes you can buy.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {alternatives.map((q) => (
          <QuoteCard
            key={q.insurer}
            quote={q}
            currentPremium={currentPremium}
          />
        ))}
      </div>
    </section>
  );
}

function QuoteCard({
  quote,
  currentPremium,
}: {
  quote: AlternativeQuote;
  currentPremium: number | null;
}) {
  const positioningStyles: Record<AlternativeQuote["positioning"], string> = {
    competitive: "border-emerald-500/30",
    comprehensive: "border-brand/40",
    premium: "border-amber-500/30",
  };
  const positioningLabel: Record<AlternativeQuote["positioning"], string> = {
    competitive: "Competitive",
    comprehensive: "Comprehensive",
    premium: "Premium",
  };
  const positioningDot: Record<AlternativeQuote["positioning"], string> = {
    competitive: "bg-emerald-500",
    comprehensive: "bg-brand",
    premium: "bg-amber-500",
  };

  const delta =
    currentPremium != null
      ? quote.annual_premium_gbp - currentPremium
      : null;

  return (
    <div
      className={`rounded-2xl border-2 bg-card p-5 ${positioningStyles[quote.positioning]}`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted">
        <span
          className={`h-1.5 w-1.5 rounded-full ${positioningDot[quote.positioning]}`}
        />
        {positioningLabel[quote.positioning]}
      </div>

      <div className="mt-2 text-base font-semibold tracking-tight">
        {quote.insurer}
      </div>
      <div className="text-xs text-muted">{quote.brand}</div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight">
          {gbp(quote.annual_premium_gbp)}
        </span>
        <span className="text-xs text-muted">/ year</span>
      </div>
      <div className="mt-0.5 text-xs text-muted">
        ~£{quote.monthly_premium_gbp.toFixed(2)} / month
      </div>

      {delta != null ? (
        <div
          className={`mt-2 text-xs font-medium ${
            delta < 0
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted"
          }`}
        >
          {delta < 0 ? "−" : "+"}
          {gbp(Math.abs(delta))} vs your current policy
        </div>
      ) : null}

      {quote.fixes.length > 0 ? (
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">
            Closes your gaps
          </div>
          <ul className="space-y-1.5">
            {quote.fixes.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-xs leading-relaxed"
              >
                <span
                  aria-hidden
                  className="mt-0.5 text-emerald-600 dark:text-emerald-500"
                >
                  ✓
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {quote.highlights.length > 0 ? (
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">
            Why pick this one
          </div>
          <ul className="space-y-1.5">
            {quote.highlights.map((h) => (
              <li
                key={h}
                className="text-xs leading-relaxed text-muted"
              >
                · {h}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
