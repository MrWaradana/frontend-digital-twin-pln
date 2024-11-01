import Commision from "../../app/admin/commision/page";
import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface ParetoResultDataList {
  name: string;
  pareto_result: Array<DataParetoList>;
  pareto_uncategorized_result: Array<DataParetoList>;
  chart_result: Array<DataParetoList>;
  total_nilai: number;
  total_persen: number;
  percent_threshold: number;
}

export interface DataParetoList {
  category: string;
  data: Array<DataPareto>;
  total_nilai_losses: number;
  total_persen_losses: number;
}

interface DataPareto {
  id: string;
  existing_data: number;
  reference_data: number;
  gap: number;
  nilai_losses: number;
  persen_losses: number;
  persen_hr: number;
  deviasi: number;
  symptoms: string;
  total_biaya: number;
}

export function useGetDataPareto(
  token: string | undefined,
  data_id: string | undefined,
  thresholdValue: string | number | null,
  commision_id?: string | null
): HookReply<ParetoResultDataList> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/${data_id}/pareto?percent_threshold=${thresholdValue}${
      commision_id ? `&commision_id=${commision_id}` : ""
    }`,
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
