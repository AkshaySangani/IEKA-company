import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getResignedEmployees = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `/workforce/resignation?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const getResignedEmployeeCount = () => {
  return apiRequest.get<ApiResponse>(`/workforce/resignation/count`);
};

export const updateResignedEmployeeStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  resignationId: string = "",
) =>
  apiRequest.patch(`/workforce/resignation/status/${resignationId}`, payload, {
    showSuccessToast: true,
  });
