import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AuthState, IUser } from "../types/auth-types";
import { storageKeys } from "../constants/constants";
import { RoleEnum } from "../types/common-types";

const initialUserState: IUser = {
  company: { _id: "", companyLogo: "" },
  email: "",
  firstName: "",
  lastName: "",
  profileImage: "",
  role: RoleEnum.OWNER,
  _id: "",
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: initialUserState,
      viewMode: null,

      setToken: (token, refreshToken) =>
        set({
          accessToken: token,
          refreshToken
        }),

      setUser: (user) =>
        set({
          user,
        }),

        setViewMode: (mode) => set({viewMode: mode}),

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