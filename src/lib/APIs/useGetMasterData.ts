import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface MasterData {
    id: string
    name: string,
    nphr_value: number
}
// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetMasterData(token: string | undefined): HookReply<Array<MasterData>> {
    return useApiFetch(`${EFFICIENCY_API_URL}/cases`, !!token, token);
}
