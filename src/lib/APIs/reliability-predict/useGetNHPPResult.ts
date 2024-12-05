import { RELIABILITY_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface NHPPResult {
  location_tag: string;
  eta: number;
  beta: number;
  reliability: number;
}

export function useGetNHPPResult(
  assetnum: string,
  token: string | undefined
): HookReply<NHPPResult> {
  return useApiFetch(`${RELIABILITY_API_URL}/nhpp/${assetnum}`, !!token, token);
}
