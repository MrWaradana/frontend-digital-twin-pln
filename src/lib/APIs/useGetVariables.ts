import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import { format } from "date-fns";

export interface Variable {
  id: string;
  input_name: string;
  short_name: string;
  excel_variable_name: string;
  category: string;
  excel_id: string;
  satuan: string;
  in_out: "in" | "out";
  is_faktor_koreksi: boolean;
  is_nilai_losses: boolean;
  is_pareto: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}
// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetVariables(
  token: string | undefined,
  excel_id: string | undefined,
  type: string | undefined,
  parameter?: string | undefined,
  startDate?: string | undefined,
  endDate?: string | undefined
): HookReply<Array<Variable>> {
  const formatDate = (date: Date | null) => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  return useApiFetch(
    `${EFFICIENCY_API_URL}/variables?excel_id=${excel_id}&type=${type}&parameter=${
      parameter ? parameter : "current"
    }&start_date=${startDate}&end_date=${endDate}`,
    // `${EFFICIENCY_API_URL}/variables?excel_id=${excel_id}&type=${type}`,
    !!token,
    token
  );
}
