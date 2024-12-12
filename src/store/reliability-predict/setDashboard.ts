import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define types for Equipment and related attributes (if needed)
interface Equipment {
  id: string;
  location_tag: string;
  equipment_name: string | undefined;
  failure_count: number | undefined;
  mdt_hours: number | undefined;
  mttr_hours: number | undefined;
  reliability: number | undefined;
}

interface EquipmentState {
  assetsFailures: Array<Equipment>;
  assetsMTTR: Array<Equipment>;
  assetsMDT: Array<Equipment>;
  assetsReliability: Array<Equipment>;
  addFailure: (failure: Equipment) => void;
  setFailures: (failures: Array<Equipment>) => void;
  addMTTR: (mttr: Equipment) => void;
  setMTTR: (mttrs: Array<Equipment>) => void;
  addMDT: (mdt: Equipment) => void;
  setMDT: (mdts: Array<Equipment>) => void;
  addReliability: (reliability: Equipment) => void;
  setReliability: (reliabilities: Array<Equipment>) => void;
}

// Create the Zustand store
export const setDashboard = create<EquipmentState>()(
  persist(
    (set) => ({
      assetsFailures: [],
      assetsMTTR: [],
      assetsMDT: [],
      assetsReliability: [],

      addFailure: (failure) =>
        set((state) => ({
          assetsFailures: [...state.assetsFailures, failure],
        })),
      setFailures: (failures) => set(() => ({ assetsFailures: failures })),
      addMTTR: (mttr) =>
        set((state) => ({
          assetsMTTR: [...state.assetsMTTR, mttr],
        })),
      setMTTR: (mttrs) => set(() => ({ assetsMTTR: mttrs })),
      addMDT: (mdt) =>
        set((state) => ({
          assetsMDT: [...state.assetsMDT, mdt],
        })),
      setMDT: (mdts) => set(() => ({ assetsMDT: mdts })),
      addReliability: (reliability) =>
        set((state) => ({
          assetsReliability: [...state.assetsReliability, reliability],
        })),
      setReliability: (reliabilities) =>
        set(() => ({ assetsReliability: reliabilities })),
    }),
    {
      name: "equipment-storage", // name of the storage item
    }
  )
);
