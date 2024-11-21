import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface EngineFlow {
  [key: string]: { diff: number; value: number };
}

export function useGetDataEngineFlow(
  token: string | undefined,
  data_id: string | undefined
): HookReply<any> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/${data_id ? `${data_id}` : `new`}/engine-flow`,
    !!token,
    token
  );
}
