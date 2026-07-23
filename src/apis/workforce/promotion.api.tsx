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
}) => {
  const { page, limit, search, status } = payload;
  return apiRequest.get<ApiResponse>(
    `/workforce/promotion?page=${page}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}`,
  );
};

export const addPromotion = (payload: PromotionFormData) =>
  apiRequest.post(`/workforce/promotion`, payload, {
    showSuccessToast: true,
  });

export const getPromotionById = (terminationId: string) => {
  return apiRequest.get<ApiResponse>(`/workforce/promotion/${terminationId}`);
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
