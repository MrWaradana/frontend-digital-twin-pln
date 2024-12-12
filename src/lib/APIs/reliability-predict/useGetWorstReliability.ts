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
  parent_name: string;
  description: string;
  equipment_id: string;
  equipment_tree: EquipmentTree[];
  equipment_name: string;
  status: string;
  timeat: number;
  failure_count: number | undefined;
  mdt_hours: number | undefined;
  mttr_hours: number | undefined;
  reliability: number;
}
export interface Reliability {
  equipment: Equipment[];
}
export function useGetWorstReliability(
  token: string | undefined,
  isFetched: boolean = false
): HookReply<Reliability> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/assets/reliability`,
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
