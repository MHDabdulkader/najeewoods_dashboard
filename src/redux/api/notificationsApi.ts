import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";
import { buildResponse } from "@/lib";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotification: build.query({
      query: (arg?: Record<string, any>) => ({
        url: "/notifications",
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => {
        const rest = buildResponse(res);
        return rest;
      },
      providesTags: [tagTypes.notification],
    }),
    readNotification: build.mutation({
      query: (arg):any => ({
        url: `/notifications/read?id=${arg}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.notification],
    }),
  }),
});

export const { useGetNotificationQuery, useReadNotificationMutation } =
  notificationApi;
