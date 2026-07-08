import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { config } from "../utils/config";
import { storageKeys } from "../constants/constants";
import { getLocalStorageData, removeLocalStorageData } from "../utils/helper";

const apiPrefix = "/api";

const api = axios.create({
  baseURL: `${config.BACKEND_API_URL}${apiPrefix}`,
  timeout: 60000,
});

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// ======================
// LOGOUT
// ======================
const logoutUser = async () => {
  try {
    removeLocalStorageData(storageKeys.authStorage);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

// ======================
// REFRESH TOKEN API
// ======================
const refreshAccessToken = async () => {
  const authData = getLocalStorageData(storageKeys.authStorage);

  const refreshToken = authData?.state?.refreshToken;

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const response = await axios.post(
    `${config.BACKEND_API_URL}${apiPrefix}/auth/refresh-token`,
    {
      refreshToken,
    },
  );

  return response.data;
};

// ======================
// UPDATE TOKENS
// ======================
const updateTokens = (token: string, refreshToken?: string) => {
  const authData = getLocalStorageData(storageKeys.authStorage);

  if (!authData?.state) return;

  authData.state.accessToken = token;

  if (refreshToken) {
    authData.state.refreshToken = refreshToken;
  }

  localStorage.setItem(storageKeys.authStorage, JSON.stringify(authData));
};

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });

  failedQueue = [];
};

// ======================
// REQUEST INTERCEPTOR
// ======================
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getLocalStorageData(storageKeys.authStorage)?.state
      ?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ======================
// RESPONSE INTERCEPTOR
// ======================
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // ======================
    // NETWORK ERROR
    // ======================
    if (!error.response) {
      return Promise.reject({
        success: false,
        message:
          "Unable to connect to server. Please check your internet connection.",
      });
    }

    // ======================
    // TIMEOUT ERROR
    // ======================
    if (error.code === "ECONNABORTED") {
      return Promise.reject({
        success: false,
        message: "Request timeout. Please try again.",
      });
    }

    const status = error.response.status;

    // ======================
    // 401 -> REFRESH TOKEN FLOW
    // ======================
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Someone already refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;

              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await refreshAccessToken();

        const newToken = refreshResponse?.data?.accessToken;

        const newRefreshToken = refreshResponse?.data?.refreshToken;

        if (!newToken) {
          logoutUser();
        }

        updateTokens(newToken, newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        // Wake up all waiting requests
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await logoutUser();

        return Promise.reject({
          success: false,
          message: "Session expired. Please login again.",
        });
      } finally {
        isRefreshing = false;
      }
    }

    // ======================
    // FORBIDDEN
    // ======================
    if (status === 403) {
      return Promise.reject({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    // ======================
    // NOT FOUND
    // ======================
    if (status === 404) {
      return Promise.reject({
        success: false,
        message: error.response.data?.message || "API Not Found.",
      });
    }

    // ======================
    // SERVER ERROR
    // ======================
    if (status >= 500) {
      return Promise.reject({
        success: false,
        message: "Server error. Please try again later.",
      });
    }

    return Promise.reject({
      success: false,
      status,
      message: error.response.data?.message || "Something went wrong.",
      errors: error.response.data?.errors,
    });
  },
);

// ======================
// ERROR HELPER
// ======================
export const getApiErrorMessage = (error: any): string => {
  return (
    error?.message || error?.response?.data?.message || "Something went wrong"
  );
};

export default api;
