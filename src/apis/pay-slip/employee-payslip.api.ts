import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getEmployeePayslips = (employeeId: string, year: string | number) => {
  return apiRequest.get<ApiResponse>(
    `/expense/payroll/payslips?year=${year}&userId=${employeeId}`,
  );
};