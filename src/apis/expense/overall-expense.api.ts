import { MonthPickerValue } from "../../components/common/date-picker/MonthPicker";
import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getOverAllExpenseCount = ({
    month,
    year
}: MonthPickerValue) => {
  return apiRequest.get<ApiResponse>(`/expense/overall/count?year=${year}&month=${month}`);
};