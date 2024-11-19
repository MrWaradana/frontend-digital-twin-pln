import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

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

export function useGetData(
  token: string | undefined,
  isPerformance: number | undefined = 0,
  page: number | string | undefined = 1,
  size: number | string | undefined = 20
): HookReply<DataList> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data?page=${page}&size=${size}&is_performance_test=${isPerformance}`,
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
