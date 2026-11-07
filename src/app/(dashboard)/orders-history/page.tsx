"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  formatPnL,
  formatDuration,
  formatDate,
  getPnLColor,
  cn,
} from "@/lib/utils";
import { api } from "@/services/api";
import type { TradeOrder } from "@/types";
import {
  Download,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Target,
  Percent,
  Layers,
} from "lucide-react";

export default function OrdersHistoryPage() {
  const [trades, setTrades] = useState<TradeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getTradeHistory();
      setTrades(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      const matchesStatus =
        statusFilter === "all" ? true : t.status === statusFilter;
      const matchesSearch =
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticket.includes(searchQuery) ||
        t.strategy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [trades, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredTrades.length / pageSize) || 1;
  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTrades.slice(start, start + pageSize);
  }, [filteredTrades, currentPage]);

  // Aggregate stats
  const totalClosed = trades.filter((t) => t.status === "closed");
  const netProfit = totalClosed.reduce((sum, t) => sum + t.profit, 0);
  const winTrades = totalClosed.filter((t) => t.profit > 0);
  const lossTrades = totalClosed.filter((t) => t.profit <= 0);
  const winRate = totalClosed.length ? (winTrades.length / totalClosed.length) * 100 : 0;
  const grossProfit = winTrades.reduce((sum, t) => sum + t.profit, 0);
  const grossLoss = Math.abs(lossTrades.reduce((sum, t) => sum + t.profit, 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : "N/A";

  // CSV Export Function
  const exportToCSV = () => {
    const headers = [
      "Ticket",
      "Symbol",
      "Type",
      "Lots",
      "Entry Price",
      "Close Price",
      "Profit",
      "Commission",
      "Swap",
      "Open Time",
      "Close Time",
      "Strategy",
      "Status",
    ];

    const rows = filteredTrades.map((t) => [
      t.ticket,
      t.symbol,
      t.type,
      t.lots,
      t.entryPrice,
      t.closePrice || "",
      t.profit,
      t.commission,
      t.swap,
      t.openTime,
      t.closeTime || "",
      `"${t.strategy}"`,
      t.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `goldshield_trades_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders & History"
        subtitle="Complete Trade Execution Log & Performance Archive"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          className="flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </NeoButton>
        <NeoButton
          variant="primary"
          size="sm"
          onClick={fetchHistory}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Sync History
        </NeoButton>
      </PageHeader>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Total Logged Trades
            </p>
            <Layers className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">
            {trades.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {winTrades.length} Wins / {lossTrades.length} Losses
          </p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Net Realized P/L
            </p>
            <DollarSign className="w-4 h-4 text-[#74FF44]" />
          </div>
          <p className={cn("text-2xl font-heading font-bold", getPnLColor(netProfit))}>
            {formatPnL(netProfit)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Closed trades total</p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Win Rate
            </p>
            <Target className="w-4 h-4 text-[#74FF44]" />
          </div>
          <p className="text-2xl font-heading font-bold text-[#74FF44]">
            {winRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Above target baseline (55%)</p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Profit Factor
            </p>
            <Percent className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">
            {profitFactor}
          </p>
          <p className="text-xs text-gray-400 mt-1">Gross Win / Gross Loss</p>
        </NeoCard>
      </div>

      {/* Tabs & Search */}
      <NeoCard className="p-4 bg-[#0D2247]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#07152F] p-1 border-2 border-[#050505] rounded-md">
            {[
              { id: "all", label: "All Orders" },
              { id: "closed", label: "Closed" },
              { id: "pending", label: "Pending" },
              { id: "cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-heading font-bold rounded transition-colors",
                  statusFilter === tab.id
                    ? "bg-[#00E5FF] text-[#050505]"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ticket, symbol, bot..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#07152F] text-white text-xs border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>
      </NeoCard>

      {/* Orders Table */}
      <NeoCard className="p-0 overflow-hidden bg-[#0D2247]">
        <div className="p-4 border-b-2 border-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-white text-base">
              Order Logs
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              (Page {currentPage} of {totalPages})
            </span>
          </div>
          <NeoBadge variant="neutral">{filteredTrades.length} records</NeoBadge>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : paginatedTrades.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="font-heading font-bold text-white">No historical trades found</p>
            <p className="text-xs text-gray-500 mt-1">Try resetting the status filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full neo-table">
              <thead>
                <tr>
                  <th className="text-left">Ticket</th>
                  <th className="text-left">Symbol</th>
                  <th className="text-center">Side</th>
                  <th className="text-right">Lots</th>
                  <th className="text-right">Entry Price</th>
                  <th className="text-right">Close Price</th>
                  <th className="text-right">Swap / Comm</th>
                  <th className="text-right">Net Profit</th>
                  <th className="text-left">Open Time</th>
                  <th className="text-left">Close Time</th>
                  <th className="text-left">Strategy / Bot</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrades.map((t) => (
                  <tr key={t.ticket}>
                    <td className="font-mono text-xs text-gray-400">#{t.ticket}</td>
                    <td className="font-heading font-bold text-white">{t.symbol}</td>
                    <td className="text-center">
                      <NeoBadge variant={t.type === "BUY" ? "success" : "danger"}>
                        {t.type}
                      </NeoBadge>
                    </td>
                    <td className="text-right font-mono text-gray-300">{t.lots.toFixed(2)}</td>
                    <td className="text-right font-mono text-gray-300">{t.entryPrice.toFixed(4)}</td>
                    <td className="text-right font-mono text-white font-bold">
                      {t.closePrice ? t.closePrice.toFixed(4) : "—"}
                    </td>
                    <td className="text-right font-mono text-xs text-gray-400">
                      {t.swap} / {t.commission}
                    </td>
                    <td className={cn("text-right font-heading font-bold text-sm", getPnLColor(t.profit))}>
                      {formatPnL(t.profit)}
                    </td>
                    <td className="text-xs text-gray-400 font-mono">{formatDate(t.openTime)}</td>
                    <td className="text-xs text-gray-400 font-mono">
                      {t.closeTime ? formatDate(t.closeTime) : "Active"}
                    </td>
                    <td className="text-xs text-gray-300 max-w-[140px] truncate">{t.strategy}</td>
                    <td className="text-center">
                      <NeoBadge
                        variant={
                          t.status === "closed"
                            ? "neutral"
                            : t.status === "open"
                            ? "success"
                            : "warning"
                        }
                      >
                        {t.status.toUpperCase()}
                      </NeoBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t-2 border-[#050505] flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredTrades.length)} of{" "}
            {filteredTrades.length} trades
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-[#07152F] text-white border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#132D5E]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-[#07152F] text-white text-xs font-heading font-bold border-2 border-[#050505] rounded">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-[#07152F] text-white border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#132D5E]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </NeoCard>
    </div>
  );
}

