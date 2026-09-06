export interface LoginPayload {
  loginId: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

export interface LogoutPayload {
  refreshToken: string;
}
