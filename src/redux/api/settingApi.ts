import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export const settingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAbout: build.query({
      query: (arg?: Record<string, any>) => ({
        url: "/page",
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.about],
    }),
    storeAbout: build.mutation({
      query: (data) => ({
        url: "/page",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.about],
    }),
  }),
});

export const { useGetAboutQuery, useStoreAboutMutation } = settingApi;
