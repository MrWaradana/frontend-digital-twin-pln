import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import { Variable } from "./useGetVariables";


export interface VariableHeader {
    id: string
    name: string,
    variable_id: string,
    created_at: string,
    created_by: string,
    updated_at: string,
    updated_by: string;
}

// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetVariableHeaders(
    token: string | undefined,
    variable_id: string | undefined,
    isOpen: boolean
): HookReply<Array<VariableHeader>> {
    return useApiFetch(
        `${EFFICIENCY_API_URL}/variables/${variable_id}/headers`,
        !!token && !!isOpen,
        token
    )
}