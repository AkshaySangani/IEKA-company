import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";
import { IResignationForm } from "../../types/employee/resignation.types";

export const getResignedEmployees = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
  isDownload?: boolean;
  password?: string;
}) => {
  const { page, limit, search, status, isDownload = false, password = "" } = payload;
  return apiRequest.get<ApiResponse>(
    `/workforce/resignation?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const getResignedEmployeeById = (resignationId: string) => {
  return apiRequest.get<ApiResponse>(`/workforce/resignation/${resignationId}`);
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

export const sendResignMail = (payload: { userId: string }) =>
  apiRequest.post(`/workforce/resignation/send-mail`, payload, {
    showSuccessToast: true,
  });

// employee resignation
export const addResignation = (payload: IResignationForm) =>
  apiRequest.post(`/workforce/resignation`, payload, {
    showSuccessToast: true,
  });
  