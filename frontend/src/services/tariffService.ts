import { apiService } from "./apiService";

export const tariffService = {
  listCurrent: apiService.getCurrentTariffs,
  listHistory: apiService.getTariffHistory,
};
