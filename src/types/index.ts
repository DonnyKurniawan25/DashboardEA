// ===== Account Types =====
export interface TradingAccount {
  id: string;
  broker: string;
  accountNumber: string;
  type: "demo" | "real";
  currency: string;
  balance: number;
  equity: number;
  floatingPnL: number;
  freeMargin: number;
  marginLevel: number;
  leverage: string;
  server: string;
  connectionStatus: "connected" | "disconnected" | "connecting";
  lastSync: string;
}

// ===== Position Types =====
export interface OpenPosition {
  ticket: string;
  symbol: string;
  type: "BUY" | "SELL";
  lots: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  floatingPnL: number;
  floatingPips: number;
  duration: number; // seconds
  strategy: string;
  openTime: string;
  commission: number;
  swap: number;
}

// ===== Order Types =====
export interface TradeOrder {
  ticket: string;
  symbol: string;
  type: "BUY" | "SELL" | "BUY_LIMIT" | "SELL_LIMIT" | "BUY_STOP" | "SELL_STOP";
  lots: number;
  entryPrice: number;
  closePrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  profit: number;
  commission: number;
  swap: number;
  openTime: string;
  closeTime: string | null;
  status: "open" | "closed" | "cancelled" | "pending";
  strategy: string;
  duration: number;
}

// ===== AI Types =====
export interface AISignal {
  id: string;
  symbol: string;
  direction: "BUY" | "SELL" | "HOLD";
  confidence: number;
  trend: "BULLISH" | "BEARISH" | "NEUTRAL" | "RANGING";
  timeframe: string;
  reason: string;
  timestamp: string;
  status: "active" | "executed" | "rejected" | "expired";
}

export interface AIAnalysis {
  symbol: string;
  timeframe: string;
  trendH4: "BULLISH" | "BEARISH" | "NEUTRAL";
  trendH1: "BULLISH" | "BEARISH" | "NEUTRAL";
  trendM15: "BULLISH" | "BEARISH" | "NEUTRAL";
  marketRegime: "TRENDING" | "RANGING" | "VOLATILE" | "QUIET";
  volatility: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  rsi: number;
  ema: { fast: number; slow: number; signal: string };
  atr: number;
  support: number;
  resistance: number;
  confidence: number;
  recommendation: "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL";
}

export interface AIDecision {
  id: string;
  timestamp: string;
  symbol: string;
  action: "BUY" | "SELL" | "HOLD" | "SIGNAL_REJECTED" | "ENTRY_EXECUTED" | "ENTRY_SKIPPED";
  reason: string;
  confidence: number;
  riskManagerNote: string | null;
  executedTicket: string | null;
}

// ===== Bot Types =====
export interface BotStatus {
  id: string;
  name: string;
  version: string;
  symbol: string;
  strategy: string;
  activeMode: "AGGRESSIVE" | "MODERATE" | "CONSERVATIVE" | "SAFE_MODE";
  status: "RUNNING" | "PAUSED" | "SAFE_MODE" | "DISCONNECTED" | "ERROR";
  currentGridLevel: number;
  basketPnL: number;
  totalOpenPositions: number;
  aiConnection: "connected" | "disconnected";
  telegramStatus: "connected" | "disconnected";
  lastHeartbeat: string;
  uptime: number; // seconds
  lastTrade: string;
  errorLogs: BotErrorLog[];
}

export interface BotErrorLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  message: string;
}

// ===== Risk Types =====
export interface RiskMetrics {
  currentDrawdown: number;
  maxDrawdown: number;
  dailyDrawdown: number;
  maxDailyLoss: number;
  maxDailyLossLimit: number;
  maxOpenPositions: number;
  currentOpenPositions: number;
  marginLevel: number;
  marginLevelAlert: number;
  maxRiskPerTrade: number;
  currentRiskPerTrade: number;
  riskStatus: "SAFE" | "WARNING" | "DANGER" | "CRITICAL";
  equityShield: boolean;
  consecutiveLosses: number;
  maxConsecutiveLosses: number;
  exposureBySymbol: { symbol: string; exposure: number; percentage: number }[];
  exposureByDirection: { direction: string; exposure: number; percentage: number }[];
}

export interface RiskEvent {
  id: string;
  timestamp: string;
  type: "DRAWDOWN_ALERT" | "MARGIN_ALERT" | "MAX_LOSS" | "EQUITY_SHIELD" | "CONSECUTIVE_LOSS" | "EXPOSURE_ALERT";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  resolved: boolean;
}

// ===== Analytics Types =====
export interface AnalyticsData {
  netProfit: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  riskReward: number;
  maxDrawdown: number;
  totalTrades: number;
  winCount: number;
  lossCount: number;
  equityCurve: { date: string; equity: number; balance: number }[];
  dailyPnL: { date: string; pnl: number }[];
  weeklyPnL: { week: string; pnl: number }[];
  monthlyPnL: { month: string; pnl: number }[];
  profitBySymbol: { symbol: string; profit: number; trades: number }[];
  profitByStrategy: { strategy: string; profit: number; trades: number; winRate: number }[];
  sessionPerformance: { session: string; profit: number; trades: number; winRate: number }[];
  drawdownHistory: { date: string; drawdown: number }[];
}

// ===== Notification Types =====
export interface Notification {
  id: string;
  type: "TRADE_OPENED" | "TRADE_CLOSED" | "TAKE_PROFIT" | "STOP_LOSS" | "AI_SIGNAL" | "HIGH_DRAWDOWN" | "MARGIN_ALERT" | "EA_DISCONNECTED" | "API_TIMEOUT" | "DAILY_RECAP";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "success" | "warning" | "error";
  data?: Record<string, unknown>;
}

// ===== Market Types =====
export interface MarketData {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  lastUpdate: string;
}

// ===== Chart Data =====
export interface EquityChartData {
  date: string;
  balance: number;
  equity: number;
  drawdown: number;
}

// ===== Integration Types =====
export interface Integration {
  id: string;
  name: string;
  type: "MT5_BRIDGE" | "TELEGRAM" | "WEBHOOK" | "API";
  status: "connected" | "disconnected" | "error";
  lastSync: string;
  config: Record<string, unknown>;
}

// ===== User & Auth Types =====
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trader" | "viewer";
  avatar?: string;
}

export interface ExnessConnectPayload {
  accountNumber: string;
  password?: string;
  server: string;
  type: "demo" | "real";
  currency: string;
  leverage: string;
}

// ===== App State =====
export interface AppState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  selectedAccount: string | null;
  accounts: TradingAccount[];
  positions: OpenPosition[];
  orders: TradeOrder[];
  bots: BotStatus[];
  signals: AISignal[];
  decisions: AIDecision[];
  riskMetrics: RiskMetrics;
  riskEvents: RiskEvent[];
  notifications: Notification[];
  demoMode: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
}

