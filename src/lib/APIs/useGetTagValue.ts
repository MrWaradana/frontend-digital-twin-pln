import { API_V1_LIVE_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import {format} from "date-fns";

interface value {
    id: string;
    tag_id: string;
    time_stamp: string;
    value: number;
}

interface TagValueData {
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
    values: value[];
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

export function useGetTagValue(
    token: string | undefined,
    tag_ids: string[],
    start_date: Date | null,
    end_date: Date | null,
): HookReply<Array<TagValueData>> {
    const formatDate = (date: Date | null) => {
        return date ? format(date, "yyyy-MM-dd") : "";
      };

    const tag_ids_toString = tag_ids?.join();

    // console.log('TAG IDS');
    // console.log(tag_ids);

    // return useApiFetch(
    //         `${EFFICIENCY_API_URL}/data/trending?variable_ids=${variable_ids_toString}&start_date=2024-09-01&end_date=2024-09-30`,
    //         !!token && (variable_ids.length > 0),
    //         token
    //     )

    return useApiFetch(
        `${API_V1_LIVE_URL}/tag-values?tags=${tag_ids_toString}&start_date=${formatDate(start_date)}&end_date=${formatDate(end_date)}`,
        !!token && (tag_ids.length > 0),
        token
    )
}