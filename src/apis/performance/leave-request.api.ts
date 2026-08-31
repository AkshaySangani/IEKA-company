import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";
import { LeaveDuration, statusEnum } from "../../types/common-types";

export interface LeaveRequestAssignment {
  branchId: string;
  shiftIds: string[];
}

export interface LeaveFormData {
  userId: string;
  leaves: {
    leaveId: string;
    date: string;
    duration: LeaveDuration;
  }[];
  reason: string;
}

export const getLeaveRequestList = (payload: {
  search: string;
  status?: statusEnum | string;
  page: number;
  limit: number;
  isDownload?: boolean;
  password?: string;
}) => {
  const {
    page,
    limit,
    search,
    status,
    isDownload = false,
    password = "",
  } = payload;
  return apiRequest.get<ApiResponse>(
    `/performance/leave-request?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const addLeaveRequest = (payload: LeaveFormData) =>
  apiRequest.post(`/performance/leave-request`, payload, {
    showSuccessToast: true,
  });

export const getLeaveRequestById = (leaveRequestId: string) => {
  return apiRequest.get<ApiResponse>(
    `/performance/leave-request/${leaveRequestId}`,
  );
};

export const getLeaveRequestCount = () => {
  return apiRequest.get<ApiResponse>(`/performance/leave-request/count`);
};

export const getBranchAndShift = () => {
  return apiRequest.get<ApiResponse>(
    `organization/departments/branch-shift-options`,
  );
};

export const updateLeaveRequest = (
  payload: LeaveFormData,
  departmentId: string = "",
) =>
  apiRequest.put(`organization/departments/${departmentId}`, payload, {
    showSuccessToast: true,
  });

export const updateLeaveRequestStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  leaveRequestId: string = "",
) =>
  apiRequest.patch(
    `/performance/leave-request/status/${leaveRequestId}`,
    payload,
    {
      showSuccessToast: true,
    },
  );

export const getLeaveBucket = (year: number) => {
  return apiRequest.get<ApiResponse>(
    `/performance/leave-request/bucket?year=${year}`,
  );
};
