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
export interface Parent {
  equipment_id: string | null;
  name: string;
}
export interface Params {
  AICc: number;
  alpha: number;
  beta: number;
  gamma: number;
  Lambda: number;
  sigma: number;
  mu: number;
}
export interface Equipment {
  id: string;
  assetnum: string;
  parent_name: string;
  name: string;
  equipment_id: string;
  equipment_tree: EquipmentTree;
  reliability: number;
  equipment_name: string;
  status: string;
  age: number;
  parent_id: string;
  distribution: string;
  params: Params;
  location_tag: string;
  parent: Parent;
  num_fail: number;
}
export interface EquipmentList {
  equipment: Equipment;
}
export function useGetEquipmentRP(
  id: string | undefined,
  token: string | undefined
): HookReply<EquipmentList> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/main/equipment_master/${id}`,
    !!token,
    token
  );
}
export function useGetEquipmentAll(
  token: string | undefined
): HookReply<EquipmentList> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/main/equipment_master`,
    !!token,
    token
  );
}
