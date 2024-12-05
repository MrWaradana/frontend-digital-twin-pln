import { RELIABILITY_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface FailureRate {
  location_tag: string;
  failure_rate: number | null | undefined;
}

export function useGetFailureRate(
  id: string | undefined,
  token: string | undefined
): HookReply<FailureRate> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/asset/failure-rate/${id}`,
    !!token,
    token
  );
}
