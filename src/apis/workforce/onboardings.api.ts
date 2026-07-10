import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getOnboardings = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `/workforce/onboard?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const inviteEmployee = (payload: any) =>
  apiRequest.post(`/workforce/onboard`, payload, {
    showSuccessToast: true,
  });

export const getOnboardingById = (onboardingId: string) => {
  return apiRequest.get<ApiResponse>(`/organization/holidays/${onboardingId}`);
};

export const updateOnboarding = (
  payload: {
    name: string;
    description: string;
    effectiveYear: number;
    startDate: string;
    endDate: string;
  },
  onboardingId: string = "",
) =>
  apiRequest.put(`/organization/holidays/${onboardingId}`, payload, {
    showSuccessToast: true,
  });

export const updateOnboardingStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  onboardingId: string = "",
) =>
  apiRequest.patch(`/organization/holidays/status/${onboardingId}`, payload, {
    showSuccessToast: true,
  });

export const getOnboardingCount = () => {
  return apiRequest.get<ApiResponse>(`/workforce/onboard/count`);
};
