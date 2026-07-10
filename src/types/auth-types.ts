export interface IUser {
  company: { _id: string; companyLogo: string };
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: string;
  _id: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: IUser | null;

  setToken: (token: string, refreshToken: string) => void;
  setUser: (user: IUser) => void;

  clearAuth: () => void;

  isAuthenticated: () => boolean;
}
