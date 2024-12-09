import { RELIABILITY_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface MTBF {
  location_tag: string;
  hours: number | null;
  message: string;
}

export function useGetMTBF(
  id: string | undefined,
  token: string | undefined
): HookReply<MTBF> {
  return useApiFetch(`${RELIABILITY_API_URL}/asset/mtbf/${id}`, !!token, token);
}
