"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  NeoInput,
  NeoSelect,
  NeoModal,
  PageHeader,
  Skeleton,
} from "@/components/ui";
import {
  formatCurrency,
  formatNumber,
  getPnLColor,
  cn,
} from "@/lib/utils";
import { useAppStore } from "@/store";
import type { TradingAccount } from "@/types";
import {
  Landmark,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  Server,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Wallet,
  Percent,
  Scale,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";

/* ────────────────────────────────
   Account stat row
   ──────────────────────────────── */
function AccountStat({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 bg-[#F4F5F7] dark:bg-[#07152F] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider leading-none mb-0.5">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-mono font-bold truncate",
            valueClass || "text-[#050505] dark:text-white"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────
   Page Component with Full CRUD
   ──────────────────────────────── */
export default function TradingAccountsPage() {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    addAccount,
    updateAccount,
    deleteAccount,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // CRUD Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<TradingAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<TradingAccount | null>(null);

  // Form State
  const [formBroker, setFormBroker] = useState("Exness");
  const [formAccountNumber, setFormAccountNumber] = useState("");
  const [formType, setFormType] = useState<"demo" | "real">("demo");
  const [formCurrency, setFormCurrency] = useState("USD");
  const [formBalance, setFormBalance] = useState("10000");
  const [formEquity, setFormEquity] = useState("10000");
  const [formLeverage, setFormLeverage] = useState("1:500");
  const [formServer, setFormServer] = useState("Exness-MT5Trial7");
  const [formStatus, setFormStatus] = useState<"connected" | "disconnected">("connected");
  const [formError, setFormError] = useState<string | null>(null);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormBroker("Exness");
    setFormAccountNumber(String(Math.floor(10000000 + Math.random() * 90000000)));
    setFormType("demo");
    setFormCurrency("USD");
    setFormBalance("10000");
    setFormEquity("10000");
    setFormLeverage("1:500");
    setFormServer("Exness-MT5Trial7");
    setFormStatus("connected");
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (acc: TradingAccount) => {
    setEditingAccount(acc);
    setFormBroker(acc.broker);
    setFormAccountNumber(acc.accountNumber);
    setFormType(acc.type);
    setFormCurrency(acc.currency);
    setFormBalance(String(acc.balance));
    setFormEquity(String(acc.equity));
    setFormLeverage(acc.leverage);
    setFormServer(acc.server);
    setFormStatus(acc.connectionStatus === "connected" ? "connected" : "disconnected");
    setFormError(null);
  };

  // Handle Create Account Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccountNumber.trim()) {
      setFormError("Nomor akun MT5 wajib diisi.");
      return;
    }

    const bal = parseFloat(formBalance) || 0;
    const eq = parseFloat(formEquity) || bal;

    addAccount({
      broker: formBroker,
      accountNumber: formAccountNumber.trim(),
      type: formType,
      currency: formCurrency,
      balance: bal,
      equity: eq,
      floatingPnL: eq - bal,
      freeMargin: eq * 0.9,
      marginLevel: 1500,
      leverage: formLeverage,
      server: formServer,
      connectionStatus: formStatus,
    });

    setIsAddModalOpen(false);
  };

  // Handle Edit Account Submit
  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    if (!formAccountNumber.trim()) {
      setFormError("Nomor akun MT5 wajib diisi.");
      return;
    }

    const bal = parseFloat(formBalance) || 0;
    const eq = parseFloat(formEquity) || bal;

    updateAccount(editingAccount.id, {
      broker: formBroker,
      accountNumber: formAccountNumber.trim(),
      type: formType,
      currency: formCurrency,
      balance: bal,
      equity: eq,
      floatingPnL: eq - bal,
      freeMargin: eq * 0.9,
      leverage: formLeverage,
      server: formServer,
      connectionStatus: formStatus,
    });

    setEditingAccount(null);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (deletingAccount) {
      deleteAccount(deletingAccount.id);
      setDeletingAccount(null);
    }
  };

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch =
        acc.broker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.accountNumber.includes(searchQuery) ||
        acc.server.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "ALL" ? true : acc.type === typeFilter;
      const matchesStatus =
        statusFilter === "ALL" ? true : acc.connectionStatus === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, searchQuery, typeFilter, statusFilter]);

  // Mixed currency guard
  const currencies = useMemo(
    () => Array.from(new Set(accounts.map((a) => a.currency))),
    [accounts]
  );
  const hasMixedCurrencies = currencies.length > 1;

  // Aggregate metrics (only if single currency)
  const totalBalance = hasMixedCurrencies
    ? 0
    : accounts.reduce((acc, a) => acc + a.balance, 0);
  const totalEquity = hasMixedCurrencies
    ? 0
    : accounts.reduce((acc, a) => acc + a.equity, 0);
  const totalFloating = hasMixedCurrencies
    ? 0
    : accounts.reduce((acc, a) => acc + a.floatingPnL, 0);
  const connectedCount = accounts.filter(
    (a) => a.connectionStatus === "connected"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Trading Accounts"
        subtitle="Kelola & Pantau Multi Akun MT5 Broker (Exness, Finex, ICMarkets) Secara Real-Time"
      >
        <NeoButton
          variant="secondary"
          size="sm"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun MT5</span>
        </NeoButton>
      </PageHeader>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <NeoCard className="p-3.5">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-0.5">
            Total Akun MT5
          </p>
          <p className="text-xl font-heading font-bold text-[#050505] dark:text-white">
            {accounts.length} Akun
          </p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {connectedCount} Terkoneksi Aktif
          </p>
        </NeoCard>

        <NeoCard className="p-3.5">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-0.5">
            Total Balance
          </p>
          <p className="text-xl font-mono font-bold text-[#050505] dark:text-white">
            {hasMixedCurrencies ? "—" : formatCurrency(totalBalance)}
          </p>
          {hasMixedCurrencies ? (
            <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#FFE600] text-[#050505] text-[10px] font-bold border border-[#050505] rounded shadow-[1px_1px_0px_#050505]">
              Mata Uang Berbeda
            </span>
          ) : (
            <p className="text-xs text-gray-500 font-medium mt-0.5">Saldo Tersedia</p>
          )}
        </NeoCard>

        <NeoCard className="p-3.5">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-0.5">
            Total Equity
          </p>
          <p className="text-xl font-mono font-bold text-[#050505] dark:text-white">
            {hasMixedCurrencies ? "—" : formatCurrency(totalEquity)}
          </p>
          {hasMixedCurrencies ? (
            <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#FFE600] text-[#050505] text-[10px] font-bold border border-[#050505] rounded shadow-[1px_1px_0px_#050505]">
              Mata Uang Berbeda
            </span>
          ) : (
            <p className="text-xs text-[#00B843] dark:text-[#74FF44] font-medium mt-0.5">Net Worth</p>
          )}
        </NeoCard>

        <NeoCard className="p-3.5">
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-0.5">
            Total Floating P/L
          </p>
          <p
            className={cn(
              "text-xl font-mono font-bold",
              hasMixedCurrencies
                ? "text-[#050505] dark:text-white"
                : getPnLColor(totalFloating)
            )}
          >
            {hasMixedCurrencies
              ? "—"
              : `${totalFloating >= 0 ? "+" : ""}${formatCurrency(totalFloating)}`}
          </p>
          {hasMixedCurrencies ? (
            <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#FFE600] text-[#050505] text-[10px] font-bold border border-[#050505] rounded shadow-[1px_1px_0px_#050505]">
              Mata Uang Berbeda
            </span>
          ) : (
            <p className="text-xs text-gray-500 font-medium mt-0.5">Posisi Berjalan</p>
          )}
        </NeoCard>
      </div>

      {/* Mixed Currency Warning Banner */}
      {hasMixedCurrencies && (
        <div className="p-3.5 bg-[#FFFBEB] dark:bg-[#07152F] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-[#FFE600] border-2 border-[#050505] flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#050505]">
            <AlertTriangle className="w-4 h-4 text-[#050505]" />
          </div>
          <div>
            <p className="text-sm font-heading font-bold text-[#050505] dark:text-white">
              Peringatan Mata Uang Berbeda (Mixed Currency Guard)
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed">
              Akun Anda menggunakan satuan mata uang yang berbeda ({currencies.join(", ")}). Sesuai aturan fintech, saldo Standard (USD) dan Cent (USC) tidak boleh dijumlahkan secara langsung tanpa kurs konversi valid. Silakan tinjau tiap kartu akun di bawah secara individual.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <NeoCard className="p-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari berdasarkan Broker, Nomor Akun, atau Server..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505] font-heading font-bold focus:outline-none"
            >
              <option value="ALL">Semua Tipe (Demo/Real)</option>
              <option value="demo">Demo Only</option>
              <option value="real">Real Only</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505] font-heading font-bold focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="connected">Connected</option>
              <option value="disconnected">Disconnected</option>
            </select>
          </div>
        </div>
      </NeoCard>

      {/* Account Cards Grid */}
      {filteredAccounts.length === 0 ? (
        <NeoCard className="p-12 text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-[#050505] dark:text-white mb-1">
            Tidak Ada Akun Ditemukan
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Coba ubah kata kunci pencarian atau tambahkan akun trading MT5 baru Anda.
          </p>
          <NeoButton size="sm" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 mr-1 inline" /> Tambah Akun Baru
          </NeoButton>
        </NeoCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAccounts.map((acc) => {
            const isConnected = acc.connectionStatus === "connected";
            const isSelected = selectedAccount === acc.id;

            return (
              <NeoCard
                key={acc.id}
                className={cn(
                  "p-0 overflow-hidden relative",
                  isSelected && "ring-3 ring-[#1746FF] dark:ring-[#00E5FF]"
                )}
                hover
              >
                {/* Header */}
                <div className="p-4 pb-3 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center">
                      <Landmark className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-bold text-[#050505] dark:text-white text-sm leading-tight">
                          {acc.broker}
                        </h3>
                        {isSelected && (
                          <span className="text-[9px] bg-[#1746FF] text-white px-1.5 py-0.2 rounded font-mono font-bold">
                            AKTIF
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono font-bold">
                        #{acc.accountNumber} ({acc.currency})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <NeoBadge variant={acc.type === "real" ? "success" : "warning"}>
                      {acc.type.toUpperCase()}
                    </NeoBadge>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">
                  <AccountStat
                    icon={DollarSign}
                    label="Balance"
                    value={formatCurrency(acc.balance, acc.currency)}
                  />
                  <AccountStat
                    icon={Wallet}
                    label="Equity"
                    value={formatCurrency(acc.equity, acc.currency)}
                    valueClass={
                      acc.equity >= acc.balance
                        ? "text-[#00B843] dark:text-[#74FF44]"
                        : "text-[#FF3B30] dark:text-[#FF4B57]"
                    }
                  />
                  <AccountStat
                    icon={acc.floatingPnL >= 0 ? TrendingUp : TrendingDown}
                    label="Floating P/L"
                    value={`${acc.floatingPnL >= 0 ? "+" : ""}${formatCurrency(acc.floatingPnL, acc.currency)}`}
                    valueClass={getPnLColor(acc.floatingPnL)}
                  />
                  <AccountStat
                    icon={Shield}
                    label="Free Margin"
                    value={formatCurrency(acc.freeMargin, acc.currency)}
                  />
                  <AccountStat
                    icon={Percent}
                    label="Margin Level"
                    value={`${formatNumber(acc.marginLevel, 1)}%`}
                    valueClass={
                      acc.marginLevel > 500
                        ? "text-[#00B843] dark:text-[#74FF44]"
                        : acc.marginLevel > 200
                          ? "text-[#D97706] dark:text-[#FFE600]"
                          : "text-[#FF3B30] dark:text-[#FF4B57]"
                    }
                  />
                  <AccountStat
                    icon={Scale}
                    label="Leverage"
                    value={acc.leverage}
                  />
                </div>

                {/* Footer Controls & CRUD Actions */}
                <div className="px-4 py-2.5 border-t-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F]/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isConnected ? (
                      <Wifi className="w-3.5 h-3.5 text-[#00B843] dark:text-[#74FF44] shrink-0" />
                    ) : (
                      <WifiOff className="w-3.5 h-3.5 text-[#FF3B30] dark:text-[#FF4B57] shrink-0" />
                    )}
                    <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 truncate">
                      {acc.server}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!isSelected && (
                      <button
                        onClick={() => setSelectedAccount(acc.id)}
                        title="Pilih sebagai akun aktif"
                        className="px-2 py-1 text-[10px] font-heading font-bold bg-white dark:bg-[#07152F] hover:bg-gray-100 border border-[#050505] rounded shadow-[1px_1px_0px_#050505] text-[#050505] dark:text-white"
                      >
                        Pilih
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEdit(acc)}
                      title="Edit Akun"
                      className="p-1.5 text-gray-700 dark:text-gray-300 hover:text-[#1746FF] hover:bg-gray-100 dark:hover:bg-[#07152F] border border-[#050505] rounded shadow-[1px_1px_0px_#050505]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingAccount(acc)}
                      title="Hapus / Putus Akun"
                      className="p-1.5 text-gray-700 dark:text-gray-300 hover:text-[#FF4B57] hover:bg-gray-100 dark:hover:bg-[#07152F] border border-[#050505] rounded shadow-[1px_1px_0px_#050505]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </NeoCard>
            );
          })}
        </div>
      )}

      {/* ─── MODAL 1: CREATE ACCOUNT ──────────────────────── */}
      <NeoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Akun MT5 Baru"
        subtitle="Daftarkan akun broker MT5 (Demo / Real) ke dalam dashboard monitoring"
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
                Broker
              </label>
              <select
                value={formBroker}
                onChange={(e) => {
                  setFormBroker(e.target.value);
                  if (e.target.value === "Exness") setFormServer("Exness-MT5Trial7");
                  if (e.target.value === "Finex") setFormServer("Finex-MT5Demo");
                  if (e.target.value === "ICMarkets") setFormServer("ICMarkets-MT5-Demo");
                }}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="Exness">Exness</option>
                <option value="Finex">Finex</option>
                <option value="ICMarkets">IC Markets</option>
                <option value="OctaFX">OctaFX</option>
                <option value="Custom Broker">Custom Broker</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Tipe Akun
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as "demo" | "real")}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="demo">DEMO</option>
                <option value="real">REAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Nomor Akun MT5
              </label>
              <input
                type="text"
                value={formAccountNumber}
                onChange={(e) => setFormAccountNumber(e.target.value)}
                placeholder="Contoh: 71024589"
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Mata Uang
              </label>
              <select
                value={formCurrency}
                onChange={(e) => setFormCurrency(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="USD">USD ($)</option>
                <option value="USC">USC (Cent)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="IDR">IDR (Rp)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Server MT5
              </label>
              <input
                type="text"
                value={formServer}
                onChange={(e) => setFormServer(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Leverage
              </label>
              <select
                value={formLeverage}
                onChange={(e) => setFormLeverage(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="1:100">1:100</option>
                <option value="1:200">1:200</option>
                <option value="1:500">1:500</option>
                <option value="1:1000">1:1000</option>
                <option value="1:2000">1:2000</option>
                <option value="1:Unlimited">1:Unlimited</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Balance Awal
              </label>
              <input
                type="number"
                step="0.01"
                value={formBalance}
                onChange={(e) => setFormBalance(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Equity Awal
              </label>
              <input
                type="number"
                step="0.01"
                value={formEquity}
                onChange={(e) => setFormEquity(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>
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
              Simpan & Hubungkan
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 2: EDIT ACCOUNT ────────────────────────── */}
      <NeoModal
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        title="Edit Akun Trading MT5"
        subtitle={`Perbarui parameter untuk Akun #${editingAccount?.accountNumber}`}
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          {formError && (
            <div className="p-2.5 bg-[#FF4B57]/15 border-2 border-[#FF4B57] rounded text-xs font-bold text-[#FF4B57]">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Broker
              </label>
              <input
                type="text"
                value={formBroker}
                onChange={(e) => setFormBroker(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Status Koneksi
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as "connected" | "disconnected")}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="connected">Connected (Terhubung)</option>
                <option value="disconnected">Disconnected (Terputus)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Nomor Akun
              </label>
              <input
                type="text"
                value={formAccountNumber}
                onChange={(e) => setFormAccountNumber(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Leverage
              </label>
              <input
                type="text"
                value={formLeverage}
                onChange={(e) => setFormLeverage(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Balance
              </label>
              <input
                type="number"
                step="0.01"
                value={formBalance}
                onChange={(e) => setFormBalance(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Equity
              </label>
              <input
                type="number"
                step="0.01"
                value={formEquity}
                onChange={(e) => setFormEquity(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingAccount(null)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Perbarui Akun
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 3: DELETE CONFIRMATION ─────────────────── */}
      <NeoModal
        isOpen={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        title="Konfirmasi Hapus Akun"
        subtitle="Tindakan ini akan menghapus akun dari dashboard"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            Apakah Anda yakin ingin menghapus akun{" "}
            <strong>
              #{deletingAccount?.accountNumber} ({deletingAccount?.broker})
            </strong>{" "}
            dari dashboard GOLDSHIELD AI?
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingAccount(null)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
            >
              Ya, Hapus Akun
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
