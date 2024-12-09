import { PFI_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface feature {
  id: string,
  name: string,
  updated_at: string
  created_at: string
}

export interface DataList {
  feature: feature,
}
export interface DataLists {
  features: feature[],
}

export function useGetFeature(
  token: string | undefined,
  features_id: string,
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/features/${features_id}`,
    !!token,
    token,
  )
}
export function useGetFeatures(
  token: string | undefined,
): HookReply<DataLists> {
  return useApiFetch(
    `${PFI_API_URL}/features`,
    !!token,
    token,
  )
}