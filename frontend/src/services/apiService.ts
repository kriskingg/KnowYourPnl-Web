import type {
  Broker,
  BrokerComparisonResult,
  CalculationInput,
  CalculationResult,
  HoldingPeriodProjectionRow,
  TariffVersion,
} from "@/types";

export const API_ROUTES = {
  brokers: "/api/v1/brokers",
  broker: (slug: string) => `/api/v1/brokers/${encodeURIComponent(slug)}`,
  currentTariffs: "/api/v1/tariffs/current",
  tariffHistory: "/api/v1/tariffs/history",
  calculate: "/api/v1/calculations/mtf",
  projection: "/api/v1/calculations/mtf/projection",
  compare: "/api/v1/comparisons/mtf",
} as const;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unable to calculate right now" }));
    throw new Error(error.detail ?? "Unable to calculate right now");
  }
  return response.json() as Promise<T>;
}

const post = <T>(url: string, body: unknown) =>
  request<T>(url, { method: "POST", body: JSON.stringify(body) });

export const apiService = {
  getBrokers: () => request<Broker[]>(API_ROUTES.brokers),
  getBroker: (slug: string) => request<Broker>(API_ROUTES.broker(slug)),
  getCurrentTariffs: () => request<TariffVersion[]>(API_ROUTES.currentTariffs),
  getTariffHistory: (brokerSlug?: string) =>
    request<TariffVersion[]>(
      `${API_ROUTES.tariffHistory}${brokerSlug ? `?broker=${encodeURIComponent(brokerSlug)}` : ""}`,
    ),
  calculateMtf: (input: CalculationInput) =>
    post<CalculationResult>(API_ROUTES.calculate, input),
  projectMtf: (input: CalculationInput) =>
    post<HoldingPeriodProjectionRow[]>(API_ROUTES.projection, input),
  compareMtf: (scenario: Omit<CalculationInput, "brokerSlug" | "planId">) =>
    post<BrokerComparisonResult[]>(API_ROUTES.compare, scenario),
};
