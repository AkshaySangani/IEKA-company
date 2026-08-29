import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";


export const getDashboardWorkforce = () => {
  return apiRequest.get<ApiResponse>(`/dashboard/workforce`);
};

export const getDashboardAttendance = (date: string) => {
  return apiRequest.get<ApiResponse>(`/dashboard/attendance?date=${date}`);
};

export const getDashboardProfile = () => {
  return apiRequest.get<ApiResponse>(`/dashboard/profile`);
};

export const getDashboardLeaves = (month: number, year: number) => {
  return apiRequest.get<ApiResponse>(`/dashboard/leaves&manual?month=${month}&year=${year}`);
};