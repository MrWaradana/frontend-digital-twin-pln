import { RELIABILITY_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface Parameters {
  AICc: number;
  alpha: number;
  beta: number;
  gamma: number;
  Lambda: number;
}

export interface Result {
  x: number[];
  y: number[];
}
export interface ReliabilityPlot {
  current_day: number;
  location_tag: string;
  results: Result;
  message: string;
  yCurrent: number;
  best_distribution: string;
}
export interface ReliabilityCurrent {
  location_tag: string;
  reliability_value: number | null;
}

export function useGetReliabilityCurrent(
  id: string | undefined,
  token: string | undefined
): HookReply<ReliabilityCurrent> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/reliability/${id}/current`,
    !!token,
    token
  );
}

export function useGetReliabilityPlot(
  id: string | undefined,
  token: string | undefined
): HookReply<ReliabilityPlot> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/reliability/${id}`,
    !!token,
    token
  );
}
