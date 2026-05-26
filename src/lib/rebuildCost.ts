import type { Parsed } from "./types";

type Region =
  | "london"
  | "outer_london"
  | "south"
  | "east"
  | "midlands"
  | "north"
  | "scotland"
  | "wales"
  | "ni"
  | "uk";

const LONDON = new Set(["E", "EC", "N", "NW", "SE", "SW", "W", "WC"]);

const OUTER_LONDON_SE = new Set([
  "AL", "BR", "CR", "DA", "EN", "HA", "HP", "IG", "KT", "LU",
  "MK", "OX", "RM", "SG", "SL", "SM", "TW", "UB", "WD",
]);

const SOUTH = new Set([
  "BN", "CT", "GU", "ME", "PO", "RG", "RH", "SO", "TN",
  "BA", "BH", "BS", "DT", "EX", "GL", "PL", "SN", "SP", "TA", "TQ", "TR",
]);

const EAST = new Set(["CB", "CM", "CO", "IP", "NR", "PE", "SS"]);

const MIDLANDS = new Set([
  "B", "CV", "DE", "DY", "HR", "LE", "NG", "NN", "ST", "TF",
  "WR", "WS", "WV", "DN", "LN",
]);

const NORTH = new Set([
  "BB", "BL", "BD", "CA", "CH", "CW", "DH", "DL", "FY", "HD",
  "HG", "HU", "HX", "L", "LA", "LS", "M", "NE", "OL", "PR",
  "S", "SK", "SR", "TS", "WA", "WF", "WN", "YO",
]);

const SCOTLAND = new Set([
  "AB", "DD", "DG", "EH", "FK", "G", "HS", "IV", "KA", "KW",
  "KY", "ML", "PA", "PH", "TD", "ZE",
]);

const WALES = new Set(["CF", "LD", "LL", "NP", "SA", "SY"]);
const NI = new Set(["BT"]);

const REGION_INFO: Record<Region, { name: string; rate: number }> = {
  london:       { name: "Greater London",    rate: 2500 },
  outer_london: { name: "Outer London / SE", rate: 2100 },
  south:        { name: "South",             rate: 1950 },
  east:         { name: "East",              rate: 1900 },
  midlands:     { name: "Midlands",          rate: 1850 },
  north:        { name: "North",             rate: 1750 },
  scotland:     { name: "Scotland",          rate: 1700 },
  wales:        { name: "Wales",             rate: 1750 },
  ni:           { name: "Northern Ireland",  rate: 1600 },
  uk:           { name: "UK average",        rate: 1900 },
};

function postcodeRegion(postcode: string): Region {
  const cleaned = postcode.replace(/\s+/g, "").toUpperCase();
  const area = cleaned.match(/^([A-Z]{1,2})/)?.[1] ?? "";
  if (LONDON.has(area)) return "london";
  if (OUTER_LONDON_SE.has(area)) return "outer_london";
  if (SOUTH.has(area)) return "south";
  if (EAST.has(area)) return "east";
  if (MIDLANDS.has(area)) return "midlands";
  if (NORTH.has(area)) return "north";
  if (SCOTLAND.has(area)) return "scotland";
  if (WALES.has(area)) return "wales";
  if (NI.has(area)) return "ni";
  return "uk";
}

type PropertyCategory = "flat" | "terrace" | "semi" | "detached" | "bungalow";

const SIZE_TABLE: Record<PropertyCategory, Record<number, number>> = {
  flat:     { 1: 50, 2: 65, 3: 80,  4: 95 },
  terrace:  { 2: 70, 3: 85, 4: 105, 5: 125 },
  semi:     { 2: 80, 3: 95, 4: 115, 5: 135 },
  detached: { 2: 95, 3: 120, 4: 150, 5: 185, 6: 220 },
  bungalow: { 2: 75, 3: 90, 4: 110 },
};

function classifyType(type: string): PropertyCategory | null {
  const t = type.toLowerCase();
  if (t.includes("flat") || t.includes("apartment") || t.includes("maisonette"))
    return "flat";
  if (t.includes("bungalow")) return "bungalow";
  if (
    t.includes("terrace") ||
    t.includes("terraced") ||
    t.includes("mid-terrace") ||
    t.includes("end-terrace")
  )
    return "terrace";
  if (t.includes("semi")) return "semi";
  if (t.includes("detached")) return "detached";
  return null;
}

function clampBeds(beds: number, table: Record<number, number>): number {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  return Math.max(keys[0], Math.min(keys[keys.length - 1], beds));
}

export interface RebuildEstimate {
  estimatedCost: number;
  insured: number | null;
  region: string;
  rate: number;
  size: number;
  category: PropertyCategory;
  bedrooms: number;
  verdict: "under" | "adequate" | "over" | "unknown";
  deltaPct: number | null;
}

export function estimateRebuildCost(data: Parsed): RebuildEstimate | null {
  const property = data.property ?? {};
  const cover = data.cover ?? {};
  const buildings = cover.buildings ?? {};

  if (!property.postcode || !property.property_type || !property.bedrooms) {
    return null;
  }

  const category = classifyType(property.property_type);
  if (!category) return null;

  const table = SIZE_TABLE[category];
  const beds = clampBeds(property.bedrooms, table);
  const size = table[beds];

  const region = postcodeRegion(property.postcode);
  const info = REGION_INFO[region];

  const estimatedCost = Math.round((size * info.rate) / 1000) * 1000;
  const insured = buildings.sum_insured_gbp ?? null;

  let verdict: RebuildEstimate["verdict"] = "unknown";
  let deltaPct: number | null = null;
  if (insured != null) {
    deltaPct = ((insured - estimatedCost) / estimatedCost) * 100;
    if (deltaPct < -15) verdict = "under";
    else if (deltaPct > 50) verdict = "over";
    else verdict = "adequate";
  }

  return {
    estimatedCost,
    insured,
    region: info.name,
    rate: info.rate,
    size,
    category,
    bedrooms: beds,
    verdict,
    deltaPct,
  };
}
