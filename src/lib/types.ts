export type SpecifiedItem = {
  description?: string | null;
  value_gbp?: number | null;
  away_from_home?: boolean | null;
};

export type Claim = {
  date?: string | null;
  type?: string | null;
  amount_gbp?: number | null;
  status?: string | null;
};

export type Parsed = {
  policyholder?: {
    name?: string | null;
    date_of_birth?: string | null;
    occupation?: string | null;
    marital_status?: string | null;
  };
  policy?: {
    insurer?: string | null;
    brand?: string | null;
    policy_number?: string | null;
    quote_reference?: string | null;
    document_type?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    renewal_date?: string | null;
    annual_premium_gbp?: number | null;
    monthly_premium_gbp?: number | null;
    payment_method?: string | null;
  };
  property?: {
    address?: string | null;
    postcode?: string | null;
    property_type?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    year_built?: number | null;
    construction_type?: string | null;
    roof_type?: string | null;
    flat_roof_percentage?: number | null;
    listed_status?: string | null;
    ownership_status?: string | null;
    occupancy?: string | null;
    business_use?: string | boolean | null;
    number_of_adults?: number | null;
    number_of_children?: number | null;
    smoker?: boolean | null;
    pets?: string | boolean | null;
    security_features?: string[] | null;
    flood_risk_notes?: string | null;
    subsidence_notes?: string | null;
  };
  cover?: {
    buildings?: CoverSection;
    contents?: CoverSection;
    personal_possessions?: {
      included?: boolean | null;
      limit_gbp?: number | null;
      away_from_home?: boolean | null;
      specified_items?: SpecifiedItem[] | null;
    };
    legal_expenses?: { included?: boolean | null; limit_gbp?: number | null };
    home_emergency?: { included?: boolean | null; limit_gbp?: number | null };
    bike_cover?: { included?: boolean | null; limit_gbp?: number | null };
    valuables_limit?: number | null;
    single_item_limit_gbp?: number | null;
    alternative_accommodation_limit_gbp?: number | null;
  };
  excesses?: {
    buildings_compulsory_gbp?: number | null;
    buildings_voluntary_gbp?: number | null;
    contents_compulsory_gbp?: number | null;
    contents_voluntary_gbp?: number | null;
    escape_of_water_gbp?: number | null;
    subsidence_gbp?: number | null;
    accidental_damage_gbp?: number | null;
    personal_possessions_gbp?: number | null;
  };
  claims?: Claim[] | null;
  endorsements?: string[] | null;
  exclusions?: string[] | null;
  assumptions?: string[] | null;
  missing_information?: string[] | null;
  raw_summary?: string | null;
  error?: string;
  raw_response?: string;
};

export type CoverSection = {
  included?: boolean | null;
  sum_insured_gbp?: number | null;
  accidental_damage?: boolean | null;
  no_claims_discount_years?: number | null;
};

export type UploadResponse = {
  success: boolean;
  extracted_text_preview?: string;
  parsed?: Parsed;
  error?: string;
};
