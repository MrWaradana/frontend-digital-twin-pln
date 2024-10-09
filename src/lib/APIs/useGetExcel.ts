import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

// interface Variable {
//     id: string
//     input_name: string,
//     short_name: string,
//     excel_variable_name: string,
//     category: string,
//     excel_id: string,
//     satuan: string
//     in_out: "in" | "out",
//     is_faktor_koreksi: boolean,
//     is_nilai_losses: boolean,
//     is_pareto: boolean,
//     created_at: string,
//     created_by: string,
//     updated_at: string,
//     updated_by: string;
// }
// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetExcel(token: string | undefined): HookReply<Array<any>> {
  return useApiFetch(`${EFFICIENCY_API_URL}/excels`, !!token, token, {
    shouldRetryOnError: false,
    errorRetryInterval: 60000,
  });
}
