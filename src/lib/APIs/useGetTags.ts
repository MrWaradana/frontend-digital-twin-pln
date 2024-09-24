import { API_V1_LIVE_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import {format} from "date-fns";

interface TagValues {
    id: string;
    tag_id: string;
    time_stamp: string;
    value: number;
}

interface Tags {
    id: string;
    descriptor: string | number;
    digital_set_name: string | number;
    display_digits: number;
    engineering_units: string | number;
    future: boolean | string;
    name: string;
    path: string;
    point_class: string;
    point_type: string;
    span: number;
    step: boolean;
    values: TagValues[];
    web_id: string;
    zero: number;
    // created_at: string;
    // created_by: string;
    // updated_at: string;
    // updated_by: string;

    // FOR LINECHART CONFIG
    // color: string | null;
    
}
// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetTags(
    token: string | undefined,
): HookReply<Array<Tags>> {

    
    return useApiFetch(
        `${API_V1_LIVE_URL}/tags`,
        !!token,
        token
    )
}