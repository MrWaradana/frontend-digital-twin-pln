




import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface EngineFlow {
    [key: string]: number;
}

export function useGetDataEngineFlow(
    token: string | undefined,
    data_id: string | undefined
): HookReply<EngineFlow> {
    return useApiFetch(
        `${EFFICIENCY_API_URL}/data/${data_id}/engine-flow`,
        !!token,
        token,
    );
}
