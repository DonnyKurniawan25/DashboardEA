"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  NeoInput,
  NeoSelect,
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
import type { OpenPosition } from "@/types";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  RefreshCw,
  XCircle,
  SlidersHorizontal,
  Clock,
  Layers,
  DollarSign,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function OpenPositionsPage() {
  const [positions, setPositions] = useState<OpenPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"pnl" | "lots" | "duration">("pnl");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const data = await api.getPositions();
      setPositions(data);
    } catch (err) {
      console.error("Failed to load positions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Filter & Sort
  const filteredPositions = useMemo(() => {
    return positions
      .filter((pos) => {
        const matchesSearch =
          pos.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pos.ticket.includes(searchQuery) ||
          pos.strategy.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType =
          typeFilter === "ALL" ? true : pos.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortBy === "pnl") {
          valA = a.floatingPnL;
          valB = b.floatingPnL;
        } else if (sortBy === "lots") {
          valA = a.lots;
          valB = b.lots;
        } else if (sortBy === "duration") {
          valA = a.duration;
          valB = b.duration;
        }
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [positions, searchQuery, typeFilter, sortBy, sortOrder]);

  // Derived stats
  const totalPnL = positions.reduce((acc, p) => acc + p.floatingPnL, 0);
  const totalLots = positions.reduce((acc, p) => acc + p.lots, 0);
  const buyPositions = positions.filter((p) => p.type === "BUY").length;
  const sellPositions = positions.filter((p) => p.type === "SELL").length;
  const highestWin = positions.length
    ? Math.max(...positions.map((p) => p.floatingPnL))
    : 0;

  const handleSimulatedClose = (ticket: string) => {
    setActionNotice(`[DEMO ACTION] Permintaan penutupan order #${ticket} disimulasikan. Eksekusi MT5 sesungguhnya memerlukan bridge aktif.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Open Positions"
        subtitle="Pemantauan Real-Time Order MT5 & Transaksi Aktif Robot EA-Nevan"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={fetchPositions}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Refresh
        </NeoButton>
        <NeoBadge variant="warning">DEMO DATA</NeoBadge>
      </PageHeader>

      {/* Simulated action banner */}
      {actionNotice && (
        <div className="p-3 bg-[#00E5FF]/20 border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md text-xs font-heading font-bold text-[#050505] dark:text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-gray-500 hover:text-black dark:hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Posisi Terbuka
            </p>
            <Layers className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
            {positions.length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            {buyPositions} Long / {sellPositions} Short
          </p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Total Floating P/L
            </p>
            <DollarSign className="w-4 h-4 text-[#00B843] dark:text-[#74FF44]" />
          </div>
          <p className={cn("text-2xl font-mono font-bold", getPnLColor(totalPnL))}>
            {formatPnL(totalPnL)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            {totalPnL >= 0 ? "Floating Profit Bersih" : "Dalam Drawdown"}
          </p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Total Lot Berjalan
            </p>
            <BarChart3 className="w-4 h-4 text-[#FFE600]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
            {formatNumber(totalLots, 2)} Lot
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Di 5 Pasangan Mata Uang</p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Profit Tertinggi
            </p>
            <TrendingUp className="w-4 h-4 text-[#00B843] dark:text-[#74FF44]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#00B843] dark:text-[#74FF44]">
            +{formatCurrency(highestWin)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Leading: XAUUSDm BUY</p>
        </NeoCard>
      </div>

      {/* Filter & Search Bar */}
      <NeoCard className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari ticket, simbol, bot..."
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF] dark:focus:border-[#00E5FF]"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#F9FAFB] dark:bg-[#07152F] p-1 border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
              {["ALL", "BUY", "SELL"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-heading font-bold rounded transition-colors",
                    typeFilter === type
                      ? "bg-[#00E5FF] text-[#050505]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 font-heading font-bold">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "pnl" | "lots" | "duration")}
              className="px-2.5 py-1.5 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF] dark:focus:border-[#00E5FF]"
            >
              <option value="pnl">Floating P/L</option>
              <option value="lots">Ukuran Lot</option>
              <option value="duration">Durasi</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="px-2.5 py-1.5 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-heading font-bold border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md hover:bg-gray-100 dark:hover:bg-[#132D5E]"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>
      </NeoCard>

      {/* Positions Table (Desktop) & Cards (Mobile) */}
      <NeoCard className="p-0 overflow-hidden">
        <div className="p-4 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Daftar Transaksi Aktif
            </h3>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-mono font-bold">
              ({filteredPositions.length} posisi)
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Auto-refresh: <span className="text-[#00B843] dark:text-[#74FF44] font-bold">Live Tick</span>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="font-heading font-bold text-[#050505] dark:text-white">Tidak ada posisi ditemukan</p>
            <p className="text-xs text-gray-500 mt-1">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full neo-table">
                <thead>
                  <tr>
                    <th className="text-left">Ticket</th>
                    <th className="text-left">Symbol</th>
                    <th className="text-center">Side</th>
                    <th className="text-right">Lots</th>
                    <th className="text-right">Entry</th>
                    <th className="text-right">Current</th>
                    <th className="text-right">SL</th>
                    <th className="text-right">TP</th>
                    <th className="text-right">Pips</th>
                    <th className="text-right">Swap / Comm</th>
                    <th className="text-right">Floating P/L</th>
                    <th className="text-center">Durasi</th>
                    <th className="text-left">Strategi / Bot</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPositions.map((pos) => (
                    <tr key={pos.ticket}>
                      <td className="font-mono text-xs text-gray-600 dark:text-gray-400">#{pos.ticket}</td>
                      <td className="font-heading font-bold text-[#050505] dark:text-white">{pos.symbol}</td>
                      <td className="text-center">
                        <NeoBadge variant={pos.type === "BUY" ? "success" : "danger"}>
                          {pos.type === "BUY" ? (
                            <span className="flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" /> BUY
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ArrowDownRight className="w-3 h-3" /> SELL
                            </span>
                          )}
                        </NeoBadge>
                      </td>
                      <td className="text-right font-mono font-bold text-[#050505] dark:text-white">{pos.lots.toFixed(2)}</td>
                      <td className="text-right font-mono text-gray-700 dark:text-gray-300">{pos.entryPrice}</td>
                      <td className="text-right font-mono text-[#050505] dark:text-white font-bold">{pos.currentPrice}</td>
                      <td className="text-right font-mono text-xs text-gray-600 dark:text-gray-400">{pos.stopLoss ?? "—"}</td>
                      <td className="text-right font-mono text-xs text-gray-600 dark:text-gray-400">{pos.takeProfit ?? "—"}</td>
                      <td className={cn("text-right font-mono font-bold text-xs", pos.floatingPips >= 0 ? "text-[#00B843] dark:text-[#74FF44]" : "text-[#FF3B30] dark:text-[#FF4B57]")}>
                        {pos.floatingPips >= 0 ? `+${pos.floatingPips}` : pos.floatingPips}
                      </td>
                      <td className="text-right font-mono text-xs text-gray-600 dark:text-gray-400">
                        {pos.swap} / {pos.commission}
                      </td>
                      <td className={cn("text-right font-mono font-bold text-sm", getPnLColor(pos.floatingPnL))}>
                        {formatPnL(pos.floatingPnL)}
                      </td>
                      <td className="text-center text-xs text-gray-600 dark:text-gray-400 font-mono">
                        {formatDuration(pos.duration)}
                      </td>
                      <td className="text-xs text-gray-700 dark:text-gray-300 max-w-[140px] truncate font-medium">{pos.strategy}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleSimulatedClose(pos.ticket)}
                          className="px-2 py-1 bg-[#FF4B57]/15 hover:bg-[#FF4B57] text-[#FF3B30] dark:text-[#FF4B57] hover:text-white border-2 border-[#050505] rounded text-[10px] font-heading font-bold transition-colors shadow-[2px_2px_0px_#050505]"
                          title="Simulasikan Tutup Posisi"
                        >
                          Close
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y-2 divide-[#050505] p-3 space-y-3">
              {filteredPositions.map((pos) => (
                <div key={pos.ticket} className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-[#050505] dark:text-white text-sm">{pos.symbol}</span>
                      <NeoBadge variant={pos.type === "BUY" ? "success" : "danger"}>
                        {pos.type} {pos.lots}
                      </NeoBadge>
                    </div>
                    <span className={cn("font-mono font-bold text-sm", getPnLColor(pos.floatingPnL))}>
                      {formatPnL(pos.floatingPnL)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 pt-1 border-t-2 border-[#050505]">
                    <div>Entry: <span className="font-bold text-[#050505] dark:text-white">{pos.entryPrice}</span></div>
                    <div>Current: <span className="font-bold text-[#050505] dark:text-white">{pos.currentPrice}</span></div>
                    <div>SL: {pos.stopLoss ?? "—"}</div>
                    <div>TP: {pos.takeProfit ?? "—"}</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    <span className="truncate max-w-[180px]">{pos.strategy}</span>
                    <button
                      onClick={() => handleSimulatedClose(pos.ticket)}
                      className="px-2 py-0.5 bg-[#FF4B57] text-white border border-[#050505] rounded font-bold text-[10px] shadow-[1px_1px_0px_#050505]"
                    >
                      Simulate Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </NeoCard>
    </div>
  );
}
