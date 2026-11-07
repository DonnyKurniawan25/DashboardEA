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
  formatDate,
  getPnLColor,
  cn,
} from "@/lib/utils";
import { useAppStore } from "@/store";
import type { TradeOrder } from "@/types";
import {
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Target,
  Percent,
  Layers,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
} from "lucide-react";

export default function OrdersHistoryPage() {
  const {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    clearOrders,
  } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [symbolFilter, setSymbolFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // CRUD Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<TradeOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<TradeOrder | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Form State for Add Order
  const [formSymbol, setFormSymbol] = useState("XAUUSDm");
  const [formType, setFormType] = useState<TradeOrder["type"]>("BUY");
  const [formLots, setFormLots] = useState("0.05");
  const [formEntryPrice, setFormEntryPrice] = useState("2680.10");
  const [formClosePrice, setFormClosePrice] = useState("2692.50");
  const [formProfit, setFormProfit] = useState("62.00");
  const [formStrategy, setFormStrategy] = useState("EA-Nevan Scalper Pro");
  const [formStatus, setFormStatus] = useState<TradeOrder["status"]>("closed");
  const [formError, setFormError] = useState<string | null>(null);

  // Form State for Edit Order
  const [editProfit, setEditProfit] = useState("");
  const [editClosePrice, setEditClosePrice] = useState("");
  const [editStrategy, setEditStrategy] = useState("");
  const [editStatus, setEditStatus] = useState<TradeOrder["status"]>("closed");

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormSymbol("XAUUSDm");
    setFormType("BUY");
    setFormLots("0.05");
    setFormEntryPrice("2680.10");
    setFormClosePrice("2692.50");
    setFormProfit("62.00");
    setFormStrategy("EA-Nevan Scalper Pro");
    setFormStatus("closed");
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Handle Add Order Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lots = parseFloat(formLots);
    const entry = parseFloat(formEntryPrice);
    const close = parseFloat(formClosePrice);
    const profit = parseFloat(formProfit);

    if (!lots || lots <= 0) {
      setFormError("Ukuran lot harus lebih besar dari 0.");
      return;
    }

    const created = addOrder({
      symbol: formSymbol,
      type: formType,
      lots,
      entryPrice: entry,
      closePrice: isNaN(close) ? null : close,
      profit: isNaN(profit) ? 0 : profit,
      strategy: formStrategy,
      status: formStatus,
    });

    setIsAddModalOpen(false);
    showToast(`Order #${created.ticket} (${created.symbol}) berhasil ditambahkan ke riwayat.`);
  };

  // Open Edit Modal
  const handleOpenEdit = (ord: TradeOrder) => {
    setEditingOrder(ord);
    setEditProfit(String(ord.profit));
    setEditClosePrice(ord.closePrice ? String(ord.closePrice) : "");
    setEditStrategy(ord.strategy);
    setEditStatus(ord.status);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    const profit = parseFloat(editProfit);
    const close = parseFloat(editClosePrice);

    updateOrder(editingOrder.ticket, {
      profit: isNaN(profit) ? editingOrder.profit : profit,
      closePrice: isNaN(close) ? editingOrder.closePrice : close,
      strategy: editStrategy,
      status: editStatus,
    });

    setEditingOrder(null);
    showToast(`Order #${editingOrder.ticket} berhasil diperbarui.`);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deletingOrder) return;
    deleteOrder(deletingOrder.ticket);
    showToast(`Order #${deletingOrder.ticket} telah dihapus dari riwayat.`);
    setDeletingOrder(null);
  };

  // Handle Clear All
  const handleConfirmClearAll = () => {
    clearOrders();
    setIsClearModalOpen(false);
    showToast("Seluruh riwayat transaksi telah dibersihkan.");
  };

  // Filter & Search
  const filteredTrades = useMemo(() => {
    return orders.filter((t) => {
      const matchesStatus =
        statusFilter === "all" ? true : t.status === statusFilter;
      const matchesSymbol =
        symbolFilter === "ALL" ? true : t.symbol === symbolFilter;
      const matchesSearch =
        t.ticket.includes(searchQuery) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.strategy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSymbol && matchesSearch;
    });
  }, [orders, statusFilter, symbolFilter, searchQuery]);

  // Derived Analytics KPIs
  const totalTrades = filteredTrades.length;
  const closedTrades = filteredTrades.filter((t) => t.status === "closed");
  const winningTrades = closedTrades.filter((t) => t.profit > 0);
  const totalProfit = closedTrades.reduce((acc, t) => acc + t.profit, 0);
  const winRate =
    closedTrades.length > 0
      ? (winningTrades.length / closedTrades.length) * 100
      : 0;
  const totalVolume = closedTrades.reduce((acc, t) => acc + t.lots, 0);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTrades.length / pageSize));
  const paginatedTrades = filteredTrades.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Ticket",
      "Symbol",
      "Type",
      "Lots",
      "Entry Price",
      "Close Price",
      "Net Profit",
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
      t.closePrice ?? "",
      t.profit,
      t.openTime,
      t.closeTime ?? "",
      t.strategy,
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
    showToast("Ekspor CSV transaksi berhasil diunduh.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Orders & History"
        subtitle="Riwayat Transaksi Tertutup, Order MT5, & Catatan Performa Robot EA-Nevan"
      >
        <NeoButton
          variant="secondary"
          size="sm"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Tambah Trade
        </NeoButton>
        <NeoButton
          variant="outline"
          size="sm"
          onClick={exportCSV}
          className="flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
          Ekspor CSV
        </NeoButton>
      </PageHeader>

      {/* Toast Notification */}
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
              Total Transaksi
            </p>
            <Layers className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
            {totalTrades}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            {winningTrades.length} Win / {closedTrades.length - winningTrades.length} Loss
          </p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Net Realized P/L
            </p>
            <DollarSign className="w-4 h-4 text-[#00B843] dark:text-[#74FF44]" />
          </div>
          <p className={cn("text-2xl font-mono font-bold", getPnLColor(totalProfit))}>
            {formatPnL(totalProfit)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Kumulatif Keuntungan
          </p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Win Rate
            </p>
            <Percent className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#00B843] dark:text-[#74FF44]">
            {formatNumber(winRate, 1)}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Akurasi EA & Manual
          </p>
        </NeoCard>

        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Volume Ditransaksikan
            </p>
            <Target className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
            {formatNumber(totalVolume, 2)} Lot
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Total Turnover
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari ticket, simbol, strategi..."
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF] dark:focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#F9FAFB] dark:bg-[#07152F] p-1 border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
              {["all", "closed", "open", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-2 py-1 text-xs font-heading font-bold rounded capitalize transition-colors",
                    statusFilter === status
                      ? "bg-[#00E5FF] text-[#050505]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={symbolFilter}
              onChange={(e) => {
                setSymbolFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md font-heading font-bold focus:outline-none"
            >
              <option value="ALL">Semua Simbol</option>
              <option value="XAUUSDm">XAUUSDm</option>
              <option value="EURUSD">EURUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="USDJPY">USDJPY</option>
            </select>

            {orders.length > 0 && (
              <button
                onClick={() => setIsClearModalOpen(true)}
                title="Bersihkan Semua Riwayat"
                className="px-2.5 py-1.5 bg-white dark:bg-[#07152F] text-[#FF4B57] hover:bg-[#FF4B57]/10 text-xs font-heading font-bold border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bersihkan</span>
              </button>
            )}
          </div>
        </div>
      </NeoCard>

      {/* Trades Table */}
      <NeoCard className="p-0 overflow-hidden">
        <div className="p-4 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Buku Log Transaksi MT5
            </h3>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono font-bold">
            {filteredTrades.length} Catatan
          </span>
        </div>

        {filteredTrades.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Layers className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="font-heading font-bold text-[#050505] dark:text-white">Tidak ada data transaksi</p>
            <p className="text-xs text-gray-500 mt-1 mb-4">Tambahkan catatan transaksi secara manual atau tutup posisi terbuka.</p>
            <NeoButton size="sm" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1 inline" /> Tambah Trade Baru
            </NeoButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="neo-table">
              <thead>
                <tr>
                  <th className="text-left">Ticket</th>
                  <th className="text-left">Symbol</th>
                  <th className="text-center">Side</th>
                  <th className="text-right">Lots</th>
                  <th className="text-right">Harga Entry</th>
                  <th className="text-right">Harga Tutup</th>
                  <th className="text-right">Net Profit</th>
                  <th className="text-left">Waktu Buka / Tutup</th>
                  <th className="text-left">Strategi / Bot</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrades.map((t) => (
                  <tr key={t.ticket} className="hover:bg-gray-50 dark:hover:bg-[#07152F]/40 transition-colors">
                    <td className="font-mono text-xs font-bold text-gray-600 dark:text-gray-400">
                      #{t.ticket}
                    </td>
                    <td className="font-heading font-bold text-[#050505] dark:text-white">
                      {t.symbol}
                    </td>
                    <td className="text-center">
                      <NeoBadge variant={t.type === "BUY" ? "success" : "danger"}>
                        {t.type}
                      </NeoBadge>
                    </td>
                    <td className="text-right font-mono font-bold text-[#050505] dark:text-white">
                      {t.lots.toFixed(2)}
                    </td>
                    <td className="text-right font-mono text-gray-700 dark:text-gray-300">
                      {t.entryPrice.toFixed(4)}
                    </td>
                    <td className="text-right font-mono text-[#050505] dark:text-white font-bold">
                      {t.closePrice ? t.closePrice.toFixed(4) : "—"}
                    </td>
                    <td className={cn("text-right font-mono font-bold text-sm", getPnLColor(t.profit))}>
                      {formatPnL(t.profit)}
                    </td>
                    <td className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      <div>Buka: {formatDate(t.openTime)}</div>
                      {t.closeTime && <div className="text-[10px] text-gray-500">Tutup: {formatDate(t.closeTime)}</div>}
                    </td>
                    <td className="text-xs text-gray-700 dark:text-gray-300 max-w-[140px] truncate font-medium">
                      {t.strategy}
                    </td>
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
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          title="Edit Catatan Trade"
                          className="p-1 text-gray-700 dark:text-gray-300 hover:text-[#1746FF] hover:bg-gray-100 dark:hover:bg-[#07152F] border border-[#050505] rounded shadow-[1px_1px_0px_#050505]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingOrder(t)}
                          title="Hapus Trade"
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
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex items-center justify-between">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Menampilkan {filteredTrades.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} s/d{" "}
            {Math.min(currentPage * pageSize, filteredTrades.length)} dari{" "}
            {filteredTrades.length} transaksi
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-[#132D5E]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-[#132D5E]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </NeoCard>

      {/* ─── MODAL 1: TAMBAH TRADE BARU (CREATE) ───────────── */}
      <NeoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Catatan Trade Riwayat"
        subtitle="Catat transaksi tertutup secara manual untuk audit performa"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
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
                onChange={(e) => setFormSymbol(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="XAUUSDm">XAUUSDm</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="BTCUSD">BTCUSD</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Tipe Order
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as TradeOrder["type"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="BUY_LIMIT">BUY_LIMIT</option>
                <option value="SELL_LIMIT">SELL_LIMIT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Lot
              </label>
              <input
                type="number"
                step="0.01"
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

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Harga Tutup
              </label>
              <input
                type="number"
                step="0.0001"
                value={formClosePrice}
                onChange={(e) => setFormClosePrice(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Net Profit / Loss ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formProfit}
                onChange={(e) => setFormProfit(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as TradeOrder["status"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="closed">Closed (Selesai)</option>
                <option value="open">Open (Berjalan)</option>
                <option value="cancelled">Cancelled (Dibatalkan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Strategi / Catatan
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
              Simpan Trade
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 2: EDIT TRADE (UPDATE) ─────────────────── */}
      <NeoModal
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        title="Edit Catatan Transaksi"
        subtitle={`Perbarui nilai untuk Order #${editingOrder?.ticket}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="p-2.5 bg-gray-100 dark:bg-[#07152F] border-2 border-[#050505] rounded text-xs font-mono flex items-center justify-between">
            <span>{editingOrder?.symbol} ({editingOrder?.type}) - {editingOrder?.lots} Lot</span>
            <span>Entry: {editingOrder?.entryPrice}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Net Profit / Loss ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={editProfit}
                onChange={(e) => setEditProfit(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Harga Penutupan
              </label>
              <input
                type="number"
                step="0.0001"
                value={editClosePrice}
                onChange={(e) => setEditClosePrice(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Strategi
              </label>
              <input
                type="text"
                value={editStrategy}
                onChange={(e) => setEditStrategy(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as TradeOrder["status"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="closed">Closed</option>
                <option value="open">Open</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingOrder(null)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Perbarui Trade
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 3: DELETE TRADE ────────────────────────── */}
      <NeoModal
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        title="Hapus Catatan Trade"
        subtitle="Tindakan ini akan menghapus riwayat trade dari buku log"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus order{" "}
            <strong>#{deletingOrder?.ticket} ({deletingOrder?.symbol})</strong> secara permanen?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingOrder(null)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
            >
              Hapus Order
            </NeoButton>
          </div>
        </div>
      </NeoModal>

      {/* ─── MODAL 4: CLEAR ALL TRADES ────────────────────── */}
      <NeoModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Bersihkan Seluruh Riwayat"
        subtitle="Hapus seluruh transaksi dari tabel riwayat"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Semua catatan trade ({orders.length} order) akan dihapus. Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsClearModalOpen(false)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmClearAll}
            >
              Bersihkan Semua
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
