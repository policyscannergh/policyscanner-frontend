import type { Parsed } from "./types";
import { estimateRebuildCost } from "./rebuildCost";

export type ScoreBand = "excellent" | "good" | "fair" | "poor";

export interface ScorePoint {
  label: string;
  points: number;
}

export interface QualityScore {
  score: number;
  band: ScoreBand;
  bandLabel: string;
  bandDescription: string;
  deductions: ScorePoint[];
  bonuses: ScorePoint[];
}

function bandFor(score: number): {
  band: ScoreBand;
  label: string;
  description: string;
} {
  if (score >= 80)
    return {
      band: "excellent",
      label: "Comprehensive",
      description: "Strong cover with few gaps. Worth keeping or matching.",
    };
  if (score >= 65)
    return {
      band: "good",
      label: "Decent",
      description:
        "Solid cover with a few areas worth tightening at renewal.",
    };
  if (score >= 45)
    return {
      band: "fair",
      label: "Several gaps",
      description:
        "Real holes in your cover — worth shopping around for alternatives.",
    };
  return {
    band: "poor",
    label: "Significant gaps",
    description:
      "This policy leaves you exposed in several common claim scenarios.",
  };
}

export function computeQualityScore(data: Parsed): QualityScore {
  const deductions: ScorePoint[] = [];
  const bonuses: ScorePoint[] = [];

  const cover = data.cover ?? {};
  const excesses = data.excesses ?? {};
  const buildings = cover.buildings ?? {};
  const contents = cover.contents ?? {};
  const pp = cover.personal_possessions ?? {};
  const legal = cover.legal_expenses ?? {};
  const emergency = cover.home_emergency ?? {};

  if (buildings.included && buildings.accidental_damage === false) {
    deductions.push({ label: "No buildings accidental damage", points: 15 });
  }
  if (contents.included && contents.accidental_damage === false) {
    deductions.push({ label: "No contents accidental damage", points: 10 });
  }
  if (
    buildings.accidental_damage === true &&
    contents.accidental_damage === true
  ) {
    bonuses.push({ label: "Full accidental damage cover", points: 5 });
  }

  if (pp.included === false) {
    deductions.push({ label: "No personal possessions cover", points: 5 });
  } else if (pp.included === true && pp.away_from_home === true) {
    bonuses.push({ label: "Personal possessions away cover", points: 3 });
  }

  if (legal.included === false) {
    deductions.push({ label: "No legal expenses cover", points: 5 });
  }
  if (emergency.included === false) {
    deductions.push({ label: "No home emergency cover", points: 3 });
  }

  if (excesses.subsidence_gbp != null && excesses.subsidence_gbp >= 1000) {
    deductions.push({
      label: `High subsidence excess (£${excesses.subsidence_gbp.toLocaleString()})`,
      points: 8,
    });
  }
  if (
    excesses.escape_of_water_gbp != null &&
    excesses.escape_of_water_gbp >= 750
  ) {
    deductions.push({
      label: `High escape-of-water excess (£${excesses.escape_of_water_gbp})`,
      points: 5,
    });
  }

  const rebuild = estimateRebuildCost(data);
  if (rebuild?.verdict === "under") {
    deductions.push({
      label: "Under-insured vs rebuild cost",
      points: 15,
    });
  } else if (rebuild?.verdict === "over") {
    deductions.push({
      label: "Over-insured (wasted premium)",
      points: 3,
    });
  }

  const totalDeductions = deductions.reduce((s, d) => s + d.points, 0);
  const totalBonuses = bonuses.reduce((s, b) => s + b.points, 0);
  const score = Math.max(0, Math.min(100, 100 - totalDeductions + totalBonuses));

  const bandInfo = bandFor(score);

  return {
    score,
    band: bandInfo.band,
    bandLabel: bandInfo.label,
    bandDescription: bandInfo.description,
    deductions,
    bonuses,
  };
}
