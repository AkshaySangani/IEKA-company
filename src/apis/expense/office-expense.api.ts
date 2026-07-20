import { MonthPickerValue } from "../../components/common/date-picker/MonthPicker";
import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";
import { ExpenseCategoryEnum } from "../../types/common-types";

export interface VendorDetailsType {
  name: string;
  company: string;
  phone: string;
  isOnWarrenty: boolean;
  startDate: string;
  endDate: string;
  description: string;
}

export interface OfficeExpenseFormData {
  name: string;
  date: string;
  description: string;
  amount: string;
  userId: string;
  branchId: string;

  expenseType: ExpenseCategoryEnum;
  serviceType?: string;

  paymentMode?: string;
  transactionId?: string;

  vendor: VendorDetailsType;

  documents: File[];
}


export const getOfficeExpenseList = (payload: {
  search: string;
  status?: string;
  page: number;
  limit: number;
  year?: string;
  month?: MonthPickerValue;
}) => {
  const { page, limit, search, status, month } = payload;
  return apiRequest.get<ApiResponse>(
    `/expense/officeExpense?page=${page}${limit ? `&limit=${limit}`:""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${month?.year ? `&year=${month.year}` : ""}${month?.month ? `&month=${month.month}` : ""}`,
  );
};

export const addOfficeExpense = (payload: FormData) =>
  apiRequest.post(`/expense/officeExpense`, payload, {
    showSuccessToast: true,
  });

export const getOfficeExpenseById = (officeExpenseId: string) => {
  return apiRequest.get<ApiResponse>(`/expense/officeExpense/${officeExpenseId}`);
};

export const getOfficeExpenseCount = ({
    month,
    year
}: MonthPickerValue) => {
  return apiRequest.get<ApiResponse>(`/expense/officeExpense/count?year=${year}&month=${month}`);
};

export const updateOfficeExpenseStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  officeExpenseId: string = "",
) =>
  apiRequest.patch(`/expense/officeExpense/status/${officeExpenseId}`, payload, {
    showSuccessToast: true,
  });
