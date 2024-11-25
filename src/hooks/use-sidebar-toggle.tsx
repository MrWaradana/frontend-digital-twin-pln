import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface useSidebarToggleStore {
  isOpen: boolean;
  setIsOpen: () => void;
  toggleSidebar: () => void;
  resetSidebar: () => void;
}

export const useSidebarToggle = create(
  persist<useSidebarToggleStore>(
    (set, get) => ({
      isOpen: false,
      setIsOpen: () => {
        // Get current state
        const currentState = get().isOpen;

        // If currently true, remove from localStorage and set to false
        if (currentState) {
          localStorage.removeItem("sidebarOpen");
          set({ isOpen: false });
        } else {
          // If false, just set to false without removing
          set({ isOpen: false });
        }
      },
      // Added helper method to toggle state
      toggleSidebar: () => {
        set({ isOpen: !get().isOpen });
      },
      // Added helper method to reset state and clear storage
      resetSidebar: () => {
        localStorage.removeItem("sidebarOpen");
        set({ isOpen: false });
      },
    }),
    {
      name: "sidebarOpen",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
