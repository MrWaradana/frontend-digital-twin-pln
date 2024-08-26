import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the state and actions for the Zustand store
interface ExcelState {
  excels: Array<{
    id: string;
    excel_filename: string;
    created_at: string;
    created_by: string;
    updated_at: string | null;
    updated_by: string | null;
    description: string | null;
  }>;
  addExcel: (excel: ExcelState["excels"][0]) => void;
  setExcels: (excels: ExcelState["excels"]) => void;
}

// Create the Zustand store
export const useExcelStore = create<ExcelState>()(
  persist(
    (set) => ({
      excels: [],
      addExcel: (excel) =>
        set((state) => ({
          excels: [...state.excels, excel],
        })),
      setExcels: (excels) => set(() => ({ excels })),
    }),
    {
      name: "excel-storage", // name of the storage item
    }
  )
);
