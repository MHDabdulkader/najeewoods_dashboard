import { baseApi } from "./baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    supportStore: build.mutation({
      query: (data) => {
        return {
          url: "/page/support",
          method: "POST",
          data,
        };
      },
    }),
  }),
});

export const {useSupportStoreMutation} = supportApi;
