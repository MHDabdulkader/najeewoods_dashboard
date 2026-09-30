import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { helpers, authKey } from "@/lib";
import type { AppDispatch } from "../store";

export interface User {
  name: string;
  email: string;
  role?: string;
  token: string;
  avatar?: string;
}

interface AuthState {
  user: User;
  isLogged: boolean;
  isProfileLoading: boolean;
}

const token = helpers.getAuthCookie(authKey);

const initialState: AuthState = {
  user: { name: "", email: "", role: "", token: token || "", avatar: "" },
  isLogged: !!token,
  isProfileLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<User>>) {
      state.user = { ...state.user, ...action.payload };
      state.isLogged = !!state.user.token;
    },
    clearUser(state) {
      state.user = initialState.user;
      state.isLogged = false;
      state.isProfileLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.getProfile.matchPending, (state) => {
        state.isProfileLoading = true;
      })
      .addMatcher(authApi.endpoints.getProfile.matchFulfilled, (state, { payload }) => {
        state.user = {
          ...state.user,
          name: payload?.data?.name || "",
          email: payload?.data?.email || "",
          role: payload?.data?.role || "",
          avatar: payload?.data?.avatar || "",
        };
        state.isLogged = !!state.user.token;
        state.isProfileLoading = false;
      })
      .addMatcher(authApi.endpoints.getProfile.matchRejected, (state) => {
        state.isLogged = false;
        state.isProfileLoading = false;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

// -------------------------
// smart client-side init for App Router
export const initAuth = (dispatch: AppDispatch, getState: () => { auth: AuthState }) => {
  const { auth } = getState();
  if (auth.user.token && !auth.user.name && !auth.user.email) {
    dispatch(authApi.endpoints.getProfile.initiate({}));
  }
};
