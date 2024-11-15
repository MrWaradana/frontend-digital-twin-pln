import { API_RISK_MATRIX_DUMMY } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";
import { Likelihood } from "./useGetLikelihood";
import { Severity } from "./useGetSeverity";

export interface Risk {
  id: string | number;
  risk_class: string;
  likelihood_id: string;
  severity_id: string;
  created_at: string | null;
  updated_at: string | null;
  likelihood: Likelihood;
  severity: Severity;
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
  risks: Risk[]
}

export function useGetRisks(
    // token: string | undefined,
  ): HookReply<Array<Risk>> {
    return useApiFetch(
        `${API_RISK_MATRIX_DUMMY}/risk`,
        true
    )
  }

export function useGetRisk(
//   token: string | undefined,
  id: string,
): HookReply<Risk> {
  return useApiFetch(
      `${API_RISK_MATRIX_DUMMY}/risk/${id}`,
      true
  )
}