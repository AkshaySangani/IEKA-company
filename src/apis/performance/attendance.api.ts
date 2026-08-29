import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";
import { AttendanceMethodEnum } from "../../types/common-types";

export interface AttendanceAssignment {
  branchId: string;
  shiftIds: string[];
}

export interface AttendanceFormData {
  name: string;
  assignments: AttendanceAssignment[];
}

export const getAttendanceList = (payload: {
  search: string;
  page: number;
  limit: number;
  date: string;
  status?: string;
  isDownload?: boolean;
  password?: string;
}) => {
  const {
    page,
    limit,
    search,
    date,
    status,
    isDownload = false,
    password = "",
  } = payload;
  return apiRequest.get<ApiResponse>(
    `/performance/attendance/daily?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${date ? `&date=${date}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const addAttendance = (payload: AttendanceFormData) =>
  apiRequest.post(`/organization/departments`, payload, {
    showSuccessToast: true,
  });

export const getAttendanceById = (departmentId: string) => {
  return apiRequest.get<ApiResponse>(
    `organization/departments/${departmentId}`,
  );
};

export const getUserAttendanceByUserId = (
  month: number,
  year: number,
  userId: string,
  status: string = "",
) => {
  return apiRequest.get<ApiResponse>(
    `/performance/attendance/my/monthly?month=${month}&year=${year}&userId=${userId}${status ? `&status=${status}` : ""}`,
  );
};

export const getAttendanceCount = (date: string) => {
  return apiRequest.get<ApiResponse>(
    `/performance/attendance/daily/count?date=${date}`,
  );
};

export const getMyAttendanceCount = (
  month: number,
  year: number,
  userId: string,
) => {
  return apiRequest.get<ApiResponse>(
    `/performance/attendance/my/monthly/count?month=${month}&year=${year}&userId=${userId}`,
  );
};

export const getBranchAndShift = () => {
  return apiRequest.get<ApiResponse>(
    `organization/departments/branch-shift-options`,
  );
};

export const updateAttendance = (
  payload: AttendanceFormData,
  departmentId: string = "",
) =>
  apiRequest.put(`organization/departments/${departmentId}`, payload, {
    showSuccessToast: true,
  });

export const updateAttendanceStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  departmentId: string = "",
) =>
  apiRequest.patch(`organization/departments/status/${departmentId}`, payload, {
    showSuccessToast: true,
  });

// punch in / punch out api
export const getPunchInfo = () => {
  return apiRequest.get<ApiResponse>(`/performance/attendance/my/status`, {
    showErrorToast: false,
  });
};

export interface PunchInOutPayload {
  latitude: number;
  longitude: number;
  address: string;
  method: AttendanceMethodEnum;
}
export const punchIn = (payload: PunchInOutPayload) =>
  apiRequest.post(`/performance/attendance/punch/in`, payload, {
    showSuccessToast: true,
  });

export const punchOut = (payload: PunchInOutPayload) =>
  apiRequest.post(`/performance/attendance/punch/out`, payload, {
    showSuccessToast: true,
  });
