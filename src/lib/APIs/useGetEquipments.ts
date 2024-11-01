import { PFI_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface Category {
  id: string
  name: string,
  created_at: string,
  updated_at: string,
}

export interface EquipmentTree {
  id: string
  name: string,
  created_at: string,
  updated_at: string,
}
export interface Parent {
  id: string
  name: string,
  created_at: string,
  updated_at: string,
}

export interface Equipment {
  id: string
  parent_id: string | null,
  name: string,
  equipment_tree: EquipmentTree,
  parent: Parent,
  category: Category,
  created_at: string,
  updated_at: string,
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
  equipments: Equipment[]
}

export function useGetEquipments(
  token: string | undefined,
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/equipments?page=1&limit=100`,
    !!token,
    token
  )
}

export function useGetEquipment(
  token: string | undefined,
  id: string,
): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/equipment/${id}`,
    !!token,
    token
  )
}

export function useGetEquipmentByParams(token: string | undefined,
  parent: string,): HookReply<DataList> {
  return useApiFetch(
    `${PFI_API_URL}/equipment?parent=${parent}&page=1&limit=100`,
    !!token,
    token
  )
}