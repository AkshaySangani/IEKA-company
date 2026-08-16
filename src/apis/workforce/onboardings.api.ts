import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getOnboardings = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
  isDownload?: boolean;
}) => {
  const { page, limit, search, status,isDownload = false } = payload;
  return apiRequest.get<ApiResponse>(
    `/workforce/onboard?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}`,
  );
};

export const inviteEmployee = (payload: any, showSuccessToast: boolean = true) =>
  apiRequest.post(`/workforce/onboard`, payload, {
    showSuccessToast: showSuccessToast,
  });

export const getOnboardingById = (onboardingId: string) => {
  return apiRequest.get<ApiResponse>(`/organization/holidays/${onboardingId}`);
};

export const assignRolesAndResponsibility = (payload: {
  userId: string;
  role?: string;
  employmentType?: string;
  probationPeriod?: number;
  policyId?: string;
  payslipId?: string;
  salary?: number;
  assignments?: {
    branchId: string;
    shiftId: string;
    departmentId: string;
    designationId: string;
    isReporting: boolean;
    remarks: string;
  }[];
  remarks?: string;
}) =>
  apiRequest.post(`/workforce/onboard/roles-responsibility`, payload, {
    showSuccessToast: true,
  });

export const updateOnboardingStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  userId: string = "",
) =>
  apiRequest.patch(`/workforce/onboard/status/${userId}`, payload, {
    showSuccessToast: true,
  });

export const getOnboardingCount = () => {
  return apiRequest.get<ApiResponse>(`/workforce/onboard/count`);
};

export const getOnboardingCompanyInfo = (companyId: string) => {
  return apiRequest.get<ApiResponse>(
    `/workforce/onboard/company-info/${companyId}`,
  );
};

export const getBranchShiftDepartment = () => {
  return apiRequest.get<ApiResponse>(
    `/workforce/onboard/branch-shift-department`,
  );
};

export const getEmployeeDetails = (userId: string) => {
  return apiRequest.get<ApiResponse>(`/workforce/onboard/${userId}`);
};
