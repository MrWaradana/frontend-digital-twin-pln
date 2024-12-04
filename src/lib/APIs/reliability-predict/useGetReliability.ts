import { RELIABILITY_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface ReliabilityCurrent {
  assetnum: string;
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
