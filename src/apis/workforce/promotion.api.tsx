import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";

export interface PromotionFormData {
  userId: string;
  designationId: string;
  effectiveDate: string;
  reason: string;
}

export const getPromotions = (payload: {
  search?: string;
  status: string;
  page: number;
  limit?: number;
  isDownload?: boolean;
  password?: string;
}) => {
  const { page, limit, search, status, isDownload = false, password = "" } = payload;
  return apiRequest.get<ApiResponse>(
    `/workforce/promotion?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${isDownload ? `&isDownload=${isDownload}` : ""}${password ? `&csvPassword=${password}` : ""}`,
  );
};

export const addPromotion = (payload: PromotionFormData) =>
  apiRequest.post(`/workforce/promotion`, payload, {
    showSuccessToast: true,
  });

export const getPromotionById = (promotionId: string) => {
  return apiRequest.get<ApiResponse>(`/workforce/promotion/${promotionId}`);
};

export const updatePromotion = (
  payload: PromotionFormData,
  promotionId: string = "",
) =>
  apiRequest.put(`/workforce/promotion/${promotionId}`, payload, {
    showSuccessToast: true,
  });

export const updatePromotionStatus = (
  payload: {
    status: string;
    remarks: string;
  },
  promotionId: string = "",
) =>
  apiRequest.patch(`/workforce/promotion/status/${promotionId}`, payload, {
    showSuccessToast: true,
  });

export const getPromotionCount = () => {
  return apiRequest.get<ApiResponse>(`/workforce/promotion/count`);
};

export const sendPromotionMail = (payload: {userId: string}) =>
  apiRequest.post(`/workforce/promotion/send-mail`, payload, {
    showSuccessToast: true,
  });