import { OPTIMUM_OH_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export function useGetTargetReliabilityCalculation(
    token: string | undefined,
    scope_name: string | undefined = "A",
    eaf_threshold: number = 100
): HookReply<any> {
    let url = `${OPTIMUM_OH_API_URL}/calculation/target-reliability?eaf_threshold=${eaf_threshold}`

    if (scope_name) {
        url += `&scope_name=${scope_name}`
    }

    return useApiFetch(
        url,
        !!token,
        token,
    );
}
