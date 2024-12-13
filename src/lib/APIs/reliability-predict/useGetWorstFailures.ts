import { equipment } from "./../useGetDataTag";
import { RELIABILITY_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface EquipmentTree {
  id: string;
  level_no: number;
  name: string;
}
export interface Equipment {
  id: string;
  location_tag: string;
  description: string;
  equipment_id: string;
  equipment_tree: EquipmentTree[];
  failure_count: number;
  equipment_name: string | undefined;
  mdt_hours: number | undefined;
  mttr_hours: number | undefined;
  reliability: number | undefined;
}
export interface AssetFailure {
  equipment: Equipment[];
}
export function useGetWorstFailures(
  token: string | undefined,
  isFetched: boolean = false
): HookReply<AssetFailure> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/assets/failures`,
    !!token && !isFetched,
    token,
    {
      shouldRetryOnError: false,
      errorRetryInterval: 60000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        //@ts-ignore
        if (error.status === 404) return;

        // Never retry for a specific key.
        if (key === "/api/user") return;

        // Only retry up to 10 times.
        if (retryCount >= 10) return;

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );
}
