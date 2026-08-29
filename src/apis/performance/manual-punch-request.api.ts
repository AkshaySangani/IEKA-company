import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";
import { IManualPunchRequest } from "../../types/company/performance/manual-punch-request.types";

export interface ManualPunchRequestAssignment {
  branchId: string;
  shiftIds: string[];
}


export const getManualPunchRequestList = (payload: {
  page: number;
  limit: number;
  month: number;
  year:number;
  isDownload?: boolean;
  password?: string;
}) => {
  const { page, limit, month, year, isDownload = false, password = "" } = payload;
  return apiRequest.get<ApiResponse>(
    `/performance/attendance/punch/manual/list?page=${page}${limit ? `&limit=${limit}`:""}${month ? `&month=${month}` : ""}${year ? `&year=${year}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const addManualPunchRequest = (payload: Omit<IManualPunchRequest, "punchType">) =>
  apiRequest.post(`/performance/attendance/punch/manual`, payload, {
    showSuccessToast: true,
  });

export const getBranchAndShift = () => {
    return apiRequest.get<ApiResponse>(`organization/departments/branch-shift-options`);
}
