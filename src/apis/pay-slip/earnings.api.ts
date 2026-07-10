import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getEarnings = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `/payslip/earnings?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const addEarnings = (payload: {
  name: string;
  details: any[];
}) =>
  apiRequest.post(`/payslip/earnings`, payload, {
    showSuccessToast: true,
  });

export const getEarningById = (payslipId: string) => {
  return apiRequest.get<ApiResponse>(`/payslip/earnings/${payslipId}`);
};

export const updateEarning = (
  payload: {
    name: string;
    details: any[];
  },
  payslipId: string = "",
) =>
  apiRequest.put(`/payslip/earnings/${payslipId}`, payload, {
    showSuccessToast: true,
  });

export const updateEarningStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  payslipId: string = "",
) =>
  apiRequest.patch(`/payslip/earnings/status/${payslipId}`, payload, {
    showSuccessToast: true,
  });

export const getEarningCount = () => {
  return apiRequest.get<ApiResponse>(`/payslip/earnings/count   `);
};
