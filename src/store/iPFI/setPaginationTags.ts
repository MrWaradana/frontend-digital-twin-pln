import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedPaginationTagsState {
  selectedPaginationTagState: number | any;
  limitPaginationTagState: number | any;
  setSelectedPaginationTagState: (data: {
    page: string | number;
  }) => void;
  setLimitPaginationTagState: (data: {
    limit: string | number;
  }) => void;
}

export const useSelectedPaginationTagsStore = create<SelectedPaginationTagsState>()(
  persist(
    (set) => ({
      selectedPaginationTagState: 1,
      limitPaginationTagState: 20,
      setSelectedPaginationTagState: (data) =>
        set({ selectedPaginationTagState: data }),
      setLimitPaginationTagState: (data) =>
        set({ selectedPaginationTagState: data }),
    }),
    {
      name: "pagination-tags",
      getStorage: () => localStorage,
    }
  )
);

