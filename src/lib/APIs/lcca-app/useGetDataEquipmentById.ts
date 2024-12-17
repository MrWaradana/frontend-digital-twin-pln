import { LCCA_API_URL } from "../../api-url";
import { HookReply } from "../types";
import { useApiFetch } from "../useApiFetch";

export function useGetDataEquipmentById(
  token: string | undefined,
  equipment_id: string
): HookReply<any> {
  return useApiFetch(
    `${LCCA_API_URL}/equipment/${equipment_id}`,
    !!equipment_id && !!token,
    token
  );
}
