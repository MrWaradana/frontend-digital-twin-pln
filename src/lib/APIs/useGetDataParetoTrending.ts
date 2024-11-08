import Commision from "../../app/admin/commision/page";
import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import { ParetoResultDataList } from "./useGetDataPareto";


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
): HookReply<Array<ParetoTrendingResultDataList>> {
    return useApiFetch(
        `${EFFICIENCY_API_URL}/data/trending/pareto`,
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
