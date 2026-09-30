import { buildResponse } from "@/lib/api-response";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const moodsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMoods: build.query({
      query: (arg?: Record<string, any>) => ({
        url: `/moods`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.moods],
    }),
    storeMoods: build.mutation({
      query: (data) => ({
        url: "/moods",
        method: "POST",
        data,
        ContentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.moods],
    }),
    updateMoods: build.mutation({
      query: ({ id, data }) => ({
        url: `/moods/${id}`,
        method: "PATCH",
        ContentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.moods],
    }),
    deleteMoods: build.mutation({
      query: (id) => ({
        url: `/moods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.moods],
    }),
    singleMoods: build.query({
      query: (id: string) => ({
        url: `/moods/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.moods],
    }),
  }),
});

export const {
  useGetMoodsQuery,
  useStoreMoodsMutation,
  useUpdateMoodsMutation,
  useDeleteMoodsMutation,
  useSingleMoodsQuery,
} = moodsApi;
