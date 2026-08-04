import api from "./api";
import { toastMessage } from "../utils/toast-message";

interface RequestOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
}

export const apiRequest = {
  post: async <T>(
    url: string,
    payload: any,
    options?: RequestOptions
  ) => {
    try {
      const response = await api.post<T>(url, payload);

      const apiMessage =
        (response.data as any)?.message;

      if (options?.showSuccessToast) {
        toastMessage.success(
          apiMessage ||
          options?.successMessage ||
          "Saved Successfully"
        );
      }

      return response.data;
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.message;

      toastMessage.error(
        apiMessage ||
        options?.errorMessage ||
        "Something went wrong"
      );

      return error;
    }
  },

  put: async <T>(
    url: string,
    payload: any,
    options?: RequestOptions
  ) => {
    try {
      const response = await api.put<T>(url, payload);

      const apiMessage =
        (response.data as any)?.message;

      if (options?.showSuccessToast !== false) {
        toastMessage.success(
          apiMessage ||
          options?.successMessage ||
          "Updated Successfully"
        );
      }

      return response.data;
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message??error?.message;

      toastMessage.error(
        apiMessage ||
        options?.errorMessage ||
        "Update Failed"
      );

      return error;
    }
  },

  patch: async <T>(
    url: string,
    payload: any,
    options?: RequestOptions
  ) => {
    try {
      const response = await api.patch<T>(url, payload);

      const apiMessage =
        (response.data as any)?.message;

      if (options?.showSuccessToast !== false) {
        toastMessage.success(
          apiMessage ||
          options?.successMessage ||
          "Updated Successfully"
        );
      }

      return response.data;
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message??error?.message??error?.message;

      toastMessage.error(
        apiMessage ||
        options?.errorMessage ||
        "Update Failed"
      );

      return error;
    }
  },

  delete: async <T>(
    url: string,
    options?: RequestOptions
  ) => {
    try {
      const response = await api.delete<T>(url);

      const apiMessage =
        (response.data as any)?.message;

      toastMessage.success(
        apiMessage ||
        options?.successMessage ||
        "Deleted Successfully"
      );

      return response.data;
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message??error?.message;

      toastMessage.error(
        apiMessage ||
        options?.errorMessage ||
        "Delete Failed"
      );

      return error;
    }
  },

  get: async <T>(url: string) => {
    try {
      const response = await api.get<T>(url);
  
      return response.data;
    } catch(error: any){
      const apiMessage =
        error?.response?.data?.message || error?.message;

      toastMessage.error(
        apiMessage ||
        "Something went wrong"
      );

      return error;
    }
  },
};