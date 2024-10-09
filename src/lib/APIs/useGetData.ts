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
  isPerformance: number | undefined = 0
): HookReply<DataList> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data?page=1&size=100&is_performance_test=${isPerformance}`,
    !!token,
    token,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        if (error.status === 404) return;

        // Never retry for a specific key.
        if (key === "/api/user") return;

        // Only retry up to 10 times.
        if (retryCount >= 10) return;

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );
}
