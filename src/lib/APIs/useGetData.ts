import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import { Selection } from "@nextui-org/react";

interface DataList {
  current_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  page_size: number;
  total_items: number;
  total_pages: number;
  thermo_status: boolean;
  transactions: any;
  chart_data?: any;
}

const INITIAL_VISIBLE_PARAMETER = ["current", "periodic"];
const INITIAL_VISIBLE_STATUS = ["Done", "Pending", "Processing", "Failed"];

export function useGetData(
  token: string | undefined,
  isPerformance: number | undefined = 0,
  page: number | string | undefined = 1,
  size: number | string | undefined = 20,
  search: string | undefined = "",
  parameter: string | Selection | undefined = "",
  status: string | Selection | undefined = ""
): HookReply<DataList> {
  if (typeof status === "string") {
    status = Array.from(INITIAL_VISIBLE_STATUS)
      .map((item) => item)
      .join(",");
  } else {
    status = Array.from(status)
      .map((item) => item)
      .join(",");
  }

  if (typeof parameter === "string") {
    parameter = Array.from(INITIAL_VISIBLE_PARAMETER)
      .map((item) => item)
      .join(",");
  } else {
    parameter = Array.from(parameter)
      .map((item) => item)
      .join(",");
  }

  return useApiFetch(
    `${EFFICIENCY_API_URL}/data?page=${page}&size=${size}&is_performance_test=${isPerformance}&search=${search}&parameter=${parameter}&status=${status}`,
    !!token,
    token,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        //@ts-ignore
        if (error.status === 404) return;

        // Never retry for a specific key.
        if (key === "/api/user") return;

        // Only retry up to 10 times.
        if (retryCount >= 10) return;

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
      keepPreviousData: true,
      refreshInterval: 7200000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      errorRetryInterval: 60000,
      shouldRetryOnError: false,
    }
  );
}
