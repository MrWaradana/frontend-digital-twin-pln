import { OPTIMUM_OH_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export function useGetTimeConstraintCalculation(
  token: string | undefined,
  calculationId: string = "f92e0ac2-9b42-4418-ac84-21a400d90de7"
): HookReply<any> {
  return useApiFetch(
    `${OPTIMUM_OH_API_URL}/calculation/time-constraint/${calculationId}`,
    !!calculationId && !!token,
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
