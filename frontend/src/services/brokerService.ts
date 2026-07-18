import { apiService } from "./apiService";
import type { Broker } from "@/types";

export const brokerService = {
  list: (): Promise<Broker[]> => apiService.getBrokers(),
  getBySlug: async (slug: string): Promise<Broker | undefined> => {
    try {
      return await apiService.getBroker(slug);
    } catch {
      return undefined;
    }
  },
  getPlans: async (slug: string) => (await apiService.getBroker(slug)).plans,
};
