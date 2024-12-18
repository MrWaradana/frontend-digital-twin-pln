import { OPTIMUM_OH_API_URL, PFI_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

export interface EquipmentActiviy {
    id: string
    name: string,
    assetnum: string,
    cost: number
}

interface Pagination {
    items: EquipmentActiviy[]
    page: number,
    itemsPerPage: number,
    totalPages: number,
    total: number
}


export function useGetEquipmentActivities(
    token: string | undefined,
    assetnum: string | undefined,
    page?: number | undefined,
    itemsPerPage?: number | undefined
): HookReply<Pagination> {
    let url = `${OPTIMUM_OH_API_URL}/equipment-activities`

    // Add assetnum as a query parameter
    url += `?assetnum=${assetnum}`

    // Add pagination parameters if provided
    if (page) {
        url += `&page=${page}`
    }

    if (itemsPerPage) {
        url += `&itemsPerPage=${itemsPerPage}`
    }

    return useApiFetch(
        url, //Url
        !!token && !!assetnum, //Ready Condition
        token, //Token
    );
}