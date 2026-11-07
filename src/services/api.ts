/**
 * API Service Layer
 * 
 * This module provides a clean abstraction over data fetching.
 * In demo mode, it returns simulated data.
 * When connected to the FastAPI backend, it will fetch from real endpoints.
 * 
 * API Contract:
 * - GET  /api/accounts           → TradingAccount[]
 * - GET  /api/positions          → OpenPosition[]
 * - GET  /api/orders             → TradeOrder[]
 * - GET  /api/trades/history     → TradeOrder[]
 * - GET  /api/analytics          → AnalyticsData
 * - GET  /api/ai/signals         → AISignal[]
 * - GET  /api/ai/analysis/:sym   → AIAnalysis
 * - GET  /api/ai/decisions       → AIDecision[]
 * - GET  /api/bots/status        → BotStatus[]
 * - GET  /api/risk               → RiskMetrics
 * - GET  /api/risk/events        → RiskEvent[]
 * - GET  /api/notifications      → Notification[]
 * - GET  /api/market             → MarketData[]
 * - GET  /api/integrations       → Integration[]
 * - WS   /ws/positions           → Real-time position updates
 * - WS   /ws/market              → Real-time market data
 */

import * as demo from "./demo-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const IS_DEMO = true; // Will be controlled by env or app state

async function fetchApi<T>(endpoint: string, fallback: () => T): Promise<T> {
  if (IS_DEMO) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));
    return fallback();
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    // Fallback to demo data on error
    return fallback();
  }
}

export const api = {
  getAccounts: () => fetchApi("/api/accounts", demo.getDemoAccounts),
  getPositions: () => fetchApi("/api/positions", demo.getDemoPositions),
  getOrders: () => fetchApi("/api/orders", demo.getDemoTradeHistory),
  getTradeHistory: () => fetchApi("/api/trades/history", demo.getDemoTradeHistory),
  getAnalytics: () => fetchApi("/api/analytics", demo.getDemoAnalytics),
  getAISignals: () => fetchApi("/api/ai/signals", demo.getDemoAISignals),
  getAIAnalysis: (symbol: string) => fetchApi(`/api/ai/analysis/${symbol}`, () => demo.getDemoAIAnalysis(symbol)),
  getAIDecisions: () => fetchApi("/api/ai/decisions", demo.getDemoAIDecisions),
  getBotStatus: () => fetchApi("/api/bots/status", demo.getDemoBotStatus),
  getRiskMetrics: () => fetchApi("/api/risk", demo.getDemoRiskMetrics),
  getRiskEvents: () => fetchApi("/api/risk/events", demo.getDemoRiskEvents),
  getNotifications: () => fetchApi("/api/notifications", demo.getDemoNotifications),
  getMarketData: () => fetchApi("/api/market", demo.getDemoMarketData),
  getEquityChart: (period: string) => fetchApi(`/api/equity-chart?period=${period}`, () => demo.getDemoEquityChart(period)),
  getIntegrations: () => fetchApi("/api/integrations", demo.getDemoIntegrations),
  getActivities: () => fetchApi("/api/activities", demo.getDemoActivities),
};

