import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const base = "reports";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllReports: build.query({
      query: (data) => {
        return {
          url: `/${base}`,
          data,
        };
      },
      providesTags: [tagTypes.report],
    }),
    createReport: build.mutation({
      query: (data) => {
        return {
          url: `/${base}`,
          method: "POST",
          data,
        };
      },
      invalidatesTags: [tagTypes.report],
    }),
    reportActions: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `/${base}/actions/${id}`,
          method: "POST",
          data,
        };
      },
      invalidatesTags: [tagTypes.report],
    }),
    appealReport: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `/${base}/appeal/${id}`,
          method: "POST",
          data,
        };
      },
      invalidatesTags: [tagTypes.report],
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useCreateReportMutation,
  useReportActionsMutation,
} = reportsApi;
