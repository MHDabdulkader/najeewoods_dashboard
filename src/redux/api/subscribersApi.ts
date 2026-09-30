import { buildResponse } from "@/lib/api-response";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const subscribersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubscribers: build.query({
      query: (arg?: Record<string, any>) => ({
        url: `/subscriptions`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => {
        const rest = buildResponse(res);
        return rest;
      },
      providesTags: [tagTypes.subscribers],
    }),
    getPlan: build.query({
      query: (arg?: Record<string, any>) => ({
        url: "/plans",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.plans],
    }),
    updatePlan: build.mutation({
      query: ({ id, data }) => ({
        url: `/plans/upgrade-plan/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.plans],
    }),
    subAcToggle: build.mutation({
      query: (id) => ({
        url: `/subscriptions/pause/${id}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.subscribers],
    }),
  }),
});

export const {
  useGetPlanQuery,
  useGetSubscribersQuery,
  useSubAcToggleMutation,
  useUpdatePlanMutation
} = subscribersApi;
