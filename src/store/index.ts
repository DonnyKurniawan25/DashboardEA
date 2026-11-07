import { create } from "zustand";
import type { AppState, TradingAccount, UserProfile } from "@/types";
import { getDemoAccounts } from "@/services/demo-data";

interface StoreState extends AppState {
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSelectedAccount: (accountId: string | null) => void;
  setDemoMode: (demo: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  addExnessAccount: (account: Partial<TradingAccount> & { accountNumber: string; type: "demo" | "real" }) => void;
  getActiveAccount: () => TradingAccount | undefined;
}

export const useAppStore = create<StoreState>((set, get) => ({
  user: {
    id: "usr-admin",
    name: "Alex Trader",
    email: "trader@goldshield.ai",
    role: "admin",
  },
  isAuthenticated: true,
  selectedAccount: "acc-1",
  accounts: getDemoAccounts(),
  demoMode: true,
  sidebarCollapsed: false,
  theme: "light", // DEFAULT IS LIGHT

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedAccount: (accountId) => set({ selectedAccount: accountId }),
  setDemoMode: (demo) => set({ demoMode: demo }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    set({ theme });
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === "light" ? "dark" : "light";
    if (typeof document !== "undefined") {
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    set({ theme: next });
  },

  login: (email, name = "Exness Trader") =>
    set({
      user: {
        id: `usr-${Date.now()}`,
        name,
        email,
        role: "trader",
      },
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  addExnessAccount: (newAcc) => {
    const isReal = newAcc.type === "real";
    const createdAccount: TradingAccount = {
      id: `exness-${newAcc.accountNumber}`,
      broker: "Exness",
      accountNumber: newAcc.accountNumber,
      type: newAcc.type,
      currency: newAcc.currency || "USD",
      balance: isReal ? (newAcc.balance ?? 12500.0) : (newAcc.balance ?? 50000.0),
      equity: isReal ? (newAcc.equity ?? 12785.4) : (newAcc.equity ?? 50820.0),
      floatingPnL: isReal ? 285.4 : 820.0,
      freeMargin: isReal ? 11200.0 : 48500.0,
      marginLevel: isReal ? 2100.0 : 1850.0,
      leverage: newAcc.leverage || "1:500",
      server: newAcc.server || (isReal ? "Exness-MT5Real" : "Exness-MT5Trial7"),
      connectionStatus: "connected",
      lastSync: new Date().toISOString(),
    };

    set((state) => {
      const exists = state.accounts.some((a) => a.accountNumber === newAcc.accountNumber);
      const updatedAccounts = exists
        ? state.accounts.map((a) => (a.accountNumber === newAcc.accountNumber ? createdAccount : a))
        : [createdAccount, ...state.accounts];

      return {
        accounts: updatedAccounts,
        selectedAccount: createdAccount.id,
        demoMode: !isReal,
      };
    });
  },

  getActiveAccount: () => {
    const state = get();
    return state.accounts.find((a) => a.id === state.selectedAccount) || state.accounts[0];
  },
}));
