import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

interface NphrNiaga {
    id: string
    name: string,
    nphr_value: number
    created_at: string,
    created_by: string,
    updated_at: string,
    updated_by: string;
}
// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetNphrNiaga(token: string | undefined): HookReply<Array<NphrNiaga>> {
    return useApiFetch(`${EFFICIENCY_API_URL}/cases`, !!token, token);
}
