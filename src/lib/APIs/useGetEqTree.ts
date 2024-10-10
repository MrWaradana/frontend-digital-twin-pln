import { PFI_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface EquipmentTrees {
  id: string
  level_no: number,
  name: string,
  created_at: string,
  updated_at: string,
}

export function useGetEqTrees(
  token: string | undefined,
): HookReply<Array<EquipmentTrees>> {
  return useApiFetch(
      `${PFI_API_URL}/equipment_trees`,
      !!token,
      token
  )
}