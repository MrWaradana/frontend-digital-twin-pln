import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import { VariableCause } from "./useGetVariableCause";


// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetVariableCauseActions(
    token: string | undefined,
    variable_id: string | undefined,
    detail_id: string | undefined,
    isOpen: boolean
): HookReply<Array<VariableCause>> {
    return useApiFetch(
        `${EFFICIENCY_API_URL}/variables/${variable_id}/actions?detail_id=${detail_id}`,
        !!token && !!isOpen,
        token
    )
}