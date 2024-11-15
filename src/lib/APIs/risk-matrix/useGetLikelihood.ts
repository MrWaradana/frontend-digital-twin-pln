import { API_RISK_MATRIX_DUMMY } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface Likelihood {
  id: string | number;
  name: string;
  keterangan: string;
  created_at: string | null;
  updated_at: string | null;
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
  likelihoods: Likelihood[]
}

export function useGetLikelihoods(
    // token: string | undefined,
  ): HookReply<Array<Likelihood>> {
    return useApiFetch(
        `${API_RISK_MATRIX_DUMMY}/likelihood`,
        true
    )
  }

export function useGeLikelihood(
//   token: string | undefined,
  id: string,
): HookReply<Likelihood> {
  return useApiFetch(
      `${API_RISK_MATRIX_DUMMY}/likelihood/${id}`,
      true
  )
}