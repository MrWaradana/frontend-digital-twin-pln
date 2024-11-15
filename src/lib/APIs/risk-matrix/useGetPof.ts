import { API_RISK_MATRIX_DUMMY } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";
import { Risk } from "./useGetRisk";
import { Equipment } from "./useGetEquipment";

export interface Pof {
  id: string | number;
  likelihood: any;
  severity: any;
  year: string;
  value:  number;
  equipment_id: string | number;
  risk_id: string | number;
  created_at: string | null;
  updated_at: string | null;
  equipment: Equipment;
  risk: Risk;
}

export interface GroupedPofData {
  likelihood: any;
  severity: any;
  values: number[];
  equipments: string[];
  allData: Pof[]; // Holds all items for each group
}

export interface DataList {
  pagination: {
    current_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    page_size: number;
    total_items: number;
    total_pages: number;
  },
  pofs: Pof[]
}


export function useGetPofs(
    // token: string | undefined,
    year?: string | number | null | undefined,
    equipmentId?: string | number | null | undefined,
    subEquipmentId?: string | number | null | undefined
  ): HookReply<Array<Pof>> {
    
    // console.log(subEquipmentId);

    let url = `${API_RISK_MATRIX_DUMMY}/pof/`;
    const params: string[] = [];

    // CHECK IF SOME QUERY PARAM NOT NULL
    if (year) params.push(`year=${year}`);
    if (equipmentId) params.push(`equipment=${equipmentId}`);
    if (subEquipmentId) params.push(`sub-equipment=${subEquipmentId}`);

    // Join the parameters with '&' if any parameter exists
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return useApiFetch(url, true)
  }

export function useGetPof(
//   token: string | undefined,
  id: string,
): HookReply<Pof> {
  return useApiFetch(
      `${API_RISK_MATRIX_DUMMY}/pof/${id}`,
      true
  )
}



