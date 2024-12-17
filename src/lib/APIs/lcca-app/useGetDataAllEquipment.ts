import { LCCA_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export interface Equipment {
  acquisition_year: number;
  acquisition_cost: number;
  capital_cost_record_time: number;
  design_life: number;
  forecasting_target_year: number;
  manhours_rate: number;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  id: string | null;
}

export function useGetDataEquipmentById(
  token: string | undefined,
  equipment_id: string
): HookReply<Equipment> {
  return useApiFetch(
    `${LCCA_API_URL}/equipment/${equipment_id}`,
    !!equipment_id && !!token,
    token
  );
}
