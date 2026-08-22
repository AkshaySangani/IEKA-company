import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getEmployees = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
  isDownload?: boolean;
  password?: string;
}) => {
  const { page, limit, search, status, isDownload = false, password = "" } = payload;
  return apiRequest.get<ApiResponse>(
    `/workforce/employee?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const getEmployeeById = (userId: string) => {
  return apiRequest.get<ApiResponse>(`/workforce/employee/${userId}`);
};

export const updateEmployee = (
  payload: any,
  userId: string = "",
) =>
  apiRequest.put(`workforce/employee/${userId}`, payload, {
    showSuccessToast: true,
  });

export const updateEmployeeStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  userId: string = "",
) =>
  apiRequest.patch(`/workforce/onboard/status/${userId}`, payload, {
    showSuccessToast: true,
  });

export const getEmployeeCount = () => {
  return apiRequest.get<ApiResponse>(`/workforce/employee/count`);
};

export const getManagedEmployee = (branchId: string) => {
  return apiRequest.get<ApiResponse>(`/workforce/employee/my-managed?branchId=${branchId}`);
};

export const getCompanyDetails = () => {
  return apiRequest.get<ApiResponse>(`/workforce/company-details`);
};