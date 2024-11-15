import { API_RISK_MATRIX_DUMMY } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface Severity {
  id: string | number;
  name: string;
  keterangan: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface DataList{
  pagination: {
    current_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    page_size: number;
    total_items: number;
    total_pages: number;
  },
  severities: Severity[]
}

export function useGetSeverities(
    // token: string | undefined,
  ): HookReply<Array<Severity>> {
    return useApiFetch(
        `${API_RISK_MATRIX_DUMMY}/severity`,
        true
    )
  }

export function useGetSeverity(
//   token: string | undefined,
  id: string,
): HookReply<Severity> {
  return useApiFetch(
      `${API_RISK_MATRIX_DUMMY}/severity/${id}`,
      true
  )
}