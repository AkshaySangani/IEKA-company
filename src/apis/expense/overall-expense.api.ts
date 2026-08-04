import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

interface GetOverallExpenseCountParams {
  month?: number;
  year?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export const getOverAllExpenseCount = (
  params: GetOverallExpenseCountParams
) => {
  const query = new URLSearchParams();

  if (params.year !== undefined) {
    query.append("year", String(params.year));
  }

  if (params.month !== undefined) {
    query.append("month", String(params.month));
  }

  if (params.startDate) {
    query.append("startDate", params.startDate);
  }

  if (params.endDate) {
    query.append("endDate", params.endDate);
  }

  return apiRequest.get<ApiResponse>(
    `/expense/overall/count?${query.toString()}`
  );
};