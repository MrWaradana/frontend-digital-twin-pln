import { OPTIMUM_OH_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export function useGetOptimumOH(token: string | undefined): HookReply<any> {
  return useApiFetch(`${OPTIMUM_OH_API_URL}/overhauls`, !!token, token, {
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
  });
}
