import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";


export const getDashboardWorkforce = () => {
  return apiRequest.get<ApiResponse>(`/dashboard/workforce`);
};