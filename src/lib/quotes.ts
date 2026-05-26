import type { Parsed } from "./types";

export interface AlternativeQuote {
  insurer: string;
  brand: string;
  annual_premium_gbp: number;
  monthly_premium_gbp: number;
  positioning: "competitive" | "comprehensive" | "premium";
  fixes: string[];
  highlights: string[];
}

interface InsurerProfile {
  insurer: string;
  brand: string;
  positioning: AlternativeQuote["positioning"];
  multiplier: number;
  includes_buildings_ad: boolean;
  includes_contents_ad: boolean;
  includes_legal: boolean;
  includes_emergency: boolean;
  includes_pp_away: boolean;
  baseline_highlights: string[];
}

const PROFILES: InsurerProfile[] = [
  {
    insurer: "Direct Line",
    brand: "Home Plus",
    positioning: "competitive",
    multiplier: 0.92,
    includes_buildings_ad: false,
    includes_contents_ad: true,
    includes_legal: false,
    includes_emergency: false,
    includes_pp_away: false,
    baseline_highlights: [
      "Direct-only, no broker fees",
      "24/7 UK claims line",
    ],
  },
  {
    insurer: "Aviva",
    brand: "Aviva Plus",
    positioning: "comprehensive",
    multiplier: 1.04,
    includes_buildings_ad: true,
    includes_contents_ad: true,
    includes_legal: true,
    includes_emergency: false,
    includes_pp_away: true,
    baseline_highlights: [
      "Accidental damage included as standard",
      "£3k personal possessions away cover",
    ],
  },
  {
    insurer: "Hiscox",
    brand: "606 Home",
    positioning: "premium",
    multiplier: 1.32,
    includes_buildings_ad: true,
    includes_contents_ad: true,
    includes_legal: true,
    includes_emergency: true,
    includes_pp_away: true,
    baseline_highlights: [
      "New-for-old contents replacement",
      "No single-item limit on most contents",
      "Specialist period-property underwriting",
    ],
  },
];

function estimateBasePremium(data: Parsed): number {
  const cover = data.cover ?? {};
  const property = data.property ?? {};
  const buildings = cover.buildings ?? {};
  const contents = cover.contents ?? {};

  const buildingsComponent = (buildings.sum_insured_gbp ?? 300000) / 5500;
  const contentsComponent = (contents.sum_insured_gbp ?? 40000) / 4500;
  let base = 180 + buildingsComponent + contentsComponent;

  if (property.year_built) {
    if (property.year_built < 1850) base *= 1.45;
    else if (property.year_built < 1900) base *= 1.25;
    else if (property.year_built < 1950) base *= 1.12;
  }

  if (property.listed_status && property.listed_status !== "Not listed") {
    base *= 1.2;
  }

  return Math.round(base);
}

export function generateAlternatives(data: Parsed): AlternativeQuote[] {
  const policy = data.policy ?? {};
  const cover = data.cover ?? {};
  const buildings = cover.buildings ?? {};
  const contents = cover.contents ?? {};
  const pp = cover.personal_possessions ?? {};
  const legal = cover.legal_expenses ?? {};
  const emergency = cover.home_emergency ?? {};

  const referencePremium = policy.annual_premium_gbp ?? estimateBasePremium(data);

  return PROFILES.map((profile) => {
    const annual = Math.round(referencePremium * profile.multiplier);
    const monthly = Math.round((annual / 12) * 100) / 100;

    const fixes: string[] = [];
    if (profile.includes_buildings_ad && buildings.accidental_damage === false) {
      fixes.push("Adds accidental damage on buildings");
    }
    if (profile.includes_contents_ad && contents.accidental_damage === false) {
      fixes.push("Adds accidental damage on contents");
    }
    if (profile.includes_legal && legal.included === false) {
      fixes.push("Adds legal expenses cover");
    }
    if (profile.includes_emergency && emergency.included === false) {
      fixes.push("Adds home emergency cover");
    }
    if (profile.includes_pp_away && pp.included === false) {
      fixes.push("Adds personal possessions away cover");
    }

    return {
      insurer: profile.insurer,
      brand: profile.brand,
      annual_premium_gbp: annual,
      monthly_premium_gbp: monthly,
      positioning: profile.positioning,
      fixes,
      highlights: profile.baseline_highlights,
    };
  });
}
