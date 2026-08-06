import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AuthState, IUser } from "../types/auth-types";
import { storageKeys } from "../constants/constants";

const initialUserState: IUser = {
  company: { _id: "", companyLogo: "" },
  email: "",
  firstName: "",
  lastName: "",
  profileImage: "",
  role: "",
  _id: "",
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: initialUserState,

      setToken: (token, refreshToken) =>
        set({
          accessToken: token,
          refreshToken
        }),

      setUser: (user) =>
        set({
          user,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: initialUserState,
        }),

      isAuthenticated: () => {
        return !!get().accessToken;
      },
    }),
    {
      name: storageKeys.authStorage,
    }
  )
);