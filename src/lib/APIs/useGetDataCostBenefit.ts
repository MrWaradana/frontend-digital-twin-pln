import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface CostBenefitDataType {
  cost_benefit_result: CostBenefitType[];
  total_biaya: string | number;
  total_cost_benefit: string | number;
  total_nilai: string | number;
  total_persen: string | number;
}

export interface CostBenefitType {
  cost_benefit: string | number;
  deviasi: string | number;
  existing_data: string | number;
  gap: string | number;
  has_cause: string | number;
  id: string | number;
  is_pareto: string | number;
  nilai_losses: string | number;
  persen_hr: string | number;
  persen_losses: string | number;
  reference_data: string | number;
  symptoms: string | number;
  total_biaya: string | number;
  variable: VariableType;
}

interface VariableType {
  category: null | string | number;
  created_at: string | number;
  created_by: string | number;
  deviasi: null | string | number;
  excel_id: string | number;
  excel_variable_name: string | number;
  formula: "plant_net_power";
  id: string | number;
  in_out: string | number;
  input_name: string | number;
  is_faktor_koreksi: null | string | number;
  is_nilai_losses: null | string | number;
  is_nphr: null | string | number;
  is_over_haul: null | string | number;
  is_pareto: true;
  konstanta: null | string | number;
  persen_hr: null | string | number;
  satuan: string | number;
  updated_at: null | string | number;
  updated_by: null | string | number;
  web_id: null | string | number;
}

// export interface NPHRResult {
//   current: number;
//   kpi: number;
//   target: number;
// }

export function useGetDataCostBenefit(
  token: string | undefined
  // data_id: string | undefined
): HookReply<CostBenefitDataType> {
  return useApiFetch(
    `${EFFICIENCY_API_URL}/data/cost-benefit`,
    !!token,
    token,
    {
      keepPreviousData: true,
      refreshInterval: 7200000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      errorRetryInterval: 60000,
      shouldRetryOnError: false,
      // revalidateIfStale: false,
      // revalidateOnMount: false,
    }
  );
}
