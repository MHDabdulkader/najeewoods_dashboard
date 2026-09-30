import type { AxiosError, AxiosRequestConfig } from "axios";

import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import { authKey } from "./constants";
import { helpers } from "./helpers";

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      ContentType?: string;
      onUploadProgress?: AxiosRequestConfig["onUploadProgress"];
    },
    unknown,
    unknown
  > =>
  async ({
    url,
    method,
    data,
    params,
    headers,
    ContentType,
    onUploadProgress,
  }) => {
    const token = helpers.getAuthCookie(authKey);

    console.log(baseUrl + url);
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        onUploadProgress,
        headers: {
          "Content-Type": ContentType || "application/json",
          Authorization: `Bearer ${token}`,
          ...headers,
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
