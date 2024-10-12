import { SWRConfig } from "swr";
import { EFFICIENCY_API_URL } from "../api-url";
import { HookReply } from "./types";
import { useApiFetch } from "./useApiFetch";

interface ThermoStatusType {
  thermo_status: boolean | string | number;
}

export function useGetThermoStatus(): HookReply<ThermoStatusType> {
  return useApiFetch(`${EFFICIENCY_API_URL}/data/status/thermoflow`, true);
}
