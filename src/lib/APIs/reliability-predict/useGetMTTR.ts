import { RELIABILITY_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface MDT {
  assetnum: string;
  hours: number;
}

export function useGetMTTR(
  id: string | undefined,
  token: string | undefined
): HookReply<MDT> {
  return useApiFetch(`${RELIABILITY_API_URL}/asset/mttr/${id}`, !!token, token);
}
