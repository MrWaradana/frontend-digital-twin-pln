import { PFI_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface equipment {
  assetnum: string,
  category_id: string,
  created_at: string,
  equipment_tree: {
    id: string,
    level_no: number,
    name: string
  },
  childrens: equipment[],
  equipment_tree_id: string,
  id: string,
  location_tag: string,
  name: string,
  parent_id: string,
  system_tag: string,
  updated_at: string
}

export interface equipmentValues {
  id: string,
  created_at: string,
  updated_at: string,
  date_time: string,
  equipment_id: string,
  features_id: string,
  value: number
}

export interface DataList {
  values: equipmentValues[],
  predictions: equipmentValues[],
}

export function useGetEquipmentValues(
  token: string | undefined,
  equipment_id: string,
  features_id: string,
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/predict-values?equipment_id=${equipment_id}&features_id=${features_id}`,
    !!token,
    token,
  )
}