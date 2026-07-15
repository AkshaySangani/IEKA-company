import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getPolicies = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `/organization/policy?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const addPolicy = (payload: {
  name: string;
}) =>
  apiRequest.post(`/organization/policy`, payload, {
    showSuccessToast: true,
  });

export const getPolicyById = (holidayId: string) => {
  return apiRequest.get<ApiResponse>(`/organization/holidays/${holidayId}`);
};

export const updatePolicy = (
  payload: {
    name: string;
  },
  policyId: string = "",
) =>
  apiRequest.put(`/organization/policy/${policyId}`, payload, {
    showSuccessToast: true,
  });

export const updatePolicyStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  policyId: string = "",
) =>
  apiRequest.patch(`/organization/policy/status/${policyId}`, payload, {
    showSuccessToast: true,
  });

export const getPolicyCount = () => {
  return apiRequest.get<ApiResponse>(`/organization/policy/count`);
};
