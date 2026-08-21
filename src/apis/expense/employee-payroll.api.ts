import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export interface EmployeePayrollFormData {
  name: string;
  date: string;
  description: string;
  amount: string;
  userId: string;
  branchId: string;
  documents: any[];
}


export const getEmployeePayrollList = (payload: {
  search: string;
  page: number;
  limit: number;
  year?: number;
  month?: number;
  isDownload?: boolean;
}) => {
  const { page, limit, search, year, month, isDownload = false } = payload;
  return apiRequest.get<ApiResponse>(
    `/expense/payroll?page=${page}${limit ? `&limit=${limit}`:""}${search ? `&search=${search}` : ""}${year ? `&year=${year}` : ""}${month ? `&month=${month}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}`,
  );
};

export const addEmployeePayroll = (payload: FormData) =>
  apiRequest.post(`/expense/reimbursements`, payload, {
    showSuccessToast: true,
  });

export const getEmployeePayrollById = (reimbursementId: string) => {
  return apiRequest.get<ApiResponse>(`/expense/reimbursements/${reimbursementId}`);
};

export const getEmployeePayrollCount = ({
    month = "",
    year = ""
}: {month?: string;year?: string}) => {
  return apiRequest.get<ApiResponse>(`/expense/reimbursements/count${`?year=${year}`}&month=${month}`);
};

export const updateEmployeePayrollStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  reimbursementId: string = "",
) =>
  apiRequest.patch(`/expense/reimbursements/status/${reimbursementId}`, payload, {
    showSuccessToast: true,
  });
