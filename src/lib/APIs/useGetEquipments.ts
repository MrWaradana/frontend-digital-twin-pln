import { PFI_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface Category {
  id: string
  name: string,
  created_at: string,
  updated_at: string,
}
export interface Children{
  id: string
  parent_id: string | null,
  category_id: string,
  name: string,
  description: string,
  category: Category,
  children: Children[],
  created_at: string,
  updated_at: string,
}

export interface Equipment {
  id: string
  parent_id: string | null,
  category_id: string,
  name: string,
  description: string,
  children: Children[],
  category: Category,
  created_at: string,
  updated_at: string,
}

export function useGetEquipments(
  token: string | undefined,
): HookReply<Array<Equipment>> {
  return useApiFetch(
      `${PFI_API_URL}/equipments`,
      !!token,
      token
  )
}

export function useGetEquipment(
  token: string | undefined,
  id: string,
): HookReply<Equipment> {
  return useApiFetch(
      `${PFI_API_URL}/equipment/${id}`,
      !!token,
      token
  )
}