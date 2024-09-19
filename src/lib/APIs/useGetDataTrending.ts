import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import {format} from "date-fns";

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
    pareto: Pareto[];
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;

    // FOR LINECHART CONFIG
    color: string | null;
    
}
// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetDataTrending(
    token: string | undefined,
    variable_ids: string[],
    start_date: Date | null,
    end_date: Date | null,
): HookReply<Array<DataTrending>> {
    const formatDate = (date: Date | null) => {
        return date ? format(date, "yyyy-MM-dd") : "";
      };

    const variable_ids_toString = variable_ids?.join();

    console.log('VARIABLE IDS');
    console.log(variable_ids);

    // return useApiFetch(
    //         `${EFFICIENCY_API_URL}/data/trending?variable_ids=${variable_ids_toString}&start_date=2024-09-01&end_date=2024-09-30`,
    //         !!token && (variable_ids.length > 0),
    //         token
    //     )

    return useApiFetch(
        `${EFFICIENCY_API_URL}/data/trending?variable_ids=${variable_ids_toString}&start_date=${formatDate(start_date)}&end_date=${formatDate(end_date)}`,
        !!token && (variable_ids.length > 0),
        token
    )
}