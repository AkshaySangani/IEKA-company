import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export interface TerminationFormData {
  userId: string;
  terminationType: string;
  lastWorkingDate: string;
  reason: string;
}

export const getTerminations = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `/workforce/termination?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const addTermination = (payload: TerminationFormData) =>
  apiRequest.post(`/workforce/termination`, payload, {
    showSuccessToast: true,
  });

export const getTerminationById = (terminationId: string) => {
  return apiRequest.get<ApiResponse>(`/workforce/termination/${terminationId}`);
};

export const updateTermination = (
  payload: TerminationFormData,
  terminationId: string = "",
) =>
  apiRequest.put(`/workforce/termination/${terminationId}`, payload, {
    showSuccessToast: true,
  });

export const updateTerminationStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  terminationId: string = "",
) =>
  apiRequest.patch(`/workforce/termination/status/${terminationId}`, payload, {
    showSuccessToast: true,
  });

export const getTerminationCount = () => {
  return apiRequest.get<ApiResponse>(`/workforce/termination/count`);
};
