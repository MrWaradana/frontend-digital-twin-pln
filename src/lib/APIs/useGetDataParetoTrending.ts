import Commision from "../../app/admin/commision/page";
import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import { ParetoResultDataList } from "./useGetDataPareto";
import { DateValue } from "@react-types/datepicker";

export interface ParetoTrendingResultDataList {
  display_date: string;
  id: string;
  name: string;
  periode: string;
  statas: string;
  pareto: ParetoResultDataList;
}

export function useGetDataParetoTrending(
  token: string | undefined,
  start_date?: DateValue | string | undefined,
  end_date?: DateValue | string | undefined
): HookReply<Array<ParetoTrendingResultDataList>> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/trending/pareto${
      start_date ? `?start_date=${start_date}` : ``
    }${!start_date ? `?` : `&`}${end_date ? `end_date=${end_date}` : ``}`,
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
