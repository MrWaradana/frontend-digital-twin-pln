import { select } from "@nextui-org/theme";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the state and actions for the Zustand store
interface SelectedEfficiencyDataState {
  selectedEfficiencyData: string;
  setSelectedEfficiencyData: (data: {
    anchorKey: string;
    currentKey: string;
  }) => void;
}

// Create the Zustand store
export const useSelectedEfficiencyDataStore =
  create<SelectedEfficiencyDataState>()(
    persist(
      (set) => ({
        selectedEfficiencyData: "",
        setSelectedEfficiencyData: (data) =>
          set({ selectedEfficiencyData: data.currentKey }), // Store only the currentKey
      }),
      {
        name: "nphr-storage", // name of the storage item
      }
    )
  );
