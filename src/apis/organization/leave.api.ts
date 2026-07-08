import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getLeaves = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `/organization/leaves?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const addLeave = (payload: {
  name: string;
  description: string;
  isPaid: boolean;
}) =>
  apiRequest.post(`/organization/leaves`, payload, {
    showSuccessToast: true,
  });

export const getLeaveById = (leaveId: string) => {
  return apiRequest.get<ApiResponse>(`/organization/leaves/${leaveId}`);
};

export const updateLeave = (
  payload: {
    name: string;
    description: string;
    isPaid: boolean;
  },
  leaveId: string = "",
) =>
  apiRequest.put(`/organization/leaves/${leaveId}`, payload, {
    showSuccessToast: true,
  });

export const updateLeaveStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  leaveId: string = "",
) =>
  apiRequest.patch(`/organization/leaves/status/${leaveId}`, payload, {
    showSuccessToast: true,
  });

export const getLeaveCount = () => {
  return apiRequest.get<ApiResponse>(`/organization/leaves/count`);
};
