import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import { Variable } from "./useGetVariables";


export interface VariableCause {
    id: string
    name: string,
    parent_id: string,
    variable_id: string,
    children: Array<VariableCause>,
    root_causes: Array<any>,
    variable: Variable
    created_at: string,
    created_by: string,
    updated_at: string,
    updated_by: string;
}

// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetVariableCauses(
    token: string | undefined,
    variable_id: string | undefined,
    isOpen: boolean
): HookReply<Array<VariableCause>> {
    return useApiFetch(
        `${EFFICIENCY_API_URL}/variables/${variable_id}/causes`,
        !!token && !!isOpen,
        token
    )
}