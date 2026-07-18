// Data models for KnowYourPNL (MTF)

export type VerificationStatus =
  | "official"
  | "account_verified"
  | "formula_tested"
  | "estimated"
  | "user_modified"
  | "review_required";

export interface BrokeragePlan {
  id: string;
  name: string;
  description: string;
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
  pledgeRequests: number;
  unpledgeRequests: number;
  dpDebitEvents: number;
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
  total: number;
}

export interface CalculationResult {
  input: CalculationInput;
  tradeValue: number;
  holdingDays: number;
  interestTotal: number;
  breakdown: CostBreakdown;
  grossPnl: number;
  netPnl: number;
  breakevenPrice: number;
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
  netPnl: number;
  breakevenPrice: number;
  verificationStatus: VerificationStatus;
}
