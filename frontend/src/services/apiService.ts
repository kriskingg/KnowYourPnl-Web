import type { Broker, BrokerComparisonResult, CalculationInput, CalculationResult, EvidenceRecord, TariffVersion } from "@/types";
import { brokerService } from "./brokerService";
import { tariffService } from "./tariffService";
import { calculateMtf } from "./calculationService";

export const API_ROUTES = {
  brokers: "/api/v1/brokers",
  broker: (slug: string) => `/api/v1/brokers/${slug}`,
  plans: (slug: string) => `/api/v1/brokers/${slug}/plans`,
  mtf: (slug: string) => `/api/v1/brokers/${slug}/mtf`,
  brokerTariffs: (slug: string) => `/api/v1/brokers/${slug}/mtf/tariffs/current`,
  currentTariffs: "/api/v1/tariffs/current",
  tariffHistory: "/api/v1/tariffs/history",
  evidence: "/api/v1/evidence",
  methodology: "/api/v1/methodology/mtf/current",
  calculate: "/api/v1/calculations/mtf",
  compare: "/api/v1/comparisons/mtf",
} as const;

export type MtfMethodologyResponse = { version: string; dayCountBasis: 365; description: string };

export const apiService = {
  getBrokers: (): Promise<Broker[]> => brokerService.list(),
  getBroker: (slug: string): Promise<Broker | undefined> => brokerService.getBySlug(slug),
  getPlans: (slug: string) => brokerService.getPlans(slug),
  getMtf: (slug: string) => brokerService.getMtf(slug),
  getCurrentTariffs: (): Promise<TariffVersion[]> => tariffService.listCurrent(),
  getTariffHistory: (): Promise<TariffVersion[]> => tariffService.listHistory(),
  getEvidence: (): Promise<EvidenceRecord[]> => brokerService.getEvidence(),
  getMethodology: async (): Promise<MtfMethodologyResponse> => ({ version: "mtf-methodology-v1", dayCountBasis: 365, description: "Transparent MTF cost estimate using broker-specific tariff rules." }),
  calculateMtf: async (input: CalculationInput): Promise<CalculationResult> => calculateMtf(input),
  compareMtf: async (inputs: CalculationInput[]): Promise<BrokerComparisonResult[]> =>
    inputs.map((input) => {
      const result = calculateMtf(input);
      const broker = result.input.brokerSlug;
      return { brokerSlug: broker, brokerName: broker, planId: input.planId, planName: input.planId, tradeValue: result.tradeValue, totalCost: result.breakdown.total, interest: result.interestTotal, brokerage: [...result.breakdown.buySide, ...result.breakdown.sellSide].filter((x) => x.key.includes("brokerage")).reduce((sum, x) => sum + x.amount, 0), taxesAndOps: result.breakdown.total - result.interestTotal, netPnl: result.netPnl, breakevenPrice: result.breakevenPrice, verificationStatus: "review_required" };
    }),
};
