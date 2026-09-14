import { apiRequest } from "../../../services/request";
import { ApiResponse } from "../../../types/api.types";

export const getProfile = () => apiRequest.get<ApiResponse>("/profile");

export const updateProfile = (payload: FormData) =>
  apiRequest.put("/profile/company", payload, {
    showSuccessToast: true,
  });