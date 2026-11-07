"use client";

import React, { useState, useMemo } from "react";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  NeoModal,
  PageHeader,
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
import { useAppStore } from "@/store";
import type { OpenPosition } from "@/types";
import {
  BarChart3,
  TrendingUp,
  Search,
  XCircle,
  Layers,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function OpenPositionsPage() {
  const {
    positions,
    addPosition,
    updatePosition,
    closePosition,
    deletePosition,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"pnl" | "lots" | "duration">("pnl");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // CRUD Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<OpenPosition | null>(null);
  const [closingPosition, setClosingPosition] = useState<OpenPosition | null>(null);
  const [deletingPosition, setDeletingPosition] = useState<OpenPosition | null>(null);

  // Form State for Add Position
  const [formSymbol, setFormSymbol] = useState("XAUUSDm");
  const [formType, setFormType] = useState<"BUY" | "SELL">("BUY");
  const [formLots, setFormLots] = useState("0.01");
  const [formEntryPrice, setFormEntryPrice] = useState("2685.20");
  const [formStopLoss, setFormStopLoss] = useState("2670.00");
  const [formTakeProfit, setFormTakeProfit] = useState("2705.00");
  const [formStrategy, setFormStrategy] = useState("EA-Nevan Scalper Pro");
  const [formError, setFormError] = useState<string | null>(null);

  // Form State for Edit Position
  const [editStopLoss, setEditStopLoss] = useState("");
  const [editTakeProfit, setEditTakeProfit] = useState("");
  const [editLots, setEditLots] = useState("");
  const [editStrategy, setEditStrategy] = useState("");
  const [editCurrentPrice, setEditCurrentPrice] = useState("");

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Open Add Modal with sensible defaults per symbol
  const handleOpenAdd = () => {
    setFormSymbol("XAUUSDm");
    setFormType("BUY");
    setFormLots("0.01");
    setFormEntryPrice("2685.20");
    setFormStopLoss("2670.00");
    setFormTakeProfit("2705.00");
    setFormStrategy("EA-Nevan Scalper Pro");
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Symbol change helper
  const handleSymbolChange = (sym: string) => {
    setFormSymbol(sym);
    if (sym === "XAUUSDm" || sym === "XAUUSD") {
      setFormEntryPrice("2685.20");
      setFormStopLoss("2670.00");
      setFormTakeProfit("2705.00");
    } else if (sym === "EURUSD") {
      setFormEntryPrice("1.0845");
      setFormStopLoss("1.0800");
      setFormTakeProfit("1.0920");
    } else if (sym === "GBPUSD") {
      setFormEntryPrice("1.2980");
      setFormStopLoss("1.2920");
      setFormTakeProfit("1.3060");
    } else if (sym === "USDJPY") {
      setFormEntryPrice("152.40");
      setFormStopLoss("151.60");
      setFormTakeProfit("153.80");
    } else if (sym === "BTCUSD") {
      setFormEntryPrice("88400.00");
      setFormStopLoss("86000.00");
      setFormTakeProfit("92000.00");
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = parseFloat(formLots);
    const entry = parseFloat(formEntryPrice);
    if (!lots || lots <= 0) {
      setFormError("Ukuran lot harus lebih besar dari 0.");
      return;
    }
    if (!entry || entry <= 0) {
      setFormError("Harga entry harus valid.");
      return;
    }

    const sl = formStopLoss.trim() ? parseFloat(formStopLoss) : null;
    const tp = formTakeProfit.trim() ? parseFloat(formTakeProfit) : null;

    const newPos = addPosition({
      symbol: formSymbol,
      type: formType,
      lots,
      entryPrice: entry,
      currentPrice: entry,
      stopLoss: sl,
      takeProfit: tp,
      strategy: formStrategy,
    });

    setIsAddModalOpen(false);
    showToast(`Posisi #${newPos.ticket} (${newPos.type} ${newPos.lots} Lot ${newPos.symbol}) berhasil dibuka!`);
  };

  // Open Edit Modal
  const handleOpenEdit = (pos: OpenPosition) => {
    setEditingPosition(pos);
    setEditStopLoss(pos.stopLoss ? String(pos.stopLoss) : "");
    setEditTakeProfit(pos.takeProfit ? String(pos.takeProfit) : "");
    setEditLots(String(pos.lots));
    setEditStrategy(pos.strategy);
    setEditCurrentPrice(String(pos.currentPrice));
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPosition) return;

    const sl = editStopLoss.trim() ? parseFloat(editStopLoss) : null;
    const tp = editTakeProfit.trim() ? parseFloat(editTakeProfit) : null;
    const lots = parseFloat(editLots) || editingPosition.lots;
    const curPrice = parseFloat(editCurrentPrice) || editingPosition.currentPrice;

    // Recalculate PnL
    const isGold = editingPosition.symbol.includes("XAU") || editingPosition.symbol.includes("GOLD");
    const multiplier = isGold ? 100 : 100000;
    const diff = editingPosition.type === "BUY" ? curPrice - editingPosition.entryPrice : editingPosition.entryPrice - curPrice;
    const floatingPnL = Math.round((diff * lots * multiplier) * 100) / 100;
    const floatingPips = Math.round((isGold ? diff * 10 : diff * 10000) * 10) / 10;

    updatePosition(editingPosition.ticket, {
      stopLoss: sl,
      takeProfit: tp,
      lots,
      strategy: editStrategy,
      currentPrice: curPrice,
      floatingPnL,
      floatingPips,
    });

    setEditingPosition(null);
    showToast(`Posisi #${editingPosition.ticket} berhasil diperbarui.`);
  };

  // Handle Confirm Close Position
  const handleConfirmClose = () => {
    if (!closingPosition) return;
    closePosition(closingPosition.ticket, closingPosition.currentPrice);
    showToast(`Posisi #${closingPosition.ticket} (${closingPosition.symbol}) telah ditutup dan dipindahkan ke Riwayat Transaksi.`);
    setClosingPosition(null);
  };

  // Handle Confirm Delete Position
  const handleConfirmDelete = () => {
    if (!deletingPosition) return;
    deletePosition(deletingPosition.ticket);
    showToast(`Posisi #${deletingPosition.ticket} telah dihapus dari daftar.`);
    setDeletingPosition(null);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Open Positions"
        subtitle="Pemantauan Real-Time Order MT5 & Transaksi Aktif Robot EA-Nevan"
      >
        <NeoButton
          variant="secondary"
          size="sm"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Buka Posisi Baru</span>
        </NeoButton>
      </PageHeader>

      {/* Toast Notification Banner */}
      {toastNotice && (
        <div className="p-3 bg-[#74FF44]/20 border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md text-xs font-heading font-bold text-[#050505] dark:text-white flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00B843] dark:text-[#74FF44] shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button
            onClick={() => setToastNotice(null)}
            className="text-gray-500 hover:text-black dark:hover:text-white"
          >
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
            {positions.length} Posisi
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
            {totalPnL >= 0 ? (
              <TrendingUp className="w-4 h-4 text-[#00B843] dark:text-[#74FF44]" />
            ) : (
              <TrendingUp className="w-4 h-4 text-[#FF3B30] dark:text-[#FF4B57]" />
            )}
          </div>
          <p className={cn("text-2xl font-mono font-bold", getPnLColor(totalPnL))}>
            {formatPnL(totalPnL)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Margin Aktif
          </p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Total Lot Berjalan
            </p>
            <BarChart3 className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
            {formatNumber(totalLots, 2)} Lot
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Total Exposure
          </p>
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
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Floating Posisi Teratas
          </p>
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
                placeholder="Cari ticket, simbol, strategi..."
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
              Daftar Posisi Berjalan
            </h3>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-mono font-bold">
              ({filteredPositions.length} posisi aktif)
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Sinkronisasi: <span className="text-[#00B843] dark:text-[#74FF44] font-bold">Real-Time State</span>
          </div>
        </div>

        {filteredPositions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="font-heading font-bold text-[#050505] dark:text-white">Tidak ada posisi terbuka</p>
            <p className="text-xs text-gray-500 mt-1 mb-4">Mulai buka posisi baru untuk menguji order MT5.</p>
            <NeoButton size="sm" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1 inline" /> Buka Posisi Baru
            </NeoButton>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-[#050505] bg-gray-100 dark:bg-[#07152F] text-gray-700 dark:text-gray-300 font-heading">
                    <th className="py-2.5 px-3 text-left">Ticket</th>
                    <th className="py-2.5 px-3 text-left">Simbol</th>
                    <th className="py-2.5 px-3 text-center">Tipe</th>
                    <th className="py-2.5 px-3 text-right">Lot</th>
                    <th className="py-2.5 px-3 text-right">Harga Entry</th>
                    <th className="py-2.5 px-3 text-right">Harga Saat Ini</th>
                    <th className="py-2.5 px-3 text-right">SL / TP</th>
                    <th className="py-2.5 px-3 text-right">Floating P/L</th>
                    <th className="py-2.5 px-3 text-left">Strategi / Robot</th>
                    <th className="py-2.5 px-3 text-center">Aksi (CRUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#050505]">
                  {filteredPositions.map((pos) => (
                    <tr
                      key={pos.ticket}
                      className="hover:bg-gray-50 dark:hover:bg-[#07152F]/50 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-600 dark:text-gray-400">
                        #{pos.ticket}
                      </td>
                      <td className="py-2.5 px-3 font-heading font-bold text-[#050505] dark:text-white">
                        {pos.symbol}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <NeoBadge variant={pos.type === "BUY" ? "success" : "danger"}>
                          {pos.type}
                        </NeoBadge>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {pos.lots.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {pos.entryPrice}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#050505] dark:text-white">
                        {pos.currentPrice}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-gray-400">
                        <span className="text-[#FF4B57]">{pos.stopLoss ?? "—"}</span>
                        {" / "}
                        <span className="text-[#00B843] dark:text-[#74FF44]">{pos.takeProfit ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        <span className={cn(getPnLColor(pos.floatingPnL))}>
                          {formatPnL(pos.floatingPnL)}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          {pos.floatingPips >= 0 ? "+" : ""}{pos.floatingPips} pips
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700 dark:text-gray-300 font-medium">
                        {pos.strategy}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(pos)}
                            title="Edit SL / TP & Lot"
                            className="p-1 text-gray-700 dark:text-gray-300 hover:text-[#1746FF] hover:bg-gray-100 dark:hover:bg-[#07152F] border border-[#050505] rounded shadow-[1px_1px_0px_#050505]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setClosingPosition(pos)}
                            title="Tutup Posisi (Market Close)"
                            className="px-2 py-1 bg-[#FF4B57] hover:bg-[#E03E49] text-white border border-[#050505] rounded text-[10px] font-heading font-bold shadow-[1px_1px_0px_#050505]"
                          >
                            Tutup
                          </button>
                          <button
                            onClick={() => setDeletingPosition(pos)}
                            title="Hapus Posisi"
                            className="p-1 text-gray-500 hover:text-[#FF4B57] hover:bg-gray-100 dark:hover:bg-[#07152F] border border-[#050505] rounded shadow-[1px_1px_0px_#050505]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y-2 divide-[#050505] p-3 space-y-3">
              {filteredPositions.map((pos) => (
                <div
                  key={pos.ticket}
                  className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-[#050505] dark:text-white text-sm">
                        {pos.symbol}
                      </span>
                      <NeoBadge variant={pos.type === "BUY" ? "success" : "danger"}>
                        {pos.type} {pos.lots}
                      </NeoBadge>
                      <span className="text-[10px] font-mono text-gray-500">#{pos.ticket}</span>
                    </div>
                    <span className={cn("font-mono font-bold text-sm", getPnLColor(pos.floatingPnL))}>
                      {formatPnL(pos.floatingPnL)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 pt-1 border-t-2 border-[#050505]">
                    <div>Entry: <span className="font-bold text-[#050505] dark:text-white">{pos.entryPrice}</span></div>
                    <div>Current: <span className="font-bold text-[#050505] dark:text-white">{pos.currentPrice}</span></div>
                    <div>SL: <span className="text-[#FF4B57] font-bold">{pos.stopLoss ?? "—"}</span></div>
                    <div>TP: <span className="text-[#00B843] dark:text-[#74FF44] font-bold">{pos.takeProfit ?? "—"}</span></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                    <span className="truncate max-w-[150px]">{pos.strategy}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(pos)}
                        className="px-2 py-0.5 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white border border-[#050505] rounded font-bold text-[10px] shadow-[1px_1px_0px_#050505]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setClosingPosition(pos)}
                        className="px-2 py-0.5 bg-[#FF4B57] text-white border border-[#050505] rounded font-bold text-[10px] shadow-[1px_1px_0px_#050505]"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </NeoCard>

      {/* ─── MODAL 1: BUKA POSISI BARU (CREATE) ─────────────── */}
      <NeoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Buka Posisi Trading Baru"
        subtitle="Eksekusi order beli / jual baru pada terminal MT5"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-2.5 bg-[#FF4B57]/15 border-2 border-[#FF4B57] rounded text-xs font-bold text-[#FF4B57]">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Simbol
              </label>
              <select
                value={formSymbol}
                onChange={(e) => handleSymbolChange(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="XAUUSDm">XAUUSDm (Gold Cent/Mini)</option>
                <option value="XAUUSD">XAUUSD (Gold Standard)</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="BTCUSD">BTCUSD</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Arah (Order Type)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormType("BUY")}
                  className={cn(
                    "py-1.5 text-xs font-heading font-bold rounded border-2 border-[#050505] transition-all",
                    formType === "BUY"
                      ? "bg-[#74FF44] text-[#050505] shadow-[2px_2px_0px_#050505]"
                      : "bg-white dark:bg-[#07152F] text-gray-600 dark:text-gray-400"
                  )}
                >
                  BUY (Long)
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("SELL")}
                  className={cn(
                    "py-1.5 text-xs font-heading font-bold rounded border-2 border-[#050505] transition-all",
                    formType === "SELL"
                      ? "bg-[#FF4B57] text-white shadow-[2px_2px_0px_#050505]"
                      : "bg-white dark:bg-[#07152F] text-gray-600 dark:text-gray-400"
                  )}
                >
                  SELL (Short)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Ukuran Lot
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formLots}
                onChange={(e) => setFormLots(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Harga Entry
              </label>
              <input
                type="number"
                step="0.0001"
                value={formEntryPrice}
                onChange={(e) => setFormEntryPrice(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Stop Loss (SL)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formStopLoss}
                onChange={(e) => setFormStopLoss(e.target.value)}
                placeholder="Opsional (Kosongkan jika tanpa SL)"
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono text-[#FF4B57] font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Take Profit (TP)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formTakeProfit}
                onChange={(e) => setFormTakeProfit(e.target.value)}
                placeholder="Opsional (Kosongkan jika tanpa TP)"
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono text-[#00B843] dark:text-[#74FF44] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Strategi / Tag Robot
            </label>
            <input
              type="text"
              value={formStrategy}
              onChange={(e) => setFormStrategy(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Eksekusi Order ({formType})
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 2: EDIT POSISI (UPDATE) ────────────────── */}
      <NeoModal
        isOpen={!!editingPosition}
        onClose={() => setEditingPosition(null)}
        title="Modifikasi Posisi Berjalan"
        subtitle={`Ubah Stop Loss, Take Profit, atau Lot untuk Ticket #${editingPosition?.ticket}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="p-2.5 bg-gray-100 dark:bg-[#07152F] border-2 border-[#050505] rounded text-xs font-mono flex items-center justify-between">
            <span>{editingPosition?.symbol} ({editingPosition?.type})</span>
            <span>Entry: ${editingPosition?.entryPrice}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Stop Loss (SL)
              </label>
              <input
                type="number"
                step="0.0001"
                value={editStopLoss}
                onChange={(e) => setEditStopLoss(e.target.value)}
                placeholder="Tanpa SL"
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono text-[#FF4B57] font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Take Profit (TP)
              </label>
              <input
                type="number"
                step="0.0001"
                value={editTakeProfit}
                onChange={(e) => setEditTakeProfit(e.target.value)}
                placeholder="Tanpa TP"
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono text-[#00B843] dark:text-[#74FF44] font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Ukuran Lot
              </label>
              <input
                type="number"
                step="0.01"
                value={editLots}
                onChange={(e) => setEditLots(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Simulasi Harga Saat Ini
              </label>
              <input
                type="number"
                step="0.0001"
                value={editCurrentPrice}
                onChange={(e) => setEditCurrentPrice(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Catatan Strategi
            </label>
            <input
              type="text"
              value={editStrategy}
              onChange={(e) => setEditStrategy(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingPosition(null)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Simpan Perubahan
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 3: TUTUP POSISI (CLOSE / REALIZE PnL) ────── */}
      <NeoModal
        isOpen={!!closingPosition}
        onClose={() => setClosingPosition(null)}
        title="Tutup Posisi (Market Close)"
        subtitle="Posisi akan ditutup dan keuntungannya dicatat ke saldo akun"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Order:</span>
              <span className="font-mono font-bold">
                #{closingPosition?.ticket} ({closingPosition?.type} {closingPosition?.lots} Lot {closingPosition?.symbol})
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Harga Entry:</span>
              <span className="font-mono">{closingPosition?.entryPrice}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Harga Penutupan:</span>
              <span className="font-mono font-bold text-[#050505] dark:text-white">
                {closingPosition?.currentPrice}
              </span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-gray-300 dark:border-gray-700">
              <span className="font-bold">Estimasi Realized P/L:</span>
              <span className={cn("font-mono font-bold", getPnLColor(closingPosition?.floatingPnL ?? 0))}>
                {formatPnL(closingPosition?.floatingPnL ?? 0)}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300">
            Setelah ditutup, keuntungan/kerugian akan langsung ditambahkan ke Saldo Akun aktif dan masuk ke Riwayat Transaksi.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setClosingPosition(null)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmClose}
            >
              Tutup Posisi Sekarang
            </NeoButton>
          </div>
        </div>
      </NeoModal>

      {/* ─── MODAL 4: HAPUS POSISI (DELETE) ────────────────── */}
      <NeoModal
        isOpen={!!deletingPosition}
        onClose={() => setDeletingPosition(null)}
        title="Hapus Posisi Dari Monitor"
        subtitle="Hapus posisi tanpa mencatat ke saldo riwayat"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus data posisi <strong>#{deletingPosition?.ticket}</strong> dari dashboard?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingPosition(null)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
            >
              Hapus Posisi
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
