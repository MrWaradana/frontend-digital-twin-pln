import { PFI_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

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

export interface pagination {
  limit: number,
  page: number,
  total_data: number
  total_pages: number
}

export interface DataList {
  pagination: pagination,
  equipments: equipment[]
}
export interface SingleDataList {
  equipments: equipment
}

export function useGetDataTag(
  token: string | undefined,
  page: number,
  limit: number
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/equipment?level=3&page=${page}&limit=${limit}`,
    !!token,
    token,
  )
}
export function useSingleDataTag(
  token: string | undefined,
  equipment_id: string,
): HookReply<SingleDataList> {
  return useApiFetch(
    `${PFI_API_URL}/equipment/${equipment_id}`,
    !!token,
    token,
  )
}