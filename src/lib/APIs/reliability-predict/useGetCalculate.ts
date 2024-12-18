import { RELIABILITY_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface Result {
  location_tag: string;
  value: number;
}

export function useGetCalculateMTTR(
  token: string | undefined,
  location_tag: string | undefined,
  date: string | undefined,
  isFetched: boolean = false
): HookReply<Result> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/calculate/mttr/${location_tag}/${date}`,
    !!token && !isFetched,
    token
  );
}

export function useGetCalculateMDT(
  token: string | undefined,
  location_tag: string | undefined,
  date: string | undefined,
  isFetched: boolean = false
): HookReply<Result> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/calculate/mdt/${location_tag}/${date}`,
    !!token && !isFetched,
    token
  );
}

export function useGetCalculateMTBF(
  token: string | undefined,
  location_tag: string | undefined,
  date: string | undefined,
  isFetched: boolean = false
): HookReply<Result> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/calculate/mtbf/${location_tag}/${date}`,
    !!token && !isFetched,
    token
  );
}

export function useGetCalculateFailures(
  token: string | undefined,
  location_tag: string | undefined,
  date: string | undefined,
  isFetched: boolean = false
): HookReply<Result> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/calculate/failures/${location_tag}/${date}`,
    !!token && !isFetched,
    token
  );
}

export function useGetCalculateFailureRate(
  token: string | undefined,
  location_tag: string | undefined,
  date: string | undefined,
  isFetched: boolean = false
): HookReply<Result> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/calculate/failure-rate/${location_tag}/${date}`,
    !!token && !isFetched,
    token
  );
}
export function useGetCalculateReliability(
  token: string | undefined,
  location_tag: string | undefined,
  date: string | undefined,
  isFetched: boolean = false
): HookReply<Result> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/calculate/reliability/${location_tag}/${date}`,
    !!token && !isFetched,
    token
  );
}

export function useGetCalculateProbability(
  token: string | undefined,
  location_tag: string | undefined,
  date: string | undefined,
  isFetched: boolean = false
): HookReply<Result> {
  return useApiFetch(
    `${RELIABILITY_API_URL}/calculate/probabilities/${location_tag}/${date}`,
    !!token && !isFetched,
    token
  );
}
