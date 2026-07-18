"import { MOCK, TARIFF_CHANGES } from \"./mockData\";
import type { TariffVersion } from \"@/types\";

export const tariffService = {
  listCurrent: async (): Promise<TariffVersion[]> => {
    // Latest tariff per broker/plan
    const map = new Map<string, TariffVersion>();
    for (const v of MOCK.tariffVersions) {
      const key = `${v.brokerSlug}:${v.planId}`;
      const existing = map.get(key);
      if (!existing || new Date(v.effectiveDate) > new Date(existing.effectiveDate)) {
        map.set(key, v);
      }
    }
    return Array.from(map.values());
  },
  listHistory: async (brokerSlug?: string): Promise<TariffVersion[]> => {
    return MOCK.tariffVersions
      .filter((v) => (brokerSlug ? v.brokerSlug === brokerSlug : true))
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  },
  getChanges: (versionId: string) => TARIFF_CHANGES[versionId] ?? [],
};
"