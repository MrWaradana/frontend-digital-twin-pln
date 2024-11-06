

//`${EFFICIENCY_API_URL}/data/${data_id}/details?type=out`,

import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

interface DataDetailList {
    name: string;
    jenis_parameter: string;
    details: DataDetail[];
}

export interface DataDetail {
    nilai: number;
}

export function useGetDataDetail(
    token: string | undefined,
    data_id: string | null,
    isReady: boolean = true
): HookReply<DataDetailList> {
    return useApiFetch(
        `${EFFICIENCY_API_URL}/data/${data_id}/details?type=out`,
        !!token && isReady,
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
        }
    );
}
