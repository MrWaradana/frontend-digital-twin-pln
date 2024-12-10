import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export function useGetDataPerformanceGroup(
  token: string | undefined,
  data_id: string | undefined | null
): HookReply<any> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/charts/performance/${data_id}`,
    !!data_id && !!token,
    token,
    {
      keepPreviousData: true,
      refreshInterval: 7200000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      errorRetryInterval: 60000,
      shouldRetryOnError: false,
      // revalidateIfStale: false,
      // revalidateOnMount: false,
    }
  );
}