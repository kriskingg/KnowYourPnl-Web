// Data models for KnowYourPNL (MTF)

export type VerificationStatus =
  | "official"
  | "account_verified"
  | "formula_tested"
  | "estimated"
  | "user_modified"
  | "review_required";

export interface EvidenceRecord {
  id: string;
  broker: string;
  planId?: string;
  chargeName: string;
  sourceTitle: string;
  sourceType: "official_pricing_page" | "account_statement" | "help_article" | "regulatory_notice" | "internal_test";
  sourceReference: string; // URL or citation
  effectiveDate: string; // ISO date
  lastCheckedDate: string; // ISO date
  publishedValue: string;
  observedValue?: string;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface ChargeDefinition {
  key: string;
  label: string;
  unit: "percent" | "flat" | "per_event" | "per_share" | "annual_percent" | "daily_percent";
  side?: "buy" | "sell" | "both";
  description?: string;
}

export interface ChargeRule {
  chargeKey: string;
  value: number; // interpreted per unit
  unit: ChargeDefinition["unit"];
  min?: number;
  max?: number;
  gstApplicable?: boolean;
  notes?: string;
  verificationStatus: VerificationStatus;
  evidenceId?: string;
}

export interface MtfConfiguration {
  annualInterestRatePct: number; // e.g. 14.99
  minMarginPct: number; // user margin required %
  brokerFundedPct: number; // e.g. 75
  pledgeFeeFlat: number;
  unpledgeFeeFlat: number;
  dpChargeFlat: number;
  gstOnCharges: number; // e.g. 18
  stt: { buy: number; sell: number }; // as % of turnover
  stampDuty: number; // % of buy turnover
  exchangeTxnPct: number; // % of turnover (buy+sell)
  sebiChargesPct: number; // % of turnover
  ipftPct: number; // % of turnover
}

export interface BrokeragePlan {
  id: string;
  name: string;
  description: string;
  buyBrokerage: ChargeRule;
  sellBrokerage: ChargeRule;
  isDefault?: boolean;
}

export interface TariffVersion {
  id: string;
  brokerSlug: string;
  planId: string;
  version: string; // e.g. v2026.02
  effectiveDate: string;
  publishedDate: string;
  supersedes?: string; // previous version id
  changeSummary: string;
  verificationStatus: VerificationStatus;
  lastCheckedDate: string;
}

export interface TariffChange {
  chargeKey: string;
  previousValue?: string;
  newValue: string;
  note?: string;
}

export interface Broker {
  slug: string;
  name: string;
  legalName: string;
  established: number;
  headquarters: string;
  sebiRegNo: string;
  overview: string;
  supportedProducts: string[]; // e.g. ["MTF"]
  currentTariffVersion: string;
  lastVerificationDate: string;
  verificationStatus: VerificationStatus;
  plans: BrokeragePlan[];
  mtf: MtfConfiguration;
  evidenceIds: string[];
  disclaimer: string;
}

export interface CalculationInput {
  brokerSlug: string;
  planId: string;
  buyPrice: number;
  quantity: number;
  expectedSellPrice: number;
  purchaseDate: string; // ISO
  expectedExitDate: string; // ISO
  userMarginPct: number;
  brokerFundedPct: number;
  annualInterestRatePct: number;
  pledgeRequests: number;
  unpledgeRequests: number;
  dpDebitEvents: number;
  buyBrokeragePct?: number;
  sellBrokeragePct?: number;
  // Optional user overrides
  overrides?: Partial<MtfConfiguration>;
}

export interface CostLine {
  key: string;
  label: string;
  side: "buy" | "sell" | "holding" | "operational";
  amount: number;
  formula?: string;
  gstApplied?: boolean;
}

export interface CostBreakdown {
  buySide: CostLine[];
  sellSide: CostLine[];
  holding: CostLine[];
  operational: CostLine[];
  gstOnAll: number;
  total: number;
}

export interface CalculationResult {
  input: CalculationInput;
  tradeValue: number;
  userCapital: number;
  brokerFunded: number;
  holdingDays: number;
  interestTotal: number;
  breakdown: CostBreakdown;
  grossPnl: number;
  netPnl: number;
  breakevenPrice: number;
  returnOnUserCapitalPct: number;
  returnOnMarketExposurePct: number;
  methodologyVersion: string;
  tariffVersion: string;
  generatedAt: string;
}

export interface HoldingPeriodProjectionRow {
  days: number;
  interest: number;
  totalCost: number;
  netPnl: number;
  breakevenPrice: number;
}

export type HoldingPeriodProjection = HoldingPeriodProjectionRow[];

export interface MtfLot {
  id: string;
  brokerSlug: string;
  planId: string;
  instrument: string;
  purchaseDate: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number; // mock / user-entered
  userCapital: number;
  brokerFunded: number;
  mtfInterest: number;
  entryCharges: number;
  estimatedExitCharges: number;
  breakevenPrice: number;
  unrealisedPnl: number;
  estimatedNetPnl: number;
  tariffVersion: string;
  methodologyVersion: string;
  verificationStatus: VerificationStatus;
  isMock: boolean;
  createdAt: string;
}

export interface PortfolioSummary {
  totalUserCapital: number;
  totalBrokerFunded: number;
  totalInterestAccrued: number;
  totalEntryCharges: number;
  totalEstimatedExitCharges: number;
  totalUnrealisedPnl: number;
  totalEstimatedNetPnl: number;
  positions: number;
}

export interface BrokerComparisonResult {
  brokerSlug: string;
  brokerName: string;
  planId: string;
  planName: string;
  tradeValue: number;
  totalCost: number;
  interest: number;
  brokerage: number;
  taxesAndOps: number;
  netPnl: number;
  breakevenPrice: number;
  verificationStatus: VerificationStatus;
}
