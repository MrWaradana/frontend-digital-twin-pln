import { OPTIMUM_OH_API_URL } from "../../api-url";
import { useApiPost } from "./useApiPost";

export function usePostNewOHSchedule(token: string | undefined): any {
    return useApiPost(`${OPTIMUM_OH_API_URL}/overhaul-schedules`, !!token, token);
}
