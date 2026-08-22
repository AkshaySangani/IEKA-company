import { apiRequest } from "../../services/request";
import { ApiResponse } from "../../types/api.types";
import { HistoryFieldEnum } from "../../types/common-types";

export interface HistoryPayload {
    fieldId: string;
    field: HistoryFieldEnum;
    title: string;
}

export const initialHistory: HistoryPayload = {
    field: HistoryFieldEnum.BranchStatus,
    fieldId: "",
    title: "" 
}

export const getHistory = ({
    fieldId,
    field
}: HistoryPayload) => {
  return apiRequest.get<ApiResponse>(`/history?field=${field}&fieldId=${fieldId}`);
};

export const getAssignmentHistory = (userId: string) => {
  return apiRequest.get<ApiResponse>(`/history/assignments?userId=${userId}`);
};