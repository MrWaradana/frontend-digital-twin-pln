import { API_RISK_MATRIX_DUMMY } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

// export interface SubEquipment {
//   id: string
//   name: string,

//   created_at: string,
//   updated_at: string,
// }

export interface Equipment {
  id: string | number;
  parent_id: string | number | null;
  name: string;
  system_tag: string;
  sub_equipments?: Equipment[] | [] | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DataList{
  pagination: {
    current_page: number;
    has_next_page: boolean;
    has_previous_page: boolean;
    page_size: number;
    total_items: number;
    total_pages: number;
  },
  equipments: Equipment[]
}


export function useGetEquipments(
  // id: string | number | null,
  // subId: string | number | null
  ): HookReply<Equipment[]> {
    // let url: string = 'equipment';
    // if (id) {
    //   url = `equipment/${id}`;
    // } 
    // else if (id && subId) {
    //   url = `equipment/${id}/sub/${subId}`;
    // }

    return useApiFetch(
      `${API_RISK_MATRIX_DUMMY}/equipment/`,
      true,
    )
  }

  // NOT USED
export function useGetEquipment(
  id?: string |number | null,
): HookReply<Equipment> {
    return useApiFetch(
      `${API_RISK_MATRIX_DUMMY}/equipment/${id}`,
      true,
  );
  
}

  // NOT USED
export function useGetSubEquipments(
  parentId: string,
): HookReply<Equipment> {
  return useApiFetch(
      `${API_RISK_MATRIX_DUMMY}/equipment/${parentId}/sub`,
      true,
  )
}

  // NOT USED
export function useGetSubEquipment(
  parentId: string,
  subId: string,
): HookReply<Equipment> {
  return useApiFetch(
      `${API_RISK_MATRIX_DUMMY}/equipment/${parentId}/sub/${subId}`,
      true,
  )
}