import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    LoginIn: build.mutation({
      query: (data) => {
        return {
          url: "/auth/login",
          method: "POST",
          data,
        };
      },
      invalidatesTags: [tagTypes.profile],
    }),
    forgotPassword: build.mutation({
      query: (data) => ({
        url: "/auth/forgot",
        method: "POST",
        data,
      }),
    }),
    otpVarify: build.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        data,
      }),
    }),
    getProfile: build.query({
      query: () => ({
        url: "/auth/get-profile",
        method: "GET",
      }),
      providesTags: [tagTypes.profile],
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: "/auth",
        method: "PATCH",
        ContentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.profile],
    }),
    updatePassword: build.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useLoginInMutation,
  useForgotPasswordMutation,
  useOtpVarifyMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = authApi;
