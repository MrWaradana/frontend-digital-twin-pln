import { PFI_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface Tags {
  created_at: string,
  descriptor: string,
  digital_set_name: string,
  display_digits: number,
  engineering_units: string,
  future: boolean,
  id: number,
  name: string,
  path: string,
  point_class: string,
  point_type: string,
  span: number,
  step: boolean,
  updated_at: string,
  web_id: string,
  zero: number
}

export interface equipment {
  assetnum: string,
  category_id: string,
  created_at: string,
  equipment_tree: {
    id: string,
    level_no: number,
    name: string
  },
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
  tag: Tags
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
  tag_id: number,
): HookReply<SingleDataList> {
  return useApiFetch(
    `${PFI_API_URL}/equipment/${tag_id}`,
    !!token,
    token,
  )
}