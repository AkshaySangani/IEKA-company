import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export interface ReimbursementFormData {
  name: string;
  date: string;
  description: string;
  amount: string;
  userId: string;
  branchId: string;
  documents: any[];
}


export const getReimbursementList = (payload: {
  search: string;
  status?: string;
  page: number;
  limit: number;
  year?: string;
  month?: string;
  isDownload?: boolean;
  password?: string;
}) => {
  const { page, limit, search, status, year, month, isDownload = false, password = "" } = payload;
  return apiRequest.get<ApiResponse>(
    `/expense/reimbursements?page=${page}${limit ? `&limit=${limit}`:""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${year ? `&year=${year}` : ""}${month ? `&month=${month}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const addReimbursement = (payload: FormData) =>
  apiRequest.post(`/expense/reimbursements`, payload, {
    showSuccessToast: true,
  });

export const getReimbursementById = (reimbursementId: string) => {
  return apiRequest.get<ApiResponse>(`/expense/reimbursements/${reimbursementId}`);
};

export const getReimbursementCount = ({
    month = "",
    year = ""
}: {month?: string | number;year?: string | number}) => {
  return apiRequest.get<ApiResponse>(`/expense/reimbursements/count${`?year=${year}`}&month=${month}`);
};

export const updateReimbursementStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  reimbursementId: string = "",
) =>
  apiRequest.patch(`/expense/reimbursements/status/${reimbursementId}`, payload, {
    showSuccessToast: true,
  });
