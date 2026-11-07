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
  theme: "dark",

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedAccount: (accountId) => set({ selectedAccount: accountId }),
  setDemoMode: (demo) => set({ demoMode: demo }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),

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
      balance: isReal ? (newAcc.balance ?? 10000.0) : (newAcc.balance ?? 50000.0),
      equity: isReal ? (newAcc.equity ?? 10240.5) : (newAcc.equity ?? 50820.0),
      floatingPnL: isReal ? 240.5 : 820.0,
      freeMargin: isReal ? 9800.0 : 48500.0,
      marginLevel: isReal ? 2300.0 : 1850.0,
      leverage: newAcc.leverage || "1:500",
      server: newAcc.server || (isReal ? "Exness-MT5Real" : "Exness-MT5Trial"),
      connectionStatus: "connected",
      lastSync: new Date().toISOString(),
    };

    set((state) => {
      // Avoid duplicate
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
