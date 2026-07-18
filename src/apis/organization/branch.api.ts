import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";
import { BranchType } from "../../types/common-types";

export const getBranches = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `/organization/branches?page=${page}${limit ? `&limit=${limit}`:""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const addBranch = (payload: {
  name: string;
  address: string;
  shiftApplicable: boolean;
  branchType: BranchType;
}) =>
  apiRequest.post(`/organization/branches`, payload, {
    showSuccessToast: true,
  });

export const getBranchById = (branchId: string) => {
  return apiRequest.get<ApiResponse>(`/organization/branches/${branchId}`);
};

export const updateBranch = (
  payload: {
    name: string;
    address: string;
    shiftApplicable: boolean;
    branchType: BranchType;
  },
  branchId: string = "",
) =>
  apiRequest.put(`/organization/branches/${branchId}`, payload, {
    showSuccessToast: true,
  });

export const updateBranchStatus = (
  payload: {
    status: string;
  },
  branchId: string = "",
) =>
  apiRequest.patch(`/organization/branches/status/${branchId}`, payload, {
    showSuccessToast: true,
  });

  export const getMyBranchList = () => {
  return apiRequest.get<ApiResponse>(`/organization/branches/my-managed`);
};