import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface RootCauseCountDataType {
  done: string | number;
  id: string | number;
  total: string | number;
}

export function useGetRootCauseCount(
  token: string | undefined,
  data_id: string | undefined
): HookReply<RootCauseCountDataType> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/${data_id}/root/notify`,
    !!token,
    token,
    {
      keepPreviousData: true,
      refreshInterval: 7200000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      // revalidateIfStale: false,
      // revalidateOnMount: false,
    }
  );
}
