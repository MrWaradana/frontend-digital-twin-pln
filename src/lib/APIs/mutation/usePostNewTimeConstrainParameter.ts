import { OPTIMUM_OH_API_URL } from "../../api-url";
import { useApiPost } from "./useApiPost";

export function usePostNewTimeConstrainParameter(token: string | undefined): any {
  return useApiPost(`${OPTIMUM_OH_API_URL}/calculation/time-constraint`, !!token, token);
}
