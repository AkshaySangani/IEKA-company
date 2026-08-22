import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export const getDesignation = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
  isDownload?: boolean;
  password?: string;
}) => {
  const { page, limit, search, status, isDownload = false, password = "" } = payload;
  return apiRequest.get<ApiResponse>(
    `/organization/designations?page=${page}${limit ? `&limit=${limit}`:""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const addDesignation = (payload: {
  name: string;
  description: string;
}) =>
  apiRequest.post(`/organization/designations`, payload, {
    showSuccessToast: true,
  });

export const updateDesignation = (
  payload: {
    name: string;
    description: string;
  },
  designationId: string = "",
) =>
  apiRequest.put(`/organization/designations/${designationId}`, payload, {
    showSuccessToast: true,
  });

export const updateDesignationStatus = (
  payload: {
    status: string;
  },
  designationId: string = "",
) =>
  apiRequest.patch(`/organization/designations/status/${designationId}`, payload, {
    showSuccessToast: true,
  });
