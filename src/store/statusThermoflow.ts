import { select } from "@nextui-org/theme";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the state and actions for the Zustand store
interface StatusThermoflowState {
  statusThermoflow: boolean;
  setStatusThermoflow: (value: boolean) => void;
}

// Create the Zustand store
export const useStatusThermoflowStore = create<StatusThermoflowState>()(
  persist(
    (set) => ({
      statusThermoflow: false,
      setStatusThermoflow: (data: boolean) => set({ statusThermoflow: data }), // Store only the currentKey
    }),
    {
      name: "status-thermoflow-storage", // name of the storage item
    }
  )
);
