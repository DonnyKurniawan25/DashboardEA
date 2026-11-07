"use client";

import React, { useState, useEffect } from "react";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  PageHeader,
  Skeleton,
} from "@/components/ui";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatPnL,
  getPnLColor,
  cn,
} from "@/lib/utils";
import { api } from "@/services/api";
import type { AnalyticsData } from "@/types";
import {
  TrendingUp,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Target,
  Percent,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  PieChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

export default function TradingAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState("ALL");
  const [selectedSymbol, setSelectedSymbol] = useState("ALL");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const exportAnalyticsCSV = () => {
    if (!analytics) return;
    const headers = ["Date", "Equity", "Balance"];
    const rows = analytics.equityCurve.map((e) => [e.date, e.equity, e.balance]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `equity_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <PageHeader title="Trading Analytics" subtitle="Quantitative Statistics" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <NeoCard key={i} className="p-4 bg-[#0D2247]">
              <Skeleton className="h-16 w-full" />
            </NeoCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trading Analytics"
        subtitle="In-Depth Performance Attribution, Session Alpha & Quantitative Metrics"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={exportAnalyticsCSV}
          className="flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export Report
        </NeoButton>
        <NeoButton
          variant="primary"
          size="sm"
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Recompute
        </NeoButton>
      </PageHeader>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <NeoCard className="p-3 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase">
            Net Profit
          </p>
          <p className="text-lg font-heading font-bold text-[#74FF44]">
            +{formatCurrency(analytics.netProfit)}
          </p>
        </NeoCard>

        <NeoCard className="p-3 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase">
            Win Rate
          </p>
          <p className="text-lg font-heading font-bold text-[#74FF44]">
            {analytics.winRate}%
          </p>
        </NeoCard>

        <NeoCard className="p-3 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase">
            Profit Factor
          </p>
          <p className="text-lg font-heading font-bold text-white">
            {analytics.profitFactor}
          </p>
        </NeoCard>

        <NeoCard className="p-3 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase">
            Avg Win
          </p>
          <p className="text-lg font-heading font-bold text-[#74FF44]">
            +${analytics.averageWin}
          </p>
        </NeoCard>

        <NeoCard className="p-3 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase">
            Avg Loss
          </p>
          <p className="text-lg font-heading font-bold text-[#FF4B57]">
            ${analytics.averageLoss}
          </p>
        </NeoCard>

        <NeoCard className="p-3 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase">
            Risk / Reward
          </p>
          <p className="text-lg font-heading font-bold text-[#00E5FF]">
            1:{analytics.riskReward}
          </p>
        </NeoCard>

        <NeoCard className="p-3 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase">
            Max DD
          </p>
          <p className="text-lg font-heading font-bold text-[#FF4B57]">
            {analytics.maxDrawdown}%
          </p>
        </NeoCard>

        <NeoCard className="p-3 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase">
            Total Trades
          </p>
          <p className="text-lg font-heading font-bold text-white">
            {analytics.totalTrades}
          </p>
        </NeoCard>
      </div>

      {/* Equity & Balance Curve (Full Width) */}
      <NeoCard className="p-5 bg-[#0D2247]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              Cumulative Equity Curve vs Account Balance (90 Days)
            </h3>
            <p className="text-xs text-gray-400">
              High-water mark tracking and equity floating trajectory
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#00E5FF] rounded-sm" /> Equity
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#1746FF] rounded-sm" /> Balance
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.equityCurve} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="eqAnaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#132D5E" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} domain={["dataMin - 1000", "dataMax + 1000"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#07152F",
                  borderColor: "#050505",
                  borderWidth: 2,
                  boxShadow: "4px 4px 0px #050505",
                  borderRadius: 4,
                }}
              />
              <Area type="monotone" dataKey="equity" stroke="#00E5FF" strokeWidth={2} fill="url(#eqAnaGrad)" name="Equity" />
              <Area type="monotone" dataKey="balance" stroke="#1746FF" strokeWidth={2} fill="none" name="Balance" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </NeoCard>

      {/* Grid of Analytical Breakdowns (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly & Monthly P/L */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <h3 className="font-heading font-bold text-white text-base mb-1">
            Weekly Net Performance ($)
          </h3>
          <p className="text-xs text-gray-400 mb-4">Past 8 trading weeks</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyPnL} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#132D5E" />
                <XAxis dataKey="week" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#07152F",
                    borderColor: "#050505",
                    borderWidth: 2,
                    boxShadow: "4px 4px 0px #050505",
                  }}
                  formatter={(v: unknown) => [formatCurrency(Number(v)), "P/L"]}
                />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {analytics.weeklyPnL.map((entry, index) => (
                    <Cell
                      key={`w-cell-${index}`}
                      fill={entry.pnl >= 0 ? "#74FF44" : "#FF4B57"}
                      stroke="#050505"
                      strokeWidth={1.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeoCard>

        {/* Profit by Trading Session */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <h3 className="font-heading font-bold text-white text-base mb-1">
            Session Performance & Win Rate
          </h3>
          <p className="text-xs text-gray-400 mb-4">Tokyo vs London vs New York Sessions</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {analytics.sessionPerformance.map((sess) => (
              <div key={sess.session} className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md text-center">
                <span className="text-[10px] font-heading font-bold text-gray-400 uppercase block">
                  {sess.session} Session
                </span>
                <span className="text-lg font-heading font-bold text-[#74FF44] block my-0.5">
                  +{formatCurrency(sess.profit)}
                </span>
                <span className="text-xs text-gray-300 font-mono">
                  {sess.winRate}% WR ({sess.trades}T)
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md text-xs text-gray-400">
            <strong className="text-white">Alpha Insight:</strong> London Session delivers the highest volume and profit density (65.5% WR), primarily driven by XAUUSD and EURUSD breakouts.
          </div>
        </NeoCard>

        {/* Profit by Symbol */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <h3 className="font-heading font-bold text-white text-base mb-1">
            Profit Breakdown by Instrument
          </h3>
          <p className="text-xs text-gray-400 mb-4">Cumulative dollar profit</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.profitBySymbol} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#132D5E" />
                <XAxis type="number" stroke="#6b7280" fontSize={11} />
                <YAxis dataKey="symbol" type="category" stroke="#fff" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#07152F",
                    borderColor: "#050505",
                    borderWidth: 2,
                    boxShadow: "4px 4px 0px #050505",
                  }}
                  formatter={(v: unknown) => [formatCurrency(Number(v)), "Profit"]}
                />
                <Bar dataKey="profit" fill="#00E5FF" radius={[0, 4, 4, 0]} stroke="#050505" strokeWidth={1.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeoCard>

        {/* Profit by Strategy */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <h3 className="font-heading font-bold text-white text-base mb-1">
            Strategy Attribution & Efficiency
          </h3>
          <p className="text-xs text-gray-400 mb-4">Win rate & net contributions</p>

          <div className="space-y-3">
            {analytics.profitByStrategy.map((strat) => (
              <div key={strat.strategy} className="p-2.5 bg-[#07152F] border-2 border-[#050505] rounded-md">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-heading font-bold text-white truncate max-w-[200px]">
                    {strat.strategy}
                  </span>
                  <span className="font-mono font-bold text-[#74FF44]">
                    +{formatCurrency(strat.profit)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>Win Rate: {strat.winRate}%</span>
                  <span>{strat.trades} Trades</span>
                </div>
                <div className="w-full bg-[#0D2247] h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-[#00E5FF] h-full" style={{ width: `${strat.winRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </NeoCard>
      </div>
    </div>
  );
}

