import { buildResponse } from "@/lib/api-response";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query({
      query: (arg?: Record<string, any>) => ({
        url: `/auth/users`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => {
        const rest = buildResponse(res);
        return rest;
      },
      providesTags: [tagTypes.users],
    }),
    singleUser: build.query({
      query: (id: string) => ({
        url: `/auth/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.users],
    }),
    userAcToggle: build.mutation({
      query: (id) => ({
        url: `/auth/active-inactive/${id}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.users],
    }),
    getPostId: build.query({
      query: ({ id, arg }: any) => ({
        url: `/posts/user/${id}`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => {
        const rest = buildResponse(res);
        return rest;
      },
      providesTags: [tagTypes.userbyDetails],
    }),
  }),
});

export const {
  useGetUserQuery,
  useSingleUserQuery,
  useUserAcToggleMutation,
  useGetPostIdQuery,
} = userApi;
