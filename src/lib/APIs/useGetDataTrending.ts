import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

// export interface DataParetoList {
//   category: string;
//   data: Array<DataPareto>;
//   total_nilai_losses: number;
//   total_persen_losses: number;
// }

// interface DataPareto {
//   id: string;
//   existing_data: number;
//   reference_data: number;
//   gap: number;
//   nilai_losses: number;
//   persen_losses: number;
//   persen_hr: number;
//   deviasi: number;
//   symptoms: string;
//   total_biaya: number;
// }

export function useGetDataTrending(
    token: string | undefined,
    variable_id: string | undefined,
    start_date: string | undefined,
    end_date: string | undefined
): HookReply<Array<any>> {

    
    
    
    return useApiFetch(
        `${EFFICIENCY_API_URL}/data/trending?variable_id=${variable_id}&start_date=${start_date}&end_date=${end_date}`,
        !!token,
        token
    );
}