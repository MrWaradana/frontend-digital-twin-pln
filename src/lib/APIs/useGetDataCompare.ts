import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export function useGetDataCompare(
  token: string | undefined,
  data_id: string | undefined
): HookReply<any> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/${data_id ? data_id : "new"}/compare`,
    !!token,
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
