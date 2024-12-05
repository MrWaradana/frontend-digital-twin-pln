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
  name: string;
}
export interface FailuresList {
  equipment: Equipment[];
}
export function useGetWorstFailures(
  token: string | undefined
): HookReply<FailuresList> {
  return useApiFetch(`${RELIABILITY_API_URL}/assets/failures`, !!token, token);
}
