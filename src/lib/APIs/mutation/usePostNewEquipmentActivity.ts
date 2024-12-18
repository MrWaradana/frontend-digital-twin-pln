import { OPTIMUM_OH_API_URL } from "../../api-url";
import { useApiPost } from "./useApiPost";

export function usePostNewEquipmentActivity(token: string | undefined, selectedRowId): any {
    let url = `${OPTIMUM_OH_API_URL}/equipment-activities`
    if (selectedRowId) {
        url += `/${selectedRowId}`
    }

    return useApiPost(url, !!token, token);
}
