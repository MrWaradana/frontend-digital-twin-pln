import { OPTIMUM_OH_API_URL } from "../../api-url";
import { useApiPost } from "./useApiPost";

export function usePostSelectEquipment(
  token: string | undefined,
  calculation_id: string
): any {
  return useApiPost(
    `${OPTIMUM_OH_API_URL}/calculation/time-constraint?scope_calculation_id=${calculation_id}&with_results=1`,
    !!calculation_id && !!token,
    token
  );
}
