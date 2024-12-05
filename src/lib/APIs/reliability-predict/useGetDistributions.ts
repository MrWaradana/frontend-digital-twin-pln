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
export interface Distribution {
  best_distribution: string;
  current_day: number;
  location_tag: string;
  parameters: Parameters;
  results: Result;
  message: string;
}
export function useGetDistribution(
  id: string | undefined,
  token: string | undefined
): HookReply<Distribution> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/distributions/${id}`,
    !!token,
    token
  );
}
