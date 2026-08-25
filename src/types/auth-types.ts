import { RoleEnum, ViewModeEnum } from "./common-types";

export interface IUser {
  company: { _id: string; companyLogo: string };
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: RoleEnum;
  _id: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  viewMode: ViewModeEnum | null;
  user: IUser;

  setToken: (token: string, refreshToken: string) => void;
  setUser: (user: IUser) => void;

  setViewMode: (mode: ViewModeEnum | null) => void;

  clearAuth: () => void;

  isAuthenticated: () => boolean;
}
