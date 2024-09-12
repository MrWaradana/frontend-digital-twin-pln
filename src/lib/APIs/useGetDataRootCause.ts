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


export interface DataRootCause {
    id: string,
    data_detail_id: string
    cause_id: string
    is_repair: boolean
    biaya: number
    created_by: string
    updated_by: string
    created_at: string
    updated_at: string
    variable_header_value: {
        [header_id: string]: boolean
    }
}

export function useGetDataRootCauses(
    token: string | undefined,
    data_id: string | undefined,
    detail_id: string | undefined,
    isOpen: boolean
): HookReply<Array<DataRootCause>> {

    return useApiFetch(
        `${EFFICIENCY_API_URL}/data/${data_id}/root/${detail_id}`,
        !!token && !!isOpen,
        token
    );
}