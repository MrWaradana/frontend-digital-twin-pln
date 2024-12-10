import { PFI_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface feature {
  id: string,
  name: string,
  category: string,
  updated_at: string
  created_at: string
}

export interface Part {
  id: string,
  equipment_id: string,
  location_tag: string,
  type_id: string,
  web_id: string,
  feature_id: string,
  part_name: string,
  created_at: string,
  updated_at: string
}

export interface DataList {
  part: Part,
}

export function useGetPart(
  token: string | undefined,
  part_id: string,
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/part/${part_id}`,
    !!token,
    token,
  )
}
