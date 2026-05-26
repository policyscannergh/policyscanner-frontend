import type { Parsed } from "@/lib/types";
import { estimateRebuildCost } from "@/lib/rebuildCost";
import { gbp } from "@/lib/format";

const VERDICT_STYLES = {
  under: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/[0.06]",
    dot: "bg-amber-500",
    label: "Possibly under-insured",
    labelTone: "text-amber-700",
    deltaTone: "text-amber-700",
  },
  adequate: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/[0.06]",
    dot: "bg-emerald-500",
    label: "Adequately covered",
    labelTone: "text-emerald-700",
    deltaTone: "text-emerald-700",
  },
  over: {
    border: "border-border",
    bg: "bg-card",
    dot: "bg-foreground/40",
    label: "May be over-insured",
    labelTone: "text-muted",
    deltaTone: "text-muted",
  },
  unknown: {
    border: "border-border",
    bg: "bg-card",
    dot: "bg-foreground/40",
    label: "Sum insured not stated",
    labelTone: "text-muted",
    deltaTone: "text-muted",
  },
} as const;

export function RebuildCostCheck({ data }: { data: Parsed }) {
  const estimate = estimateRebuildCost(data);
  if (!estimate) return null;

  const {
    estimatedCost,
    insured,
    region,
    rate,
    size,
    category,
    bedrooms,
    verdict,
    deltaPct,
  } = estimate;

  const style = VERDICT_STYLES[verdict];

  return (
    <section className="mt-12">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Rebuild cost check
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          ABI-style estimate
        </span>
      </div>
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Buildings sum insured should reflect the cost to rebuild your home —
        not its market value. Under-insurance is the most expensive home
        insurance mistake.
      </p>

      <div className={`rounded-2xl border-2 ${style.border} ${style.bg} p-6`}>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${style.labelTone}`}
          >
            {style.label}
          </span>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">
              Typical rebuild cost
            </div>
            <div className="mt-1 text-3xl font-semibold tracking-tight">
              {gbp(estimatedCost)}
            </div>
            <div className="mt-1.5 text-xs text-muted">
              {bedrooms}-bed {category} · ~{size} m² × £
              {rate.toLocaleString()}/m²
              <br />
              <span className="opacity-70">{region}</span>
            </div>
          </div>

          {insured != null ? (
            <div>
              <div className="text-xs uppercase tracking-wider text-muted">
                Your buildings sum insured
              </div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">
                {gbp(insured)}
              </div>
              {deltaPct != null ? (
                <div className={`mt-1.5 text-xs font-medium ${style.deltaTone}`}>
                  {deltaPct >= 0 ? "+" : ""}
                  {deltaPct.toFixed(0)}% vs estimate
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-muted">
              Buildings sum insured wasn&rsquo;t stated in the document — we
              can&rsquo;t compare directly.
            </div>
          )}
        </div>

        {verdict === "under" ? (
          <div className="mt-5 border-t border-amber-500/20 pt-4 text-sm leading-relaxed">
            <span className="font-medium">What to do:</span>{" "}
            <span className="text-muted">
              Your sum insured looks meaningfully below typical rebuild cost
              for this property type. If your home is destroyed, the policy may
              not pay enough to rebuild it. Ask your insurer to increase the
              buildings sum insured — the premium impact is usually small but
              the cover gap can be huge.
            </span>
          </div>
        ) : null}

        {verdict === "over" ? (
          <div className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted">
            <span className="font-medium text-foreground">Heads up:</span>{" "}
            Buildings sum insured is well above typical rebuild cost. Insurers
            don&rsquo;t pay more than rebuild cost in a total-loss claim, so
            you may be paying premium for cover you can&rsquo;t use. Worth
            getting a proper rebuild valuation to right-size it.
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-xs text-muted">
        Estimate uses regional rates loosely based on ABI rebuild cost
        guidance. Actual rebuild cost varies with construction, condition, and
        listed status. For an authoritative figure, use the{" "}
        <a
          href="https://abi.bcis.co.uk/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-foreground"
        >
          ABI BCIS Rebuild Cost Calculator
        </a>{" "}
        or a chartered surveyor.
      </p>
    </section>
  );
}
