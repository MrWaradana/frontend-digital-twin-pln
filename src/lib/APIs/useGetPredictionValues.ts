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

export interface TagValue {
  time_stamp: string;
  value: number;
}

export interface DataList {
  predicted_values: TagValue[],
  tag_values: TagValue[],
  tag: Tags
}

export function useGetPredictionValues(
  token: string | undefined,
  tag_id: number,
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/predict-values?tag_id=${tag_id}`,
    !!token,
    token,
  )
}