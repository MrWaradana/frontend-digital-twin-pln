import { select } from "@nextui-org/theme";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the state and actions for the Zustand store
interface SelectedEfficiencyDataState {
  selectedEfficiencyData: string | any;
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
          set({ selectedEfficiencyData: data }),
      }),
      {
        name: "nphr-storage",
        getStorage: () => localStorage, // Explicitly use localStorage
      }
    )
  );
