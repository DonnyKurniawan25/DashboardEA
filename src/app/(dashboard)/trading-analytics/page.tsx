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
        <PageHeader title="Trading Analytics" subtitle="Statistik Kuantitatif EA-Nevan" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <NeoCard key={i} className="p-4">
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
        subtitle="Analisis Performa Kuantitatif, Distribusi Alpha Sesi & Kurva Equity EA-Nevan"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={exportAnalyticsCSV}
          className="flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export Laporan CSV
        </NeoButton>
        <NeoButton
          variant="primary"
          size="sm"
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} /> Hitung Ulang
        </NeoButton>
      </PageHeader>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <NeoCard className="p-3">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase">
            Net Profit
          </p>
          <p className="text-lg font-mono font-bold text-[#00B843] dark:text-[#74FF44]">
            +{formatCurrency(analytics.netProfit)}
          </p>
        </NeoCard>

        <NeoCard className="p-3">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase">
            Win Rate
          </p>
          <p className="text-lg font-mono font-bold text-[#00B843] dark:text-[#74FF44]">
            {analytics.winRate}%
          </p>
        </NeoCard>

        <NeoCard className="p-3">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase">
            Profit Factor
          </p>
          <p className="text-lg font-mono font-bold text-[#050505] dark:text-white">
            {analytics.profitFactor}
          </p>
        </NeoCard>

        <NeoCard className="p-3">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase">
            Avg Win
          </p>
          <p className="text-lg font-mono font-bold text-[#00B843] dark:text-[#74FF44]">
            +${analytics.averageWin}
          </p>
        </NeoCard>

        <NeoCard className="p-3">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase">
            Avg Loss
          </p>
          <p className="text-lg font-mono font-bold text-[#FF3B30] dark:text-[#FF4B57]">
            ${analytics.averageLoss}
          </p>
        </NeoCard>

        <NeoCard className="p-3">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase">
            Risk / Reward
          </p>
          <p className="text-lg font-mono font-bold text-[#1746FF] dark:text-[#00E5FF]">
            1:{analytics.riskReward}
          </p>
        </NeoCard>

        <NeoCard className="p-3">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase">
            Max Drawdown
          </p>
          <p className="text-lg font-mono font-bold text-[#FF3B30] dark:text-[#FF4B57]">
            {analytics.maxDrawdown}%
          </p>
        </NeoCard>

        <NeoCard className="p-3">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase">
            Total Trades
          </p>
          <p className="text-lg font-mono font-bold text-[#050505] dark:text-white">
            {analytics.totalTrades}
          </p>
        </NeoCard>
      </div>

      {/* Equity & Balance Curve (Full Width) */}
      <NeoCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b-2 border-[#050505] pb-3">
          <div>
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Kurva Kumulatif Equity vs Balance (90 Hari)
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              High-water mark tracking dan trajektori floating robot EA-Nevan
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#1746FF] dark:text-[#00E5FF]">
              <span className="w-3 h-3 bg-[#00E5FF] border border-[#050505] rounded-sm" /> Equity
            </span>
            <span className="flex items-center gap-1.5 text-[#1746FF]">
              <span className="w-3 h-3 bg-[#1746FF] border border-[#050505] rounded-sm" /> Balance
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.equityCurve} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="eqAnaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} domain={["dataMin - 1000", "dataMax + 1000"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#050505",
                  borderWidth: 2,
                  boxShadow: "4px 4px 0px #050505",
                  borderRadius: 4,
                  color: "#050505",
                  fontWeight: "bold",
                }}
              />
              <Area type="monotone" dataKey="equity" stroke="#00E5FF" strokeWidth={2.5} fill="url(#eqAnaGrad)" name="Equity" />
              <Area type="monotone" dataKey="balance" stroke="#1746FF" strokeWidth={2.5} fill="none" name="Balance" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </NeoCard>

      {/* Grid of Analytical Breakdowns (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly & Monthly P/L */}
        <NeoCard className="p-5">
          <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base mb-1">
            Performa Mingguan Bersih ($)
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">8 minggu perdagangan terakhir</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyPnL} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="week" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#050505",
                    borderWidth: 2,
                    boxShadow: "4px 4px 0px #050505",
                    borderRadius: 4,
                    color: "#050505",
                  }}
                  formatter={(v: unknown) => [formatCurrency(Number(v)), "P/L"]}
                />
                <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                  {analytics.weeklyPnL.map((entry, index) => (
                    <Cell
                      key={`w-cell-${index}`}
                      fill={entry.pnl >= 0 ? "#00B843" : "#FF4B57"}
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
        <NeoCard className="p-5">
          <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base mb-1">
            Performa Sesi & Rasio Kemenangan
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Tokyo vs London vs New York Sessions</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {analytics.sessionPerformance.map((sess) => (
              <div key={sess.session} className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md text-center shadow-[2px_2px_0px_#050505]">
                <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">
                  {sess.session}
                </span>
                <span className="text-lg font-mono font-bold text-[#00B843] dark:text-[#74FF44] block my-0.5">
                  +{formatCurrency(sess.profit)}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-mono font-bold">
                  {sess.winRate}% WR ({sess.trades}T)
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md text-xs text-gray-700 dark:text-gray-300 shadow-[2px_2px_0px_#050505]">
            <strong className="text-[#050505] dark:text-white font-heading">Alpha Insight:</strong> Sesi London memberikan kepadatan volume dan profit tertinggi (65.5% WR), didorong oleh momentum breakout pada XAUUSDm dan EURUSD.
          </div>
        </NeoCard>

        {/* Profit by Symbol */}
        <NeoCard className="p-5">
          <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base mb-1">
            Breakdown Profit Berdasarkan Simbol
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Akumulasi keuntungan per instrumen</p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.profitBySymbol} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6b7280" fontSize={11} />
                <YAxis dataKey="symbol" type="category" stroke="#050505" fontSize={11} fontStyle="bold" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#050505",
                    borderWidth: 2,
                    boxShadow: "4px 4px 0px #050505",
                    borderRadius: 4,
                    color: "#050505",
                  }}
                  formatter={(v: unknown) => [formatCurrency(Number(v)), "Profit"]}
                />
                <Bar dataKey="profit" fill="#00E5FF" radius={[0, 4, 4, 0]} stroke="#050505" strokeWidth={1.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeoCard>

        {/* Profit by Strategy */}
        <NeoCard className="p-5">
          <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base mb-1">
            Efisiensi & Atribusi Strategi
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Tingkat kemenangan & kontribusi bersih</p>

          <div className="space-y-3">
            {analytics.profitByStrategy.map((strat) => (
              <div key={strat.strategy} className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-heading font-bold text-[#050505] dark:text-white truncate max-w-[200px]">
                    {strat.strategy}
                  </span>
                  <span className="font-mono font-bold text-[#00B843] dark:text-[#74FF44]">
                    +{formatCurrency(strat.profit)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400 font-medium">
                  <span>Win Rate: {strat.winRate}%</span>
                  <span>{strat.trades} Trades</span>
                </div>
                <div className="w-full bg-[#E5E7EB] dark:bg-[#0D2247] h-2 rounded-full overflow-hidden mt-1.5 border border-[#050505]">
                  <div className="bg-[#1746FF] dark:bg-[#00E5FF] h-full" style={{ width: `${strat.winRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </NeoCard>
      </div>
    </div>
  );
}
