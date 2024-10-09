import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface NPHRType {
  data_id: string;
  name: string;
  chart_result: Array<ChartResult>;
  nphr_result: NPHRResult;
}

interface ChartResult {
  category: string;
  total_nilai_losses: string | number;
  total_persen_losses: string | number;
}

export interface NPHRResult {
  current: number;
  kpi: number;
  target: number;
}

export function useGetDataNPHR(
  token: string | undefined,
  data_id: string | undefined
): HookReply<NPHRType> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/${data_id ? data_id : "null"}/nphr`,
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
