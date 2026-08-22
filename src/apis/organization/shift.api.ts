import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export interface IAddShiftPayload {
    name: string;
    startTime: string;
    endTime: string;
    breakStartTime: string;
    breakEndTime: string;
    branchIds: string[];
}

export const getShiftList = (payload: {
  search: string;
  status: string;
  page: number;
  limit: number;
  isDownload?: boolean; 
  password?: string;
}) => {
  const { page, limit, search, status, isDownload = false, password = "" } = payload;
  return apiRequest.get<ApiResponse>(
    `/organization/shifts?page=${page}${limit ? `&limit=${limit}`:""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const addShift = (payload: IAddShiftPayload) =>
  apiRequest.post(`/organization/shifts`, payload, {
    showSuccessToast: true,
  });

export const getShiftById = (shiftId: string) => {
  return apiRequest.get<ApiResponse>(`organization/shifts/${shiftId}`);
};

export const updateShift = (
  payload: IAddShiftPayload,
  shiftId: string = "",
) =>
  apiRequest.put(`organization/shifts/${shiftId}`, payload, {
    showSuccessToast: true,
  });

export const updateShiftStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  shiftId: string = "",
) =>
  apiRequest.patch(`/organization/shifts/status/${shiftId}`, payload, {
    showSuccessToast: true,
  });
