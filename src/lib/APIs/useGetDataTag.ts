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

export interface DataList {
  pagination: {
    current_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    page_size: number;
    total_items: number;
    total_pages: number;
  },
  tags: Tags[]
}

export function useGetDataTag(
  token: string | undefined,
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/selected-tags?page=1&limit=100`,
    !!token,
    token
  )
}