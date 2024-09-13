import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

interface Pareto {
    id: string;
    existing_data: number;
    gap: number;
    nilai_losses: number;
    persen_losses: number;
    reference_data: number;
}

interface DataTrending {
    id: string;
    name: string;
    jenis_parameter: string;
    excel_id: string;
    periode: string;
    sequence: number;
    pareto: Pareto;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
}
// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetDataTrending(
    token: string | undefined,
    variable_id: string[] | string | undefined,
    start_date: string | undefined,
    end_date: string | undefined,
): HookReply<Array<DataTrending>> {
    return useApiFetch(
        `${EFFICIENCY_API_URL}/data/trending?variable_id=${variable_id}&start_date=${start_date}&end_date=${end_date}`,
        !!token,
        token
    )
}