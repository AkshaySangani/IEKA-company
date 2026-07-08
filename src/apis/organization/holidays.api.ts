import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getHolidays = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
  effectiveYear?: number;
}) => {
  const { page, limit, search, status, effectiveYear } = payload;
  return apiRequest.get<ApiResponse>(
    `/organization/holidays?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${effectiveYear ? `&effectiveYear=${effectiveYear}` : ""}`,
  );
};

export const addHoliday = (payload: {
  name: string;
  description: string;
  effectiveYear: number;
  startDate: string;
  endDate: string;
}) =>
  apiRequest.post(`/organization/holidays`, payload, {
    showSuccessToast: true,
  });

export const getHolidayById = (holidayId: string) => {
  return apiRequest.get<ApiResponse>(`/organization/holidays/${holidayId}`);
};

export const updateHoliday = (
  payload: {
    name: string;
    description: string;
    effectiveYear: number;
    startDate: string;
    endDate: string;
  },
  holidayId: string = "",
) =>
  apiRequest.put(`/organization/holidays/${holidayId}`, payload, {
    showSuccessToast: true,
  });

export const updateHolidayStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  holidayId: string = "",
) =>
  apiRequest.patch(`/organization/holidays/status/${holidayId}`, payload, {
    showSuccessToast: true,
  });

export const getHolidayCount = (year: number) => {
  return apiRequest.get<ApiResponse>(`/organization/holidays/count?year=${year}`);
};
