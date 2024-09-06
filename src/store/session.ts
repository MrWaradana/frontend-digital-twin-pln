import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the state and actions for the Zustand store
interface SessionState {
  session: Array<{
    id: string;
    user: object;
    accessToken: string;
    refreshToken: string;
    token_expires: number;
  }>;
  addSession: (session: SessionState["session"][0]) => void;
  setSession: (sessions: SessionState["session"]) => void;
}

// Create the Zustand store
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: [],
      addSession: (session) =>
        set((state) => ({
          session: [...state.session, session],
        })),
      setSession: (session) => set(() => ({ session })),
    }),
    {
      name: "session", // name of the storage item
    }
  )
);
