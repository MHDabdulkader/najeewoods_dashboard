import { tagTypes } from "@/redux/tag-types";
import { baseApi } from "./baseApi";
import { buildResponse } from "@/lib";

export const commonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPost: build.query({
      query: (arg?: Record<string, any>) => ({
        url: "/posts",
        method: "GET",
        params: arg,
      }),
      transformResponse: (res: any) => {
        const rest = buildResponse(res);
        return rest;
      },
      providesTags: [tagTypes.post],
    }),
    storePost: build.mutation({
      query: (data) => ({
        url: "/posts",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.post],
    }),
    updatePost: build.mutation({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.post],
    }),
    deletePost: build.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        tagTypes.post,
        tagTypes.userbyDetails,
        tagTypes.subscribers,
      ],
    }),
    likePost: build.mutation({
      query: (id) => ({
        url: `/posts/like/${id}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.post],
    }),
    storeMedia: build.mutation({
      query: ({ data, onUploadProgress }: any) => ({
        url: "/media",
        method: "POST",
        ContentType: "multipart/form-data",
        onUploadProgress,
        data,
      }),
      invalidatesTags: [tagTypes.post],
    }),
    updateMedia: build.mutation({
      query: ({ id, data, onUploadProgress }) => ({
        url: `/media/${id}`,
        method: "PATCH",
        ContentType: "multipart/form-data",
        onUploadProgress,
        data,
      }),
      invalidatesTags: [tagTypes.post],
    }),
  }),
});

export const {
  useGetPostQuery,
  useStorePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUpdatePostMutation,
  useStoreMediaMutation,
  useUpdateMediaMutation,
} = commonApi;
