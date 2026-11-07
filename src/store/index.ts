import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AppState,
  TradingAccount,
  UserProfile,
  OpenPosition,
  TradeOrder,
  BotStatus,
  AISignal,
  AIDecision,
  RiskMetrics,
  RiskEvent,
  Notification,
} from "@/types";
import {
  getDemoAccounts,
  getDemoPositions,
  getDemoTradeHistory,
  getDemoAISignals,
  getDemoAIDecisions,
  getDemoBotStatus,
  getDemoRiskMetrics,
  getDemoRiskEvents,
  getDemoNotifications,
} from "@/services/demo-data";

export interface StoreState extends AppState {
  // Navigation & General
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSelectedAccount: (accountId: string | null) => void;
  setDemoMode: (demo: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  getActiveAccount: () => TradingAccount | undefined;

  // 1. Trading Accounts CRUD
  addAccount: (account: Partial<TradingAccount> & { accountNumber: string }) => TradingAccount;
  updateAccount: (id: string, updates: Partial<TradingAccount>) => void;
  deleteAccount: (id: string) => void;
  addExnessAccount: (account: Partial<TradingAccount> & { accountNumber: string; type: "demo" | "real" }) => void;

  // 2. Open Positions CRUD
  addPosition: (pos: Partial<OpenPosition> & { symbol: string; type: "BUY" | "SELL"; lots: number; entryPrice: number }) => OpenPosition;
  updatePosition: (ticket: string, updates: Partial<OpenPosition>) => void;
  closePosition: (ticket: string, closePrice?: number) => void;
  deletePosition: (ticket: string) => void;

  // 3. Orders & History CRUD
  addOrder: (order: Partial<TradeOrder> & { symbol: string; type: TradeOrder["type"]; lots: number }) => TradeOrder;
  updateOrder: (ticket: string, updates: Partial<TradeOrder>) => void;
  deleteOrder: (ticket: string) => void;
  clearOrders: () => void;

  // 4. EA / Bot Monitor CRUD
  addBot: (bot: Partial<BotStatus> & { name: string; symbol: string }) => BotStatus;
  updateBot: (id: string, updates: Partial<BotStatus>) => void;
  deleteBot: (id: string) => void;
  toggleBotStatus: (id: string) => void;

  // 5. AI Signals & Decisions CRUD
  addSignal: (signal: Partial<AISignal> & { symbol: string; direction: AISignal["direction"] }) => AISignal;
  updateSignal: (id: string, updates: Partial<AISignal>) => void;
  deleteSignal: (id: string) => void;
  addDecision: (decision: Partial<AIDecision> & { symbol: string; action: AIDecision["action"] }) => AIDecision;
  updateDecision: (id: string, updates: Partial<AIDecision>) => void;
  deleteDecision: (id: string) => void;

  // 6. Risk Center CRUD
  updateRiskMetrics: (updates: Partial<RiskMetrics>) => void;
  addRiskEvent: (event: Partial<RiskEvent> & { message: string; severity: RiskEvent["severity"] }) => RiskEvent;
  toggleResolveRiskEvent: (id: string) => void;
  deleteRiskEvent: (id: string) => void;

  // 7. Notifications CRUD
  addNotification: (notif: Partial<Notification> & { title: string; message: string }) => Notification;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;

  // Reset all to demo defaults
  resetToDemoDefaults: () => void;
}

export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: {
        id: "usr-admin",
        name: "Alex Trader",
        email: "trader@goldshield.ai",
        role: "admin",
      },
      isAuthenticated: true,
      selectedAccount: "acc-1",
      accounts: getDemoAccounts(),
      positions: getDemoPositions(),
      orders: getDemoTradeHistory(),
      bots: getDemoBotStatus(),
      signals: getDemoAISignals(),
      decisions: getDemoAIDecisions(),
      riskMetrics: getDemoRiskMetrics(),
      riskEvents: getDemoRiskEvents(),
      notifications: getDemoNotifications(),
      demoMode: true,
      sidebarCollapsed: false,
      theme: "light",

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

      getActiveAccount: () => {
        const state = get();
        return state.accounts.find((a) => a.id === state.selectedAccount) || state.accounts[0];
      },

      // ─── 1. ACCOUNTS CRUD ─────────────────────────────
      addAccount: (newAcc) => {
        const id = newAcc.id || `acc-${Date.now()}`;
        const created: TradingAccount = {
          id,
          broker: newAcc.broker || "Exness",
          accountNumber: newAcc.accountNumber,
          type: newAcc.type || "demo",
          currency: newAcc.currency || "USD",
          balance: Number(newAcc.balance ?? 10000),
          equity: Number(newAcc.equity ?? newAcc.balance ?? 10000),
          floatingPnL: Number(newAcc.floatingPnL ?? 0),
          freeMargin: Number(newAcc.freeMargin ?? newAcc.balance ?? 10000),
          marginLevel: Number(newAcc.marginLevel ?? 1000),
          leverage: newAcc.leverage || "1:500",
          server: newAcc.server || "Exness-MT5Trial7",
          connectionStatus: newAcc.connectionStatus || "connected",
          lastSync: new Date().toISOString(),
        };

        set((state) => ({
          accounts: [created, ...state.accounts],
          selectedAccount: id,
        }));

        get().addNotification({
          type: "TRADE_OPENED",
          title: "Akun MT5 Terhubung",
          message: `Akun #${created.accountNumber} (${created.broker} ${created.type.toUpperCase()}) berhasil ditambahkan ke dashboard.`,
          severity: "success",
        });

        return created;
      },

      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map((acc) =>
            acc.id === id ? { ...acc, ...updates, lastSync: new Date().toISOString() } : acc
          ),
        }));
      },

      deleteAccount: (id) => {
        set((state) => {
          const remaining = state.accounts.filter((acc) => acc.id !== id);
          return {
            accounts: remaining,
            selectedAccount: state.selectedAccount === id ? remaining[0]?.id || null : state.selectedAccount,
          };
        });
      },

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

      // ─── 2. POSITIONS CRUD ────────────────────────────
      addPosition: (pos) => {
        const ticket = pos.ticket || String(Math.floor(10000000 + Math.random() * 90000000));
        const entryPrice = Number(pos.entryPrice);
        const currentPrice = Number(pos.currentPrice ?? entryPrice);
        const lots = Number(pos.lots);

        // Simple PnL calculation
        const isGold = pos.symbol.includes("XAU") || pos.symbol.includes("GOLD");
        const multiplier = isGold ? 100 : 100000;
        const diff = pos.type === "BUY" ? currentPrice - entryPrice : entryPrice - currentPrice;
        const floatingPnL = Number(pos.floatingPnL ?? diff * lots * multiplier);
        const floatingPips = Number(pos.floatingPips ?? (isGold ? diff * 10 : diff * 10000));

        const newPos: OpenPosition = {
          ticket,
          symbol: pos.symbol,
          type: pos.type,
          lots,
          entryPrice,
          currentPrice,
          stopLoss: pos.stopLoss ?? null,
          takeProfit: pos.takeProfit ?? null,
          floatingPnL,
          floatingPips,
          duration: pos.duration ?? 0,
          strategy: pos.strategy || "EA-Nevan Scalper",
          openTime: new Date().toISOString(),
          commission: Number(pos.commission ?? -(lots * 2)),
          swap: Number(pos.swap ?? 0),
        };

        set((state) => ({
          positions: [newPos, ...state.positions],
        }));

        get().addNotification({
          type: "TRADE_OPENED",
          title: `Posisi Baru #${ticket} Dibuka`,
          message: `${newPos.type} ${newPos.lots} Lot ${newPos.symbol} @ ${newPos.entryPrice} (${newPos.strategy})`,
          severity: "info",
        });

        return newPos;
      },

      updatePosition: (ticket, updates) => {
        set((state) => ({
          positions: state.positions.map((pos) =>
            pos.ticket === ticket ? { ...pos, ...updates } : pos
          ),
        }));
      },

      closePosition: (ticket, closePriceInput) => {
        const state = get();
        const target = state.positions.find((p) => p.ticket === ticket);
        if (!target) return;

        const closePrice = closePriceInput ?? target.currentPrice;
        const isGold = target.symbol.includes("XAU") || target.symbol.includes("GOLD");
        const multiplier = isGold ? 100 : 100000;
        const diff = target.type === "BUY" ? closePrice - target.entryPrice : target.entryPrice - closePrice;
        const realizedProfit = Math.round((diff * target.lots * multiplier + target.commission + target.swap) * 100) / 100;

        // 1. Create closed TradeOrder in orders history
        const closedOrder: TradeOrder = {
          ticket: target.ticket,
          symbol: target.symbol,
          type: target.type,
          lots: target.lots,
          entryPrice: target.entryPrice,
          closePrice,
          stopLoss: target.stopLoss,
          takeProfit: target.takeProfit,
          profit: realizedProfit,
          commission: target.commission,
          swap: target.swap,
          openTime: target.openTime,
          closeTime: new Date().toISOString(),
          status: "closed",
          strategy: target.strategy,
          duration: target.duration + 60,
        };

        // 2. Update active account balance & equity
        const activeAcc = state.getActiveAccount();
        const updatedAccounts = state.accounts.map((acc) => {
          if (acc.id === activeAcc?.id) {
            const newBal = acc.balance + realizedProfit;
            return {
              ...acc,
              balance: Math.round(newBal * 100) / 100,
              equity: Math.round((newBal + acc.floatingPnL - target.floatingPnL) * 100) / 100,
              floatingPnL: Math.round((acc.floatingPnL - target.floatingPnL) * 100) / 100,
            };
          }
          return acc;
        });

        set({
          positions: state.positions.filter((p) => p.ticket !== ticket),
          orders: [closedOrder, ...state.orders],
          accounts: updatedAccounts,
        });

        get().addNotification({
          type: realizedProfit >= 0 ? "TAKE_PROFIT" : "STOP_LOSS",
          title: `Order #${ticket} Telah Ditutup`,
          message: `${target.symbol} ${target.type} ${target.lots} Lot ditutup @ ${closePrice}. Realized P/L: ${realizedProfit >= 0 ? "+" : ""}$${realizedProfit.toFixed(2)}`,
          severity: realizedProfit >= 0 ? "success" : "warning",
        });
      },

      deletePosition: (ticket) => {
        set((state) => ({
          positions: state.positions.filter((p) => p.ticket !== ticket),
        }));
      },

      // ─── 3. ORDERS HISTORY CRUD ───────────────────────
      addOrder: (order) => {
        const ticket = order.ticket || String(Math.floor(10000000 + Math.random() * 90000000));
        const newOrder: TradeOrder = {
          ticket,
          symbol: order.symbol,
          type: order.type,
          lots: Number(order.lots),
          entryPrice: Number(order.entryPrice ?? 0),
          closePrice: order.closePrice !== undefined ? Number(order.closePrice) : null,
          stopLoss: order.stopLoss !== undefined ? Number(order.stopLoss) : null,
          takeProfit: order.takeProfit !== undefined ? Number(order.takeProfit) : null,
          profit: Number(order.profit ?? 0),
          commission: Number(order.commission ?? -(order.lots * 2)),
          swap: Number(order.swap ?? 0),
          openTime: order.openTime || new Date(Date.now() - 3600000).toISOString(),
          closeTime: order.closeTime || new Date().toISOString(),
          status: order.status || "closed",
          strategy: order.strategy || "Manual Entry",
          duration: order.duration ?? 3600,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrder: (ticket, updates) => {
        set((state) => ({
          orders: state.orders.map((ord) =>
            ord.ticket === ticket ? { ...ord, ...updates } : ord
          ),
        }));
      },

      deleteOrder: (ticket) => {
        set((state) => ({
          orders: state.orders.filter((ord) => ord.ticket !== ticket),
        }));
      },

      clearOrders: () => {
        set({ orders: [] });
      },

      // ─── 4. BOTS CRUD ─────────────────────────────────
      addBot: (bot) => {
        const id = bot.id || `bot-${Date.now()}`;
        const newBot: BotStatus = {
          id,
          name: bot.name,
          version: bot.version || "1.0",
          symbol: bot.symbol,
          strategy: bot.strategy || "Scalping Grid",
          activeMode: bot.activeMode || "MODERATE",
          status: bot.status || "RUNNING",
          currentGridLevel: bot.currentGridLevel ?? 1,
          basketPnL: Number(bot.basketPnL ?? 0),
          totalOpenPositions: bot.totalOpenPositions ?? 0,
          aiConnection: bot.aiConnection || "connected",
          telegramStatus: bot.telegramStatus || "connected",
          lastHeartbeat: new Date().toISOString(),
          uptime: bot.uptime ?? 0,
          lastTrade: new Date().toISOString(),
          errorLogs: bot.errorLogs || [],
        };

        set((state) => ({
          bots: [newBot, ...state.bots],
        }));

        get().addNotification({
          type: "TRADE_OPENED",
          title: "Robot Baru Terdaftar",
          message: `${newBot.name} (${newBot.symbol}) siap beroperasi dalam mode ${newBot.activeMode}.`,
          severity: "info",
        });

        return newBot;
      },

      updateBot: (id, updates) => {
        set((state) => ({
          bots: state.bots.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
      },

      deleteBot: (id) => {
        set((state) => ({
          bots: state.bots.filter((b) => b.id !== id),
        }));
      },

      toggleBotStatus: (id) => {
        set((state) => ({
          bots: state.bots.map((b) => {
            if (b.id === id) {
              const nextStatus = b.status === "RUNNING" ? "PAUSED" : "RUNNING";
              return { ...b, status: nextStatus };
            }
            return b;
          }),
        }));
      },

      // ─── 5. AI SIGNALS & DECISIONS CRUD ───────────────
      addSignal: (signal) => {
        const id = signal.id || `sig-${Date.now()}`;
        const newSig: AISignal = {
          id,
          symbol: signal.symbol,
          direction: signal.direction,
          confidence: Number(signal.confidence ?? 85),
          trend: signal.trend || "BULLISH",
          timeframe: signal.timeframe || "M15",
          reason: signal.reason || "EMA20/50 breakout confluence",
          timestamp: new Date().toISOString(),
          status: signal.status || "active",
        };

        set((state) => ({
          signals: [newSig, ...state.signals],
        }));

        get().addNotification({
          type: "AI_SIGNAL",
          title: `Sinyal AI Baru: ${newSig.direction} ${newSig.symbol}`,
          message: `${newSig.reason} (Confidence ${newSig.confidence}%, TF ${newSig.timeframe})`,
          severity: "info",
        });

        return newSig;
      },

      updateSignal: (id, updates) => {
        set((state) => ({
          signals: state.signals.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteSignal: (id) => {
        set((state) => ({
          signals: state.signals.filter((s) => s.id !== id),
        }));
      },

      addDecision: (dec) => {
        const id = dec.id || `dec-${Date.now()}`;
        const newDec: AIDecision = {
          id,
          timestamp: new Date().toISOString(),
          symbol: dec.symbol,
          action: dec.action,
          reason: dec.reason || "Manual AI Rule Execution",
          confidence: Number(dec.confidence ?? 80),
          riskManagerNote: dec.riskManagerNote ?? null,
          executedTicket: dec.executedTicket ?? null,
        };

        set((state) => ({
          decisions: [newDec, ...state.decisions],
        }));

        return newDec;
      },

      updateDecision: (id, updates) => {
        set((state) => ({
          decisions: state.decisions.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
      },

      deleteDecision: (id) => {
        set((state) => ({
          decisions: state.decisions.filter((d) => d.id !== id),
        }));
      },

      // ─── 6. RISK CENTER CRUD ──────────────────────────
      updateRiskMetrics: (updates) => {
        set((state) => ({
          riskMetrics: { ...state.riskMetrics, ...updates },
        }));
      },

      addRiskEvent: (ev) => {
        const id = ev.id || `re-${Date.now()}`;
        const newEv: RiskEvent = {
          id,
          timestamp: new Date().toISOString(),
          type: ev.type || "DRAWDOWN_ALERT",
          severity: ev.severity || "HIGH",
          message: ev.message,
          resolved: ev.resolved ?? false,
        };

        set((state) => ({
          riskEvents: [newEv, ...state.riskEvents],
        }));

        get().addNotification({
          type: "HIGH_DRAWDOWN",
          title: `Peringatan Risiko [${newEv.severity}]`,
          message: newEv.message,
          severity: "warning",
        });

        return newEv;
      },

      toggleResolveRiskEvent: (id) => {
        set((state) => ({
          riskEvents: state.riskEvents.map((ev) =>
            ev.id === id ? { ...ev, resolved: !ev.resolved } : ev
          ),
        }));
      },

      deleteRiskEvent: (id) => {
        set((state) => ({
          riskEvents: state.riskEvents.filter((ev) => ev.id !== id),
        }));
      },

      // ─── 7. NOTIFICATIONS CRUD ────────────────────────
      addNotification: (notif) => {
        const id = notif.id || `notif-${Date.now()}`;
        const newNotif: Notification = {
          id,
          type: notif.type || "TRADE_OPENED",
          title: notif.title,
          message: notif.message,
          timestamp: new Date().toISOString(),
          read: notif.read ?? false,
          severity: notif.severity || "info",
          data: notif.data,
        };

        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));

        return newNotif;
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      resetToDemoDefaults: () => {
        set({
          accounts: getDemoAccounts(),
          positions: getDemoPositions(),
          orders: getDemoTradeHistory(),
          bots: getDemoBotStatus(),
          signals: getDemoAISignals(),
          decisions: getDemoAIDecisions(),
          riskMetrics: getDemoRiskMetrics(),
          riskEvents: getDemoRiskEvents(),
          notifications: getDemoNotifications(),
        });
      },
    }),
    {
      name: "goldshield_ai_store",
      storage: createJSONStorage(() => localStorage),
      // Partialize state to avoid storing non-serializable fields if any
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedAccount: state.selectedAccount,
        accounts: state.accounts,
        positions: state.positions,
        orders: state.orders,
        bots: state.bots,
        signals: state.signals,
        decisions: state.decisions,
        riskMetrics: state.riskMetrics,
        riskEvents: state.riskEvents,
        notifications: state.notifications,
        demoMode: state.demoMode,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
