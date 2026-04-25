import type { Parsed } from "@/lib/types";
import { gbp, text, yesNo } from "@/lib/format";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
        {title}
      </h3>
      <div className="mt-3 space-y-2 text-sm">{children}</div>
    </section>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/50 py-1.5 last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warn" | "good";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-border/40 text-foreground",
    warn: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    good: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ResultsView({ data }: { data: Parsed }) {
  const policy = data.policy ?? {};
  const property = data.property ?? {};
  const cover = data.cover ?? {};
  const excesses = data.excesses ?? {};
  const buildings = cover.buildings ?? {};
  const contents = cover.contents ?? {};
  const pp = cover.personal_possessions ?? {};
  const legal = cover.legal_expenses ?? {};
  const emergency = cover.home_emergency ?? {};
  const bike = cover.bike_cover ?? {};
  const specifiedItems = pp.specified_items ?? [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Policy">
        <Row label="Insurer" value={text(policy.insurer)} />
        {policy.brand ? <Row label="Brand" value={text(policy.brand)} /> : null}
        <Row label="Policy number" value={text(policy.policy_number)} />
        <Row label="Document" value={text(policy.document_type)} />
        <Row label="Start" value={text(policy.start_date)} />
        <Row label="End" value={text(policy.end_date)} />
        <Row label="Annual premium" value={gbp(policy.annual_premium_gbp)} />
        <Row label="Monthly premium" value={gbp(policy.monthly_premium_gbp)} />
        <Row label="Payment" value={text(policy.payment_method)} />
      </Card>

      <Card title="Property">
        <Row label="Address" value={text(property.address)} />
        <Row label="Postcode" value={text(property.postcode)} />
        <Row label="Type" value={text(property.property_type)} />
        <Row label="Bedrooms" value={text(property.bedrooms)} />
        <Row label="Year built" value={text(property.year_built)} />
        <Row label="Construction" value={text(property.construction_type)} />
        <Row label="Roof" value={text(property.roof_type)} />
        <Row label="Listed" value={text(property.listed_status)} />
        <Row label="Occupancy" value={text(property.occupancy)} />
      </Card>

      <Card title="Buildings cover">
        <Row label="Included" value={yesNo(buildings.included)} />
        <Row label="Sum insured" value={gbp(buildings.sum_insured_gbp)} />
        <Row
          label="Accidental damage"
          value={yesNo(buildings.accidental_damage)}
        />
        <Row label="Compulsory excess" value={gbp(excesses.buildings_compulsory_gbp)} />
        <Row label="Voluntary excess" value={gbp(excesses.buildings_voluntary_gbp)} />
      </Card>

      <Card title="Contents cover">
        <Row label="Included" value={yesNo(contents.included)} />
        <Row label="Sum insured" value={gbp(contents.sum_insured_gbp)} />
        <Row
          label="Accidental damage"
          value={yesNo(contents.accidental_damage)}
        />
        <Row label="Compulsory excess" value={gbp(excesses.contents_compulsory_gbp)} />
        <Row label="Voluntary excess" value={gbp(excesses.contents_voluntary_gbp)} />
      </Card>

      <Card title="Specific excesses">
        <Row label="Escape of water" value={gbp(excesses.escape_of_water_gbp)} />
        <Row label="Subsidence" value={gbp(excesses.subsidence_gbp)} />
        <Row label="Accidental damage" value={gbp(excesses.accidental_damage_gbp)} />
        <Row
          label="Personal possessions"
          value={gbp(excesses.personal_possessions_gbp)}
        />
      </Card>

      <Card title="Optional extras">
        <Row
          label="Personal possessions"
          value={
            pp.included
              ? `${gbp(pp.limit_gbp)}${pp.away_from_home ? " · away cover" : ""}`
              : yesNo(pp.included)
          }
        />
        <Row
          label="Legal expenses"
          value={legal.included ? gbp(legal.limit_gbp) : yesNo(legal.included)}
        />
        <Row
          label="Home emergency"
          value={
            emergency.included
              ? gbp(emergency.limit_gbp)
              : yesNo(emergency.included)
          }
        />
        <Row
          label="Bike cover"
          value={bike.included ? gbp(bike.limit_gbp) : yesNo(bike.included)}
        />
        <Row label="Valuables limit" value={gbp(cover.valuables_limit)} />
        <Row
          label="Single item limit"
          value={gbp(cover.single_item_limit_gbp)}
        />
        <Row
          label="Alt accommodation"
          value={gbp(cover.alternative_accommodation_limit_gbp)}
        />
      </Card>

      {specifiedItems.length > 0 ? (
        <Card title="Specified items">
          <ul className="space-y-2">
            {specifiedItems.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 last:border-b-0"
              >
                <span>{text(item.description)}</span>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{gbp(item.value_gbp)}</span>
                  {item.away_from_home ? (
                    <Pill tone="good">away from home</Pill>
                  ) : (
                    <Pill tone="warn">at home only</Pill>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {data.endorsements && data.endorsements.length > 0 ? (
        <Card title="Endorsements">
          <ul className="list-disc space-y-1 pl-5">
            {data.endorsements.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      {data.exclusions && data.exclusions.length > 0 ? (
        <Card title="Exclusions">
          <ul className="list-disc space-y-1 pl-5">
            {data.exclusions.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      {data.missing_information && data.missing_information.length > 0 ? (
        <Card title="Not found in document">
          <ul className="list-disc space-y-1 pl-5 text-muted">
            {data.missing_information.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      {data.raw_summary ? (
        <div className="md:col-span-2">
          <Card title="Summary">
            <p className="text-sm leading-relaxed">{data.raw_summary}</p>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
