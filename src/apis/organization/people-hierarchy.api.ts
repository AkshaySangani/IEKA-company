import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getPeoples = (branchId: string, shiftId: string) => {
  return apiRequest.get<ApiResponse>(
    `/organization/hierarchy/employee?branchId=${branchId}&shiftId=${shiftId}`,
  );
};

export const getCompanyHierarchy = () => {
  return apiRequest.get<ApiResponse>(
    `/organization/hierarchy/company`,
  );
};