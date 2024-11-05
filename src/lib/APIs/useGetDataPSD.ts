import { PFI_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface Tag {
  description: string,
  id: number,
  name: string
}

export interface PSD {
  timestamp: string,
  value: number
}

export interface DataList {
  psd_values: PSD[]
  tag: Tag
}

export function useGetDataPSD(
  token: string | undefined, id: number | undefined
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/psd-values/${id}`,
    !!token,
    token
  )
}