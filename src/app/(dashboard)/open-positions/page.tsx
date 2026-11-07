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
    setActionNotice(`[DEMO ACTION] Order #${ticket} close request simulated. Real MT5 execution requires live bridge.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Open Positions"
        subtitle="Real-time Monitoring of Active MT5 Orders & AI Positions"
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
        <div className="p-3 bg-[#1746FF]/20 border-2 border-[#1746FF] shadow-[3px_3px_0px_#050505] rounded-md text-xs font-heading text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-gray-400 hover:text-white">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Active Positions
            </p>
            <Layers className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">
            {positions.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {buyPositions} Long / {sellPositions} Short
          </p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Total Floating P/L
            </p>
            <DollarSign className="w-4 h-4 text-[#74FF44]" />
          </div>
          <p className={cn("text-2xl font-heading font-bold", getPnLColor(totalPnL))}>
            {formatPnL(totalPnL)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {totalPnL >= 0 ? "Positive Floating" : "Drawdown Active"}
          </p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Total Exposure (Lots)
            </p>
            <BarChart3 className="w-4 h-4 text-[#FFE600]" />
          </div>
          <p className="text-2xl font-heading font-bold text-white">
            {formatNumber(totalLots, 2)} Lots
          </p>
          <p className="text-xs text-gray-400 mt-1">Across 5 Instruments</p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Highest Floating Gain
            </p>
            <TrendingUp className="w-4 h-4 text-[#74FF44]" />
          </div>
          <p className="text-2xl font-heading font-bold text-[#74FF44]">
            +{formatCurrency(highestWin)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Leading: XAUUSD BUY</p>
        </NeoCard>
      </div>

      {/* Filter & Search Bar */}
      <NeoCard className="p-4 bg-[#0D2247]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, symbol, bot..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#07152F] text-white text-xs border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#07152F] p-1 border-2 border-[#050505] rounded-md">
              {["ALL", "BUY", "SELL"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-heading font-bold rounded transition-colors",
                    typeFilter === type
                      ? "bg-[#00E5FF] text-[#050505]"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-heading">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "pnl" | "lots" | "duration")}
              className="px-2.5 py-1.5 bg-[#07152F] text-white text-xs border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md focus:outline-none focus:border-[#00E5FF]"
            >
              <option value="pnl">Floating P/L</option>
              <option value="lots">Lot Size</option>
              <option value="duration">Duration</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
              className="px-2.5 py-1.5 bg-[#07152F] text-white text-xs font-heading font-bold border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md hover:bg-[#132D5E]"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>
        </div>
      </NeoCard>

      {/* Positions Table (Desktop) & Cards (Mobile) */}
      <NeoCard className="p-0 overflow-hidden bg-[#0D2247]">
        <div className="p-4 border-b-2 border-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-white text-base">
              Active Trade List
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              ({filteredPositions.length} positions)
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Auto-refresh: <span className="text-[#74FF44] font-bold">1s (Simulation)</span>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-500" />
            <p className="font-heading font-bold text-white">No positions found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search term</p>
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
                    <th className="text-center">Duration</th>
                    <th className="text-left">Strategy / Bot</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPositions.map((pos) => (
                    <tr key={pos.ticket}>
                      <td className="font-mono text-xs text-gray-400">#{pos.ticket}</td>
                      <td className="font-heading font-bold text-white">{pos.symbol}</td>
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
                      <td className="text-right font-mono font-bold text-white">{pos.lots.toFixed(2)}</td>
                      <td className="text-right font-mono text-gray-300">{pos.entryPrice}</td>
                      <td className="text-right font-mono text-white font-bold">{pos.currentPrice}</td>
                      <td className="text-right font-mono text-xs text-gray-400">{pos.stopLoss ?? "—"}</td>
                      <td className="text-right font-mono text-xs text-gray-400">{pos.takeProfit ?? "—"}</td>
                      <td className={cn("text-right font-mono font-bold text-xs", pos.floatingPips >= 0 ? "text-[#74FF44]" : "text-[#FF4B57]")}>
                        {pos.floatingPips >= 0 ? `+${pos.floatingPips}` : pos.floatingPips}
                      </td>
                      <td className="text-right font-mono text-xs text-gray-400">
                        {pos.swap} / {pos.commission}
                      </td>
                      <td className={cn("text-right font-heading font-bold text-sm", getPnLColor(pos.floatingPnL))}>
                        {formatPnL(pos.floatingPnL)}
                      </td>
                      <td className="text-center text-xs text-gray-400 font-mono">
                        {formatDuration(pos.duration)}
                      </td>
                      <td className="text-xs text-gray-300 max-w-[140px] truncate">{pos.strategy}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleSimulatedClose(pos.ticket)}
                          className="px-2 py-1 bg-[#FF4B57]/10 hover:bg-[#FF4B57] text-[#FF4B57] hover:text-white border border-[#FF4B57] rounded text-[10px] font-heading font-bold transition-colors"
                          title="Simulate Close"
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
            <div className="md:hidden divide-y divide-[#132D5E] p-3 space-y-3">
              {filteredPositions.map((pos) => (
                <div key={pos.ticket} className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-white text-sm">{pos.symbol}</span>
                      <NeoBadge variant={pos.type === "BUY" ? "success" : "danger"}>
                        {pos.type} {pos.lots}
                      </NeoBadge>
                    </div>
                    <span className={cn("font-heading font-bold text-sm", getPnLColor(pos.floatingPnL))}>
                      {formatPnL(pos.floatingPnL)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-400 pt-1 border-t border-[#132D5E]">
                    <div>Entry: <span className="text-white">{pos.entryPrice}</span></div>
                    <div>Current: <span className="text-white">{pos.currentPrice}</span></div>
                    <div>SL: {pos.stopLoss ?? "—"}</div>
                    <div>TP: {pos.takeProfit ?? "—"}</div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#132D5E] text-gray-500">
                    <span>{pos.strategy}</span>
                    <button
                      onClick={() => handleSimulatedClose(pos.ticket)}
                      className="px-2 py-0.5 bg-[#FF4B57] text-white rounded font-bold text-[10px]"
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

