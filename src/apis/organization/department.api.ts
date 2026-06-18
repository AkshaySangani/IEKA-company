import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export interface DepartmentAssignment {
  branchId: string;
  shiftIds: string[];
}

export interface DepartmentFormData {
  name: string;
  assignments: DepartmentAssignment[];
}


export const getDepartmentList = (payload: {
  search: string;
  status?: string;
  page: number;
  limit: number;
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `organization/departments?page=${page}${limit ? `&limit=${limit}`:""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const addDepartment = (payload: DepartmentFormData) =>
  apiRequest.post(`/organization/departments`, payload, {
    showSuccessToast: true,
  });

export const getDepartmentById = (departmentId: string) => {
  return apiRequest.get<ApiResponse>(`organization/departments/${departmentId}`);
};

export const getBranchAndShift = () => {
    return apiRequest.get<ApiResponse>(`organization/departments/branch-shift-options`);
}

export const updateDepartment = (
  payload: DepartmentFormData,
  departmentId: string = "",
) =>
  apiRequest.put(`organization/departments/${departmentId}`, payload, {
    showSuccessToast: true,
  });

export const updateDepartmentStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  departmentId: string = "",
) =>
  apiRequest.patch(`organization/departments/status/${departmentId}`, payload, {
    showSuccessToast: true,
  });
