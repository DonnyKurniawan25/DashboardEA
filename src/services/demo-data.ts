import type {
  TradingAccount,
  OpenPosition,
  TradeOrder,
  AISignal,
  AIAnalysis,
  AIDecision,
  BotStatus,
  BotErrorLog,
  RiskMetrics,
  RiskEvent,
  AnalyticsData,
  Notification,
  MarketData,
  EquityChartData,
  Integration,
} from "@/types";

// ===== TRADING ACCOUNTS =====
export function getDemoAccounts(): TradingAccount[] {
  return [
    {
      id: "acc-1",
      broker: "Exness",
      accountNumber: "71024589",
      type: "demo",
      currency: "USD",
      balance: 52481.37,
      equity: 53126.84,
      floatingPnL: 645.47,
      freeMargin: 48923.17,
      marginLevel: 1285.42,
      leverage: "1:500",
      server: "Exness-MT5Trial7",
      connectionStatus: "connected",
      lastSync: new Date().toISOString(),
    },
    {
      id: "acc-2",
      broker: "Finex",
      accountNumber: "30981276",
      type: "demo",
      currency: "USD",
      balance: 15230.0,
      equity: 14891.5,
      floatingPnL: -338.5,
      freeMargin: 13200.0,
      marginLevel: 892.3,
      leverage: "1:200",
      server: "Finex-MT5Demo",
      connectionStatus: "connected",
      lastSync: new Date().toISOString(),
    },
    {
      id: "acc-3",
      broker: "ICMarkets",
      accountNumber: "50234871",
      type: "demo",
      currency: "EUR",
      balance: 8750.2,
      equity: 8920.0,
      floatingPnL: 169.8,
      freeMargin: 7800.0,
      marginLevel: 1520.0,
      leverage: "1:500",
      server: "ICMarkets-MT5-Demo",
      connectionStatus: "disconnected",
      lastSync: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
}

// ===== OPEN POSITIONS =====
export function getDemoPositions(): OpenPosition[] {
  return [
    {
      ticket: "90127834",
      symbol: "XAUUSD",
      type: "BUY",
      lots: 0.5,
      entryPrice: 2341.5,
      currentPrice: 2348.75,
      stopLoss: 2325.0,
      takeProfit: 2370.0,
      floatingPnL: 362.5,
      floatingPips: 72.5,
      duration: 14400,
      strategy: "GoldShield Trend v3",
      openTime: new Date(Date.now() - 14400000).toISOString(),
      commission: -3.5,
      swap: -1.2,
    },
    {
      ticket: "90127891",
      symbol: "EURUSD",
      type: "SELL",
      lots: 1.0,
      entryPrice: 1.0892,
      currentPrice: 1.0874,
      stopLoss: 1.0925,
      takeProfit: 1.0835,
      floatingPnL: 180.0,
      floatingPips: 18.0,
      duration: 7200,
      strategy: "AI Scalper",
      openTime: new Date(Date.now() - 7200000).toISOString(),
      commission: -7.0,
      swap: 0.5,
    },
    {
      ticket: "90127945",
      symbol: "GBPUSD",
      type: "BUY",
      lots: 0.3,
      entryPrice: 1.2715,
      currentPrice: 1.2698,
      stopLoss: 1.268,
      takeProfit: 1.278,
      floatingPnL: -51.0,
      floatingPips: -17.0,
      duration: 3600,
      strategy: "GoldShield Grid",
      openTime: new Date(Date.now() - 3600000).toISOString(),
      commission: -2.1,
      swap: 0.0,
    },
    {
      ticket: "90128001",
      symbol: "USDJPY",
      type: "BUY",
      lots: 0.8,
      entryPrice: 149.25,
      currentPrice: 149.58,
      stopLoss: 148.8,
      takeProfit: 150.2,
      floatingPnL: 176.5,
      floatingPips: 33.0,
      duration: 10800,
      strategy: "AI Trend Follower",
      openTime: new Date(Date.now() - 10800000).toISOString(),
      commission: -5.6,
      swap: 2.1,
    },
    {
      ticket: "90128056",
      symbol: "XAUUSD",
      type: "SELL",
      lots: 0.2,
      entryPrice: 2355.0,
      currentPrice: 2348.75,
      stopLoss: 2375.0,
      takeProfit: 2320.0,
      floatingPnL: 125.0,
      floatingPips: 62.5,
      duration: 1800,
      strategy: "GoldShield Scalper",
      openTime: new Date(Date.now() - 1800000).toISOString(),
      commission: -1.4,
      swap: 0.0,
    },
    {
      ticket: "90128112",
      symbol: "AUDUSD",
      type: "SELL",
      lots: 0.5,
      entryPrice: 0.6548,
      currentPrice: 0.6562,
      stopLoss: 0.6585,
      takeProfit: 0.6495,
      floatingPnL: -70.0,
      floatingPips: -14.0,
      duration: 5400,
      strategy: "AI Reversal",
      openTime: new Date(Date.now() - 5400000).toISOString(),
      commission: -3.5,
      swap: -0.8,
    },
  ];
}

// ===== TRADE HISTORY =====
export function getDemoTradeHistory(): TradeOrder[] {
  const trades: TradeOrder[] = [];
  const symbols = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "NZDUSD"];
  const strategies = ["GoldShield Trend v3", "AI Scalper", "GoldShield Grid", "AI Trend Follower", "GoldShield Scalper"];

  for (let i = 0; i < 50; i++) {
    const isWin = Math.random() > 0.38;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = Math.random() > 0.5 ? "BUY" : "SELL";
    const lots = [0.1, 0.2, 0.3, 0.5, 0.8, 1.0][Math.floor(Math.random() * 6)];
    const profit = isWin
      ? Math.round((Math.random() * 500 + 50) * 100) / 100
      : -Math.round((Math.random() * 300 + 20) * 100) / 100;

    trades.push({
      ticket: `${90100000 + i}`,
      symbol,
      type: type as "BUY" | "SELL",
      lots,
      entryPrice: symbol === "XAUUSD" ? 2340 + Math.random() * 20 : 1.08 + Math.random() * 0.01,
      closePrice: symbol === "XAUUSD" ? 2340 + Math.random() * 20 : 1.08 + Math.random() * 0.01,
      stopLoss: null,
      takeProfit: null,
      profit,
      commission: -Math.round(lots * 7 * 100) / 100,
      swap: Math.round((Math.random() * 4 - 2) * 100) / 100,
      openTime: new Date(Date.now() - (i + 1) * 3600000 * 4).toISOString(),
      closeTime: new Date(Date.now() - i * 3600000 * 4 + 1800000).toISOString(),
      status: "closed",
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      duration: Math.floor(Math.random() * 14400) + 600,
    });
  }

  return trades;
}

// ===== AI SIGNALS =====
export function getDemoAISignals(): AISignal[] {
  return [
    {
      id: "sig-1",
      symbol: "XAUUSD",
      direction: "BUY",
      confidence: 87,
      trend: "BULLISH",
      timeframe: "H1",
      reason: "EMA crossover bullish + RSI above 55 + strong support at 2335. Volume increasing with momentum.",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: "active",
    },
    {
      id: "sig-2",
      symbol: "EURUSD",
      direction: "SELL",
      confidence: 72,
      trend: "BEARISH",
      timeframe: "H4",
      reason: "Descending triangle pattern. RSI divergence bearish. ECB dovish outlook maintaining downward pressure.",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      status: "executed",
    },
    {
      id: "sig-3",
      symbol: "GBPUSD",
      direction: "HOLD",
      confidence: 45,
      trend: "NEUTRAL",
      timeframe: "H1",
      reason: "Mixed signals. Market consolidating between 1.2680-1.2740. Wait for breakout confirmation.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: "active",
    },
    {
      id: "sig-4",
      symbol: "USDJPY",
      direction: "BUY",
      confidence: 81,
      trend: "BULLISH",
      timeframe: "H4",
      reason: "Strong uptrend continuation. BoJ policy divergence. Key resistance break at 149.50 with volume.",
      timestamp: new Date(Date.now() - 2700000).toISOString(),
      status: "executed",
    },
    {
      id: "sig-5",
      symbol: "AUDUSD",
      direction: "SELL",
      confidence: 58,
      trend: "BEARISH",
      timeframe: "M15",
      reason: "Short-term bearish momentum. Below EMA 50 on M15. Risk: Near support zone. Confidence below threshold.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "rejected",
    },
  ];
}

// ===== AI ANALYSIS =====
export function getDemoAIAnalysis(symbol: string = "XAUUSD"): AIAnalysis {
  const analyses: Record<string, AIAnalysis> = {
    XAUUSD: {
      symbol: "XAUUSD",
      timeframe: "H1",
      trendH4: "BULLISH",
      trendH1: "BULLISH",
      trendM15: "NEUTRAL",
      marketRegime: "TRENDING",
      volatility: "MEDIUM",
      rsi: 62.4,
      ema: { fast: 2346.2, slow: 2339.8, signal: "BULLISH" },
      atr: 15.3,
      support: 2335.0,
      resistance: 2365.0,
      confidence: 87,
      recommendation: "BUY",
    },
    EURUSD: {
      symbol: "EURUSD",
      timeframe: "H4",
      trendH4: "BEARISH",
      trendH1: "BEARISH",
      trendM15: "NEUTRAL",
      marketRegime: "TRENDING",
      volatility: "LOW",
      rsi: 38.2,
      ema: { fast: 1.0878, slow: 1.0895, signal: "BEARISH" },
      atr: 0.0045,
      support: 1.084,
      resistance: 1.092,
      confidence: 72,
      recommendation: "SELL",
    },
    GBPUSD: {
      symbol: "GBPUSD",
      timeframe: "H1",
      trendH4: "NEUTRAL",
      trendH1: "NEUTRAL",
      trendM15: "BULLISH",
      marketRegime: "RANGING",
      volatility: "LOW",
      rsi: 51.8,
      ema: { fast: 1.2708, slow: 1.2712, signal: "NEUTRAL" },
      atr: 0.0032,
      support: 1.268,
      resistance: 1.274,
      confidence: 45,
      recommendation: "HOLD",
    },
  };
  return analyses[symbol] || analyses["XAUUSD"];
}

// ===== AI DECISIONS =====
export function getDemoAIDecisions(): AIDecision[] {
  return [
    {
      id: "dec-1",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      symbol: "XAUUSD",
      action: "ENTRY_EXECUTED",
      reason: "BUY signal confirmed. EMA crossover + RSI momentum aligned. All filters passed.",
      confidence: 87,
      riskManagerNote: "Risk within limits. Position size: 0.5 lots. Max drawdown: 2.1% (below 5% limit).",
      executedTicket: "90127834",
    },
    {
      id: "dec-2",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      symbol: "EURUSD",
      action: "ENTRY_EXECUTED",
      reason: "SELL signal validated. Descending triangle breakout. Bearish RSI divergence confirmed on H4.",
      confidence: 72,
      riskManagerNote: "Risk approved. Existing exposure acceptable. Correlation check passed.",
      executedTicket: "90127891",
    },
    {
      id: "dec-3",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      symbol: "GBPUSD",
      action: "HOLD",
      reason: "Insufficient signal confidence (45%). Market in consolidation. Awaiting breakout direction.",
      confidence: 45,
      riskManagerNote: null,
      executedTicket: null,
    },
    {
      id: "dec-4",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      symbol: "AUDUSD",
      action: "SIGNAL_REJECTED",
      reason: "SELL signal generated but confidence below minimum threshold (58% < 65%).",
      confidence: 58,
      riskManagerNote: "Signal rejected by Risk Manager: confidence below 65% minimum. Additional concern: proximity to strong support level.",
      executedTicket: null,
    },
    {
      id: "dec-5",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      symbol: "USDJPY",
      action: "ENTRY_EXECUTED",
      reason: "BUY continuation signal. Strong trend with momentum. BoJ policy divergence supports direction.",
      confidence: 81,
      riskManagerNote: "Approved. JPY exposure within limits. Correlation with existing trades: LOW.",
      executedTicket: "90128001",
    },
    {
      id: "dec-6",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      symbol: "XAUUSD",
      action: "ENTRY_SKIPPED",
      reason: "BUY signal valid but max open positions for XAUUSD reached (2/2). Waiting for position closure.",
      confidence: 79,
      riskManagerNote: "Risk Manager blocked: Max positions per symbol reached. Rule: max 2 concurrent trades per instrument.",
      executedTicket: null,
    },
  ];
}

// ===== BOT STATUS =====
export function getDemoBotStatus(): BotStatus[] {
  return [
    {
      id: "bot-1",
      name: "GoldShield AI Master",
      version: "3.2.1",
      symbol: "XAUUSD",
      strategy: "Multi-Strategy (Trend + Grid + Scalp)",
      activeMode: "MODERATE",
      status: "RUNNING",
      currentGridLevel: 3,
      basketPnL: 487.5,
      totalOpenPositions: 4,
      aiConnection: "connected",
      telegramStatus: "connected",
      lastHeartbeat: new Date(Date.now() - 5000).toISOString(),
      uptime: 345600,
      lastTrade: new Date(Date.now() - 300000).toISOString(),
      errorLogs: [
        { id: "log-1", timestamp: new Date(Date.now() - 86400000).toISOString(), level: "WARNING", message: "High spread detected on XAUUSD (45 pips). Trade delayed." },
        { id: "log-2", timestamp: new Date(Date.now() - 172800000).toISOString(), level: "INFO", message: "Grid level 4 reached. Monitoring basket P/L for partial close." },
      ],
    },
    {
      id: "bot-2",
      name: "GoldShield FX Scalper",
      version: "2.8.0",
      symbol: "EURUSD",
      strategy: "AI Scalping",
      activeMode: "AGGRESSIVE",
      status: "RUNNING",
      currentGridLevel: 0,
      basketPnL: 180.0,
      totalOpenPositions: 1,
      aiConnection: "connected",
      telegramStatus: "connected",
      lastHeartbeat: new Date(Date.now() - 3000).toISOString(),
      uptime: 259200,
      lastTrade: new Date(Date.now() - 900000).toISOString(),
      errorLogs: [],
    },
    {
      id: "bot-3",
      name: "GoldShield JPY Runner",
      version: "2.8.0",
      symbol: "USDJPY",
      strategy: "Trend Following",
      activeMode: "CONSERVATIVE",
      status: "PAUSED",
      currentGridLevel: 0,
      basketPnL: 0,
      totalOpenPositions: 0,
      aiConnection: "connected",
      telegramStatus: "disconnected",
      lastHeartbeat: new Date(Date.now() - 60000).toISOString(),
      uptime: 172800,
      lastTrade: new Date(Date.now() - 7200000).toISOString(),
      errorLogs: [
        { id: "log-3", timestamp: new Date(Date.now() - 3600000).toISOString(), level: "WARNING", message: "Paused by user. Manual review requested." },
      ],
    },
  ];
}

// ===== RISK METRICS =====
export function getDemoRiskMetrics(): RiskMetrics {
  return {
    currentDrawdown: 2.1,
    maxDrawdown: 8.5,
    dailyDrawdown: 0.8,
    maxDailyLoss: 420.0,
    maxDailyLossLimit: 2500.0,
    maxOpenPositions: 10,
    currentOpenPositions: 6,
    marginLevel: 1285.42,
    marginLevelAlert: 200,
    maxRiskPerTrade: 2.0,
    currentRiskPerTrade: 1.2,
    riskStatus: "SAFE",
    equityShield: true,
    consecutiveLosses: 1,
    maxConsecutiveLosses: 5,
    exposureBySymbol: [
      { symbol: "XAUUSD", exposure: 16200, percentage: 38 },
      { symbol: "EURUSD", exposure: 10800, percentage: 25 },
      { symbol: "GBPUSD", exposure: 5400, percentage: 13 },
      { symbol: "USDJPY", exposure: 7200, percentage: 17 },
      { symbol: "AUDUSD", exposure: 3000, percentage: 7 },
    ],
    exposureByDirection: [
      { direction: "LONG", exposure: 28800, percentage: 67 },
      { direction: "SHORT", exposure: 14400, percentage: 33 },
    ],
  };
}

// ===== RISK EVENTS =====
export function getDemoRiskEvents(): RiskEvent[] {
  return [
    {
      id: "re-1",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: "DRAWDOWN_ALERT",
      severity: "MEDIUM",
      message: "Daily drawdown reached 2.1%. Warning threshold: 3%.",
      resolved: false,
    },
    {
      id: "re-2",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: "CONSECUTIVE_LOSS",
      severity: "LOW",
      message: "2 consecutive losses detected. Maximum allowed: 5.",
      resolved: true,
    },
    {
      id: "re-3",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      type: "MARGIN_ALERT",
      severity: "HIGH",
      message: "Margin level dropped to 450%. Alert threshold: 500%.",
      resolved: true,
    },
    {
      id: "re-4",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      type: "EQUITY_SHIELD",
      severity: "CRITICAL",
      message: "Equity Shield activated. Max drawdown (10%) approached. All new trades blocked.",
      resolved: true,
    },
  ];
}

// ===== ANALYTICS =====
export function getDemoAnalytics(): AnalyticsData {
  const equityCurve: AnalyticsData["equityCurve"] = [];
  const dailyPnL: AnalyticsData["dailyPnL"] = [];
  const drawdownHistory: AnalyticsData["drawdownHistory"] = [];
  let balance = 45000;
  let equity = 45000;

  for (let i = 90; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dateStr = date.toISOString().split("T")[0];
    const dailyChange = (Math.random() - 0.38) * 400;
    balance += dailyChange;
    equity = balance + (Math.random() - 0.5) * 500;

    equityCurve.push({
      date: dateStr,
      equity: Math.round(equity * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });

    dailyPnL.push({
      date: dateStr,
      pnl: Math.round(dailyChange * 100) / 100,
    });

    drawdownHistory.push({
      date: dateStr,
      drawdown: Math.round(Math.random() * 6 * 100) / 100,
    });
  }

  return {
    netProfit: 7481.37,
    winRate: 62.4,
    profitFactor: 1.85,
    averageWin: 245.8,
    averageLoss: -132.9,
    riskReward: 1.85,
    maxDrawdown: 8.5,
    totalTrades: 342,
    winCount: 213,
    lossCount: 129,
    equityCurve,
    dailyPnL,
    weeklyPnL: [
      { week: "W44", pnl: 1250.3 },
      { week: "W43", pnl: -380.2 },
      { week: "W42", pnl: 890.5 },
      { week: "W41", pnl: 560.1 },
      { week: "W40", pnl: -120.8 },
      { week: "W39", pnl: 720.4 },
      { week: "W38", pnl: 340.9 },
      { week: "W37", pnl: -210.6 },
    ],
    monthlyPnL: [
      { month: "Nov", pnl: 1870.3 },
      { month: "Oct", pnl: 2150.8 },
      { month: "Sep", pnl: -420.5 },
      { month: "Aug", pnl: 1680.2 },
      { month: "Jul", pnl: 890.4 },
      { month: "Jun", pnl: 1310.2 },
    ],
    profitBySymbol: [
      { symbol: "XAUUSD", profit: 3850.2, trades: 128 },
      { symbol: "EURUSD", profit: 1420.5, trades: 85 },
      { symbol: "USDJPY", profit: 1180.3, trades: 52 },
      { symbol: "GBPUSD", profit: 680.4, trades: 45 },
      { symbol: "AUDUSD", profit: 350.0, trades: 32 },
    ],
    profitByStrategy: [
      { strategy: "GoldShield Trend v3", profit: 3200.5, trades: 95, winRate: 68.4 },
      { strategy: "AI Scalper", profit: 1850.2, trades: 120, winRate: 58.3 },
      { strategy: "GoldShield Grid", profit: 1180.8, trades: 65, winRate: 72.3 },
      { strategy: "AI Trend Follower", profit: 890.4, trades: 42, winRate: 64.3 },
      { strategy: "GoldShield Scalper", profit: 360.0, trades: 20, winRate: 55.0 },
    ],
    sessionPerformance: [
      { session: "Asian", profit: 1250.3, trades: 85, winRate: 58.8 },
      { session: "London", profit: 3420.8, trades: 142, winRate: 65.5 },
      { session: "New York", profit: 2810.3, trades: 115, winRate: 61.7 },
    ],
    drawdownHistory,
  };
}

// ===== EQUITY CHART DATA =====
export function getDemoEquityChart(period: string = "3M"): EquityChartData[] {
  const data: EquityChartData[] = [];
  let days: number;

  switch (period) {
    case "1D": days = 1; break;
    case "7D": days = 7; break;
    case "1M": days = 30; break;
    case "3M": days = 90; break;
    case "6M": days = 180; break;
    case "YTD": days = 300; break;
    case "ALL": days = 365; break;
    default: days = 90;
  }

  let balance = 45000;
  let equity = 45000;

  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const change = (Math.random() - 0.38) * 300;
    balance += change;
    equity = balance + (Math.random() - 0.5) * 400;
    const peak = Math.max(balance, equity);
    const drawdown = ((peak - equity) / peak) * 100;

    data.push({
      date: date.toISOString().split("T")[0],
      balance: Math.round(balance * 100) / 100,
      equity: Math.round(equity * 100) / 100,
      drawdown: Math.round(drawdown * 100) / 100,
    });
  }

  return data;
}

// ===== NOTIFICATIONS =====
export function getDemoNotifications(): Notification[] {
  return [
    {
      id: "notif-1",
      type: "TRADE_OPENED",
      title: "Trade Opened",
      message: "BUY XAUUSD 0.5 lots at 2341.50 — Strategy: GoldShield Trend v3",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
      severity: "info",
    },
    {
      id: "notif-2",
      type: "AI_SIGNAL",
      title: "AI Signal — SELL EURUSD",
      message: "AI detected bearish opportunity on EURUSD H4. Confidence: 72%. Signal executed.",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      read: false,
      severity: "info",
    },
    {
      id: "notif-3",
      type: "TAKE_PROFIT",
      title: "Take Profit Hit!",
      message: "XAUUSD BUY 0.3 lots closed at TP. Profit: +$285.00",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      severity: "success",
    },
    {
      id: "notif-4",
      type: "HIGH_DRAWDOWN",
      title: "Drawdown Warning",
      message: "Daily drawdown reached 2.1%. Monitoring threshold: 3%.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
      severity: "warning",
    },
    {
      id: "notif-5",
      type: "STOP_LOSS",
      title: "Stop Loss Triggered",
      message: "GBPUSD SELL 0.2 lots closed at SL. Loss: -$86.00",
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      read: true,
      severity: "error",
    },
    {
      id: "notif-6",
      type: "EA_DISCONNECTED",
      title: "EA Alert",
      message: "GoldShield JPY Runner paused by user. Manual review requested.",
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      read: true,
      severity: "warning",
    },
    {
      id: "notif-7",
      type: "TRADE_CLOSED",
      title: "Trade Closed",
      message: "USDJPY BUY 1.0 lots closed manually. Profit: +$420.50",
      timestamp: new Date(Date.now() - 28800000).toISOString(),
      read: true,
      severity: "success",
    },
    {
      id: "notif-8",
      type: "DAILY_RECAP",
      title: "Daily Trading Recap",
      message: "Today: 8 trades, 5 wins, 3 losses. Net P/L: +$645.47. Win Rate: 62.5%.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      severity: "info",
    },
  ];
}

// ===== MARKET DATA =====
export function getDemoMarketData(): MarketData[] {
  return [
    { symbol: "XAUUSD", bid: 2348.50, ask: 2348.75, spread: 25, change: 12.30, changePercent: 0.53, high: 2358.40, low: 2332.10, volume: 185420, lastUpdate: new Date().toISOString() },
    { symbol: "EURUSD", bid: 1.0872, ask: 1.0874, spread: 2, change: -0.0018, changePercent: -0.17, high: 1.0895, low: 1.0858, volume: 245680, lastUpdate: new Date().toISOString() },
    { symbol: "GBPUSD", bid: 1.2696, ask: 1.2698, spread: 2, change: -0.0012, changePercent: -0.09, high: 1.2725, low: 1.2680, volume: 198340, lastUpdate: new Date().toISOString() },
    { symbol: "USDJPY", bid: 149.56, ask: 149.58, spread: 2, change: 0.35, changePercent: 0.23, high: 149.85, low: 149.12, volume: 210560, lastUpdate: new Date().toISOString() },
    { symbol: "AUDUSD", bid: 0.6560, ask: 0.6562, spread: 2, change: -0.0008, changePercent: -0.12, high: 0.6575, low: 0.6542, volume: 145230, lastUpdate: new Date().toISOString() },
    { symbol: "NZDUSD", bid: 0.5985, ask: 0.5987, spread: 2, change: 0.0005, changePercent: 0.08, high: 0.5998, low: 0.5972, volume: 95680, lastUpdate: new Date().toISOString() },
    { symbol: "USDCAD", bid: 1.3642, ask: 1.3644, spread: 2, change: 0.0022, changePercent: 0.16, high: 1.3668, low: 1.3618, volume: 135420, lastUpdate: new Date().toISOString() },
    { symbol: "USDCHF", bid: 0.8825, ask: 0.8827, spread: 2, change: -0.0005, changePercent: -0.06, high: 0.8845, low: 0.8810, volume: 112340, lastUpdate: new Date().toISOString() },
  ];
}

// ===== INTEGRATIONS =====
export function getDemoIntegrations(): Integration[] {
  return [
    {
      id: "int-1",
      name: "MetaTrader 5 Bridge",
      type: "MT5_BRIDGE",
      status: "disconnected",
      lastSync: new Date(Date.now() - 3600000).toISOString(),
      config: { host: "localhost", port: 8710 },
    },
    {
      id: "int-2",
      name: "Telegram Bot",
      type: "TELEGRAM",
      status: "disconnected",
      lastSync: new Date(Date.now() - 7200000).toISOString(),
      config: { botName: "@GoldShieldAIBot" },
    },
    {
      id: "int-3",
      name: "FastAPI Backend",
      type: "API",
      status: "disconnected",
      lastSync: new Date(Date.now() - 1800000).toISOString(),
      config: { url: "http://localhost:8000" },
    },
    {
      id: "int-4",
      name: "Webhook Alerts",
      type: "WEBHOOK",
      status: "disconnected",
      lastSync: new Date(Date.now() - 14400000).toISOString(),
      config: { url: "https://hooks.example.com/goldshield" },
    },
  ];
}

// ===== RECENT ACTIVITIES =====
export interface Activity {
  id: string;
  type: "trade" | "ai" | "bot" | "risk" | "system";
  message: string;
  timestamp: string;
  icon: string;
}

export function getDemoActivities(): Activity[] {
  return [
    { id: "act-1", type: "trade", message: "BUY XAUUSD 0.5 lots opened at 2341.50", timestamp: new Date(Date.now() - 300000).toISOString(), icon: "TrendingUp" },
    { id: "act-2", type: "ai", message: "AI Signal: SELL EURUSD — Confidence 72%", timestamp: new Date(Date.now() - 600000).toISOString(), icon: "Brain" },
    { id: "act-3", type: "trade", message: "SELL EURUSD 1.0 lots opened at 1.0892", timestamp: new Date(Date.now() - 900000).toISOString(), icon: "TrendingDown" },
    { id: "act-4", type: "bot", message: "GoldShield AI Master heartbeat OK", timestamp: new Date(Date.now() - 1200000).toISOString(), icon: "Bot" },
    { id: "act-5", type: "risk", message: "Drawdown monitor: 2.1% (within safe range)", timestamp: new Date(Date.now() - 1500000).toISOString(), icon: "Shield" },
    { id: "act-6", type: "trade", message: "XAUUSD TP hit +$285.00", timestamp: new Date(Date.now() - 3600000).toISOString(), icon: "Target" },
    { id: "act-7", type: "ai", message: "AI HOLD signal for GBPUSD — Market consolidating", timestamp: new Date(Date.now() - 5400000).toISOString(), icon: "Brain" },
    { id: "act-8", type: "system", message: "Demo mode active — All data is simulated", timestamp: new Date(Date.now() - 7200000).toISOString(), icon: "Info" },
  ];
}

