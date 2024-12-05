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
  mdt_hours: number;
}
export interface DataList {
  equipment: Equipment[];
}
export function useGetWorstMDT(token: string | undefined): HookReply<DataList> {
  return useApiFetch(`${RELIABILITY_API_URL}/assets/mdt`, !!token, token);
}
