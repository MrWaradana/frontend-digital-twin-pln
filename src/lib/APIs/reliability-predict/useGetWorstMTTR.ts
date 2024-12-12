import { equipment } from "../useGetDataTag";
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
  equipment_name: string;
  mttr_hours: number;
  mdt_hours: number | undefined;
  failure_count: number | undefined;
  reliability: number | undefined;
}
export interface MTTR {
  equipment: Equipment[];
}
export function useGetWorstMTTR(
  token: string | undefined,
  isFetched: boolean = false
): HookReply<MTTR> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/assets/mttr`,
    !!token && !isFetched,
    token,
    {
      shouldRetryOnError: false,
      errorRetryInterval: 60000,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.status === 404) return;
        if (key === "/api/user") return;
        if (retryCount >= 10) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );
}
