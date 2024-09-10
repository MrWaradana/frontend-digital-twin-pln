import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

interface DataList {
  current_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  page_size: number;
  total_items: number;
  total_pages: number;
  transactions: any;
}

export function useGetData(token: string | undefined): HookReply<DataList> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data?page=1&size=100`,
    !!token,
    token
  );
}
