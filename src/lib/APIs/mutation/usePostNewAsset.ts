import { OPTIMUM_OH_API_URL } from "../../api-url";
import { useApiPost } from "./useApiPost";

export function usePostNewAsset(token: string | undefined): any {
  return useApiPost(`${OPTIMUM_OH_API_URL}/scope-equipments`, !!token, token);
}
