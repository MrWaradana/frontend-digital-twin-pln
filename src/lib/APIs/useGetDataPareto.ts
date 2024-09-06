import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";


interface DataParetoList {
    category: string
    data: Array<DataPareto>
    total_nilai_losses: number,
    total_persen_losses: number
}

interface DataPareto {
    id: string,
    existing_data: number,
    reference_data: number,
    gap: number,
    nilai_losses: number,
    persen_losses: number
    persen_hr: number
    deviasi: number,
    symptoms: string,
    total_biaya: number
}

export function useGetData(
    token: string | undefined,
    data_id: string | undefined
): HookReply<Array<DataParetoList>> {
    return useApiFetch(
        `${EFFICIENCY_API_URL}/data/${data_id}/pareto`,
        !!token,
        token
    )
}