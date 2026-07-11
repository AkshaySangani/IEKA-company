import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getDeductions = () => {
  return apiRequest.get<ApiResponse>(`/payslip/deductions`);
};

export const addDeductions = (payload: {
  incomeDetails: any[];
  details: any[];
}) =>
  apiRequest.post(`/payslip/deductions`, payload, {
    showSuccessToast: true,
  });

export const getEarningById = (payslipId: string) => {
  return apiRequest.get<ApiResponse>(`/payslip/earnings/${payslipId}`);
};

export const updateDeductions = (payload: {
  details: any[];
  incomeDetails: any[];
}, deductionId: string) =>
  apiRequest.put(`/payslip/deductions`, payload, {
    showSuccessToast: true,
  });
