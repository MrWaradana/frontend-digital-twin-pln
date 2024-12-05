import { string } from "zod";
import { OPTIMUM_OH_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface TimeConstrainParameter {
    costPerFailure: any,
    availableScopes: string[],
    recommendedScope: string,
}

export function useGetCalculationTimeConstrainParameter(
    token: string | undefined,
    isOpen: boolean
): HookReply<TimeConstrainParameter> {
    return useApiFetch(
        `${OPTIMUM_OH_API_URL}/calculation/time-constraint/parameters`,
        isOpen && !!token ,
        token
    )
}