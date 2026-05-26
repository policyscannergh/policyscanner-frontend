import type { Parsed } from "./types";

export type RecommendationTone = "warn" | "info" | "good";

export interface Recommendation {
  tone: RecommendationTone;
  title: string;
  body: string;
  insurers?: string[];
}

const INSURERS = {
  accidental_damage_default: ["Aviva Plus", "LV= Britannia", "NFU Mutual Bespoke"],
  older_property: ["Hiscox", "NFU Mutual", "Chubb"],
  competitive_standard: ["Direct Line", "Admiral", "Hastings Premier", "Churchill"],
};

export function generateRecommendations(data: Parsed): Recommendation[] {
  const recs: Recommendation[] = [];
  const cover = data.cover ?? {};
  const excesses = data.excesses ?? {};
  const buildings = cover.buildings ?? {};
  const contents = cover.contents ?? {};
  const pp = cover.personal_possessions ?? {};
  const legal = cover.legal_expenses ?? {};
  const emergency = cover.home_emergency ?? {};
  const property = data.property ?? {};
  const policy = data.policy ?? {};

  if (buildings.included && buildings.accidental_damage === false) {
    recs.push({
      tone: "warn",
      title: "No accidental damage cover on buildings",
      body: "Common claims like a foot through the ceiling, a drilled-through pipe, or a TV dropped onto a wall won't be covered. Worth looking for a policy that includes it as standard.",
      insurers: INSURERS.accidental_damage_default,
    });
  }

  if (contents.included && contents.accidental_damage === false) {
    recs.push({
      tone: "warn",
      title: "No accidental damage cover on contents",
      body: "Spilled wine on the sofa, a dropped laptop, a broken vase — not covered. Typically £20–40/year extra to add.",
      insurers: INSURERS.accidental_damage_default,
    });
  }

  if (excesses.subsidence_gbp && excesses.subsidence_gbp >= 1000) {
    recs.push({
      tone: "warn",
      title: `£${excesses.subsidence_gbp.toLocaleString()} subsidence excess`,
      body: "Subsidence claims often run £20k–80k+, so a high excess is standard — but specialist insurers offer lower options for properties with no subsidence history.",
      insurers: INSURERS.older_property,
    });
  }

  if (excesses.escape_of_water_gbp && excesses.escape_of_water_gbp >= 750) {
    recs.push({
      tone: "info",
      title: `High escape-of-water excess (£${excesses.escape_of_water_gbp.toLocaleString()})`,
      body: "Escape of water is the most common home insurance claim. £350–£500 excess is more typical on competitive policies.",
    });
  }

  if (pp.included === false) {
    recs.push({
      tone: "info",
      title: "No personal possessions cover",
      body: "If you take valuables outside the home — phone, laptop, jewellery, bike — they aren't covered. Away-cover is typically ~£30/year.",
    });
  }

  if (legal.included === false) {
    recs.push({
      tone: "info",
      title: "No legal expenses cover",
      body: "Adds ~£20/year and covers disputes with neighbours, employers, contractors, and consumer issues up to £50–100k. Frequently overlooked add-on with real value.",
    });
  }

  if (emergency.included === false) {
    recs.push({
      tone: "info",
      title: "No home emergency cover",
      body: "Boiler breakdowns, blocked drains, lost keys — usually same-day callout. Adds ~£40–60/year. Skip if you're a confident DIYer.",
    });
  }

  if (property.year_built && property.year_built < 1950) {
    recs.push({
      tone: "info",
      title: `Older property (built ${property.year_built})`,
      body: "Period properties have specific risks — subsidence, traditional construction, lath-and-plaster. Specialist insurers underwrite older homes better and price more fairly.",
      insurers: INSURERS.older_property,
    });
  }

  if (
    policy.annual_premium_gbp &&
    policy.annual_premium_gbp > 600 &&
    buildings.sum_insured_gbp &&
    buildings.sum_insured_gbp < 750000
  ) {
    recs.push({
      tone: "info",
      title: "Premium looks high for the cover level",
      body: `£${policy.annual_premium_gbp.toLocaleString()} feels high for £${(buildings.sum_insured_gbp / 1000).toFixed(0)}k of buildings cover. Compare against direct and broker quotes — saving £100–200/year is common.`,
      insurers: INSURERS.competitive_standard,
    });
  }

  if (buildings.accidental_damage && contents.accidental_damage) {
    recs.push({
      tone: "good",
      title: "Full accidental damage cover",
      body: "Both buildings and contents include AD. That's better than most competitive policies.",
    });
  }

  if (recs.length === 0) {
    recs.push({
      tone: "good",
      title: "Cover looks comprehensive",
      body: "We didn't spot obvious gaps. Still worth benchmarking against 2–3 alternative quotes at renewal — pricing is the main variable.",
    });
  }

  return recs;
}

export function moneySupermarketUrl(_data: Parsed): string {
  return "https://www.moneysupermarket.com/home-insurance/";
}
