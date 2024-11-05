import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";
import { Variable } from "./useGetVariables";

export interface VariableCause {
  id: string;
  name: string;
  parent_id: string;
  variable_id: string;
  children: Array<VariableCause>;
  root_causes: Array<any>;
  actions: Array<VariableCauseAction>;
  variable: Variable;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  variable_name: string;
}

export interface VariableCauseAction {
  cause_id: string;
  created_at: string;
  created_by: string;
  id: string;
  name: string;
  updated_at: string;
  updated_by: string;
}

// ${EFFICIENCY_API_URL}/variables?excel_id=${selectedExcel.id}

export function useGetVariableCausesAll(
  token: string | undefined
): HookReply<Array<VariableCause>> {
  return useApiFetch(`${EFFICIENCY_API_URL}/variables/causes`, !!token, token);
}
