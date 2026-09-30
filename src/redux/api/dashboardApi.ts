import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDashboard: build.query({
      query: (arg?: Record<string, any>) => ({
        url: `/statistics`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.dashboard],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
