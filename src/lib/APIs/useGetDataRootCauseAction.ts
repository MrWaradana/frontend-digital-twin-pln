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

export interface DataRootCauseAction {
  id: string;
  data_detail_id: string;
  cause_id: string;
  is_repair: boolean;
  biaya: number;
  parent_cause_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  actions: {
    notes: string;
    biaya: number;
    action_id: string;
    created_at: string;
    created_by: string;
    id: string;
    is_checked: boolean;
    root_cause_id: string;
    updated_at: string;
    updated_by: null;
  }[];
  // variable_header_value: {
  //     [header_id: string]: boolean
  // }
}

export function useGetDataRootCausesAction(
  token: string | undefined,
  data_id: string | undefined,
  detail_id: string | undefined,
  isOpen: boolean
): HookReply<Array<DataRootCauseAction>> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/${data_id}/root/${detail_id}/action`,
    !!token && !!isOpen,
    token
  );
}
