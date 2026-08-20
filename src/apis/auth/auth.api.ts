import { apiRequest } from "../../services/request";
import {
  ForgotPasswordPayload,
  LoginPayload,
  LogoutPayload,
  PasswordChangePayload,
  ResetPasswordPayload,
} from "./auth.types";

export const loginApi = (payload: LoginPayload) =>
  apiRequest.post("/auth/login", payload, {
    showSuccessToast: true,
  });

export const forgotPasswordApi = (payload: ForgotPasswordPayload) =>
  apiRequest.post("/auth/forgot-password", payload, {
    successMessage: "Password reset link sent to your email.",
    showSuccessToast: true,
  });

export const verifyOtp = (payload: { otp: string; email: string }) =>
  apiRequest.post("/auth/forgot-password/otp/verify", payload, {
    successMessage: "OTP verified successfully.",
    showSuccessToast: true,
  });

export const resetPasswordApi = (payload: ResetPasswordPayload) =>
  apiRequest.post("/auth/reset-password", payload, {
    successMessage:
      "Password reset successfully. Please login with your new password.",
    showSuccessToast: true,
  });

export const changePasswordApi = (payload: PasswordChangePayload) =>
  apiRequest.post("/auth/change-password", payload, {
    showSuccessToast: true,
  });

export const logoutApi = (payload: LogoutPayload) =>
  apiRequest.post("/auth/logout", payload, {
    showSuccessToast: true,
  });
