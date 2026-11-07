import { create } from "zustand";
import type { AppState } from "@/types";

interface StoreState extends AppState {
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSelectedAccount: (accountId: string | null) => void;
  setDemoMode: (demo: boolean) => void;
}

export const useAppStore = create<StoreState>((set) => ({
  selectedAccount: "acc-1",
  demoMode: true,
  sidebarCollapsed: false,
  theme: "dark",
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedAccount: (accountId) => set({ selectedAccount: accountId }),
  setDemoMode: (demo) => set({ demoMode: demo }),
}));

