import { useGetEquipment } from "@/lib/APIs/useGetEquipments";
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
  assetnum: string;
  parent_name: string;
  description: string;
  equipment_id: string;
  equipment_tree: EquipmentTree[];
  reliability: number;
  equipment_name: string;
  status: string;
  timeat: number;
}
export interface FailuresList {
  equipment: Equipment[];
}
export function useGetEquipmentRP(
  token: string | undefined
): HookReply<FailuresList> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/assets/reliability`,
    !!token,
    token
  );
}
