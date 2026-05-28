import type { Parsed } from "@/lib/types";
import { gbp, text, yesNo } from "@/lib/format";
import { computeQualityScore, type ScoreBand } from "@/lib/qualityScore";

const BAND_STROKES: Record<ScoreBand, string> = {
  excellent: "#10b981",
  good: "#e11d48",
  fair: "#f59e0b",
  poor: "#dc2626",
};

const BAND_TEXT: Record<ScoreBand, string> = {
  excellent: "text-emerald-700",
  good: "text-brand",
  fair: "text-amber-700",
  poor: "text-red-700",
};

function ScoreGauge({
  score,
  band,
}: {
  score: number;
  band: ScoreBand;
}) {
  const size = 92;
  const radius = size / 2 - 7;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="7"
          fill="none"
          stroke="currentColor"
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="7"
          fill="none"
          stroke={BAND_STROKES[band]}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-2xl font-semibold tabular-nums">{score}</span>
    </div>
  );
}

function ScoresPanel({ a, b }: { a: Parsed; b: Parsed }) {
  const scoreA = computeQualityScore(a);
  const scoreB = computeQualityScore(b);
  const delta = scoreB.score - scoreA.score;
  const deltaPositive = delta > 0;
  const deltaZero = delta === 0;

  const labelA =
    a.policy?.insurer || a.policy?.brand || "Policy A";
  const labelB =
    b.policy?.insurer || b.policy?.brand || "Policy B";

  return (
    <section className="mb-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 text-[10px] font-medium uppercase tracking-wider text-muted">
        Cover quality
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <ScoreGauge score={scoreA.score} band={scoreA.band} />
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-muted">
              {labelA}
            </div>
            <div
              className={`mt-0.5 text-sm font-semibold tracking-tight ${BAND_TEXT[scoreA.band]}`}
            >
              {scoreA.bandLabel}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`text-lg font-semibold tabular-nums ${
              deltaZero
                ? "text-muted"
                : deltaPositive
                  ? "text-emerald-700"
                  : "text-amber-700"
            }`}
          >
            {deltaZero ? "=" : deltaPositive ? `+${delta}` : delta}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted">
            {deltaZero ? "same" : deltaPositive ? "B better" : "A better"}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-4">
          <div className="min-w-0 text-right">
            <div className="truncate text-xs font-semibold text-muted">
              {labelB}
            </div>
            <div
              className={`mt-0.5 text-sm font-semibold tracking-tight ${BAND_TEXT[scoreB.band]}`}
            >
              {scoreB.bandLabel}
            </div>
          </div>
          <ScoreGauge score={scoreB.score} band={scoreB.band} />
        </div>
      </div>
    </section>
  );
}

type DiffDirection = "better" | "worse" | "neutral" | "same";

interface CompareRowProps {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  diff: DiffDirection;
}

function CompareRow({ label, a, b, diff }: CompareRowProps) {
  const valueTone =
    diff === "better"
      ? "text-emerald-700 dark:text-emerald-400"
      : diff === "worse"
        ? "text-amber-700 dark:text-amber-400"
        : "text-foreground";

  const rowBg =
    diff === "same"
      ? ""
      : diff === "better"
        ? "bg-emerald-500/[0.04]"
        : diff === "worse"
          ? "bg-amber-500/[0.04]"
          : "";

  return (
    <div
      className={`grid grid-cols-[1.1fr_1fr_1fr] items-center gap-2 border-b border-border/50 px-3 py-2 last:border-b-0 sm:gap-3 sm:px-4 ${rowBg}`}
    >
      <span className="min-w-0 truncate text-[11px] text-muted sm:text-sm">
        {label}
      </span>
      <span className="min-w-0 break-words text-right text-xs font-medium sm:text-sm">
        {a}
      </span>
      <span
        className={`min-w-0 break-words text-right text-xs font-medium sm:text-sm ${valueTone}`}
      >
        {b}
      </span>
    </div>
  );
}

function CompareCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <header className="border-b border-border px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          {title}
        </h3>
      </header>
      <div>{children}</div>
    </section>
  );
}

function numDiff(
  a: number | null | undefined,
  b: number | null | undefined,
  higherIsBetter: boolean,
): DiffDirection {
  if (a == null || b == null) return "neutral";
  if (a === b) return "same";
  if (higherIsBetter) return b > a ? "better" : "worse";
  return b < a ? "better" : "worse";
}

function boolDiff(
  a: boolean | null | undefined,
  b: boolean | null | undefined,
  trueIsBetter: boolean,
): DiffDirection {
  if (a == null || b == null) return "neutral";
  if (a === b) return "same";
  if (trueIsBetter) return b === true ? "better" : "worse";
  return b === false ? "better" : "worse";
}

function fmtGbp(value: number | null | undefined): string {
  return gbp(value ?? null);
}

function fmtNum(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString();
}

function fmtYear(value: number | null | undefined): string {
  if (value == null) return "—";
  return String(value);
}

export function ComparisonView({
  a,
  b,
  onReset,
}: {
  a: Parsed;
  b: Parsed;
  onReset: () => void;
}) {
  const policyA = a.policy ?? {};
  const policyB = b.policy ?? {};
  const propertyA = a.property ?? {};
  const propertyB = b.property ?? {};
  const coverA = a.cover ?? {};
  const coverB = b.cover ?? {};
  const excessesA = a.excesses ?? {};
  const excessesB = b.excesses ?? {};

  const buildingsA = coverA.buildings ?? {};
  const buildingsB = coverB.buildings ?? {};
  const contentsA = coverA.contents ?? {};
  const contentsB = coverB.contents ?? {};
  const ppA = coverA.personal_possessions ?? {};
  const ppB = coverB.personal_possessions ?? {};
  const legalA = coverA.legal_expenses ?? {};
  const legalB = coverB.legal_expenses ?? {};
  const emergencyA = coverA.home_emergency ?? {};
  const emergencyB = coverB.home_emergency ?? {};

  const labelA = policyA.insurer || policyA.brand || "Policy A";
  const labelB = policyB.insurer || policyB.brand || "Policy B";

  const premiumDelta =
    policyA.annual_premium_gbp != null && policyB.annual_premium_gbp != null
      ? policyB.annual_premium_gbp - policyA.annual_premium_gbp
      : null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Side-by-side comparison
          </h2>
          <p className="mt-1 text-sm text-muted">
            Differences in cover, excesses and premium between your two
            documents.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-muted underline decoration-dotted underline-offset-4 hover:text-foreground"
        >
          Reset comparison
        </button>
      </div>

      <ScoresPanel a={a} b={b} />

      <div className="mb-5 grid grid-cols-[1.1fr_1fr_1fr] items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-xs sm:gap-3 sm:px-4 sm:text-sm">
        <span className="font-medium text-muted">Source</span>
        <span className="min-w-0 truncate text-right font-semibold">
          {labelA}
        </span>
        <span className="min-w-0 truncate text-right font-semibold">
          {labelB}
        </span>
      </div>

      <div className="space-y-4">
        <CompareCard title="Policy">
          <CompareRow
            label="Insurer"
            a={text(policyA.insurer)}
            b={text(policyB.insurer)}
            diff={
              policyA.insurer === policyB.insurer ? "same" : "neutral"
            }
          />
          <CompareRow
            label="Document"
            a={text(policyA.document_type)}
            b={text(policyB.document_type)}
            diff="neutral"
          />
          <CompareRow
            label="Annual premium"
            a={fmtGbp(policyA.annual_premium_gbp)}
            b={
              <span>
                {fmtGbp(policyB.annual_premium_gbp)}
                {premiumDelta != null && premiumDelta !== 0 ? (
                  <span className="ml-1 text-xs">
                    ({premiumDelta < 0 ? "−" : "+"}
                    {fmtGbp(Math.abs(premiumDelta))})
                  </span>
                ) : null}
              </span>
            }
            diff={numDiff(
              policyA.annual_premium_gbp,
              policyB.annual_premium_gbp,
              false,
            )}
          />
          <CompareRow
            label="Monthly premium"
            a={fmtGbp(policyA.monthly_premium_gbp)}
            b={fmtGbp(policyB.monthly_premium_gbp)}
            diff={numDiff(
              policyA.monthly_premium_gbp,
              policyB.monthly_premium_gbp,
              false,
            )}
          />
        </CompareCard>

        <CompareCard title="Property">
          <CompareRow
            label="Address"
            a={text(propertyA.address)}
            b={text(propertyB.address)}
            diff="same"
          />
          <CompareRow
            label="Postcode"
            a={text(propertyA.postcode)}
            b={text(propertyB.postcode)}
            diff="same"
          />
          <CompareRow
            label="Type"
            a={text(propertyA.property_type)}
            b={text(propertyB.property_type)}
            diff="same"
          />
          <CompareRow
            label="Year built"
            a={fmtYear(propertyA.year_built)}
            b={fmtYear(propertyB.year_built)}
            diff="same"
          />
        </CompareCard>

        <CompareCard title="Buildings cover">
          <CompareRow
            label="Included"
            a={yesNo(buildingsA.included)}
            b={yesNo(buildingsB.included)}
            diff={boolDiff(buildingsA.included, buildingsB.included, true)}
          />
          <CompareRow
            label="Sum insured"
            a={fmtGbp(buildingsA.sum_insured_gbp)}
            b={fmtGbp(buildingsB.sum_insured_gbp)}
            diff={numDiff(
              buildingsA.sum_insured_gbp,
              buildingsB.sum_insured_gbp,
              true,
            )}
          />
          <CompareRow
            label="Accidental damage"
            a={yesNo(buildingsA.accidental_damage)}
            b={yesNo(buildingsB.accidental_damage)}
            diff={boolDiff(
              buildingsA.accidental_damage,
              buildingsB.accidental_damage,
              true,
            )}
          />
        </CompareCard>

        <CompareCard title="Contents cover">
          <CompareRow
            label="Included"
            a={yesNo(contentsA.included)}
            b={yesNo(contentsB.included)}
            diff={boolDiff(contentsA.included, contentsB.included, true)}
          />
          <CompareRow
            label="Sum insured"
            a={fmtGbp(contentsA.sum_insured_gbp)}
            b={fmtGbp(contentsB.sum_insured_gbp)}
            diff={numDiff(
              contentsA.sum_insured_gbp,
              contentsB.sum_insured_gbp,
              true,
            )}
          />
          <CompareRow
            label="Accidental damage"
            a={yesNo(contentsA.accidental_damage)}
            b={yesNo(contentsB.accidental_damage)}
            diff={boolDiff(
              contentsA.accidental_damage,
              contentsB.accidental_damage,
              true,
            )}
          />
        </CompareCard>

        <CompareCard title="Excesses">
          <CompareRow
            label="Buildings compulsory"
            a={fmtGbp(excessesA.buildings_compulsory_gbp)}
            b={fmtGbp(excessesB.buildings_compulsory_gbp)}
            diff={numDiff(
              excessesA.buildings_compulsory_gbp,
              excessesB.buildings_compulsory_gbp,
              false,
            )}
          />
          <CompareRow
            label="Buildings voluntary"
            a={fmtGbp(excessesA.buildings_voluntary_gbp)}
            b={fmtGbp(excessesB.buildings_voluntary_gbp)}
            diff={numDiff(
              excessesA.buildings_voluntary_gbp,
              excessesB.buildings_voluntary_gbp,
              false,
            )}
          />
          <CompareRow
            label="Contents compulsory"
            a={fmtGbp(excessesA.contents_compulsory_gbp)}
            b={fmtGbp(excessesB.contents_compulsory_gbp)}
            diff={numDiff(
              excessesA.contents_compulsory_gbp,
              excessesB.contents_compulsory_gbp,
              false,
            )}
          />
          <CompareRow
            label="Escape of water"
            a={fmtGbp(excessesA.escape_of_water_gbp)}
            b={fmtGbp(excessesB.escape_of_water_gbp)}
            diff={numDiff(
              excessesA.escape_of_water_gbp,
              excessesB.escape_of_water_gbp,
              false,
            )}
          />
          <CompareRow
            label="Subsidence"
            a={fmtGbp(excessesA.subsidence_gbp)}
            b={fmtGbp(excessesB.subsidence_gbp)}
            diff={numDiff(
              excessesA.subsidence_gbp,
              excessesB.subsidence_gbp,
              false,
            )}
          />
          <CompareRow
            label="Accidental damage"
            a={fmtGbp(excessesA.accidental_damage_gbp)}
            b={fmtGbp(excessesB.accidental_damage_gbp)}
            diff={numDiff(
              excessesA.accidental_damage_gbp,
              excessesB.accidental_damage_gbp,
              false,
            )}
          />
        </CompareCard>

        <CompareCard title="Optional extras">
          <CompareRow
            label="Personal possessions"
            a={
              ppA.included
                ? `${fmtGbp(ppA.limit_gbp)}${ppA.away_from_home ? " · away" : ""}`
                : yesNo(ppA.included)
            }
            b={
              ppB.included
                ? `${fmtGbp(ppB.limit_gbp)}${ppB.away_from_home ? " · away" : ""}`
                : yesNo(ppB.included)
            }
            diff={boolDiff(ppA.included, ppB.included, true)}
          />
          <CompareRow
            label="Legal expenses"
            a={legalA.included ? fmtGbp(legalA.limit_gbp) : yesNo(legalA.included)}
            b={legalB.included ? fmtGbp(legalB.limit_gbp) : yesNo(legalB.included)}
            diff={boolDiff(legalA.included, legalB.included, true)}
          />
          <CompareRow
            label="Home emergency"
            a={
              emergencyA.included
                ? fmtGbp(emergencyA.limit_gbp)
                : yesNo(emergencyA.included)
            }
            b={
              emergencyB.included
                ? fmtGbp(emergencyB.limit_gbp)
                : yesNo(emergencyB.included)
            }
            diff={boolDiff(emergencyA.included, emergencyB.included, true)}
          />
        </CompareCard>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted">
        <span className="mr-3 inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Better in B
        </span>
        <span className="mr-3 inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Worse in B
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-border" /> Same / unknown
        </span>
      </div>
    </div>
  );
}
