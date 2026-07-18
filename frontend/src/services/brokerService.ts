import { MOCK } from "./mockData";
import type { Broker, EvidenceRecord } from "@/types";

export const brokerService = {
  list: async (): Promise<Broker[]> => MOCK.brokers,
  getBySlug: async (slug: string): Promise<Broker | undefined> =>
    MOCK.brokers.find((b) => b.slug === slug),
  getPlans: async (slug: string) => {
    const broker = MOCK.brokers.find((b) => b.slug === slug);
    return broker?.plans ?? [];
  },
  getMtf: async (slug: string) => {
    const broker = MOCK.brokers.find((b) => b.slug === slug);
    return broker?.mtf;
  },
  getEvidence: async (slug?: string): Promise<EvidenceRecord[]> => {
    if (!slug) return MOCK.evidence;
    return MOCK.evidence.filter((e) => e.broker === slug);
  },
};
