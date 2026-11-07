"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  formatDate,
  getPnLColor,
  cn,
} from "@/lib/utils";
import { api } from "@/services/api";
import type { TradingAccount } from "@/types";
import {
  Landmark,
  Hash,
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
  Zap,
} from "lucide-react";

/* ────────────────────────────────
   Loading skeleton for account cards
   ──────────────────────────────── */
function AccountCardSkeleton() {
  return (
    <NeoCard className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-24" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-40" />
      </div>
    </NeoCard>
  );
}

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
   Single Account Card
   ──────────────────────────────── */
function AccountCard({ account }: { account: TradingAccount }) {
  const isConnected = account.connectionStatus === "connected";

  return (
    <NeoCard className="p-0 overflow-hidden" hover>
      {/* Header */}
      <div className="p-4 pb-3 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center">
              <Landmark className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[#050505] dark:text-white text-sm leading-tight">
                {account.broker}
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono font-bold">
                #{account.accountNumber}
              </p>
            </div>
          </div>
          <NeoBadge
            variant={account.type === "real" ? "success" : "warning"}
          >
            {account.type.toUpperCase()}
          </NeoBadge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <AccountStat
          icon={DollarSign}
          label="Balance"
          value={formatCurrency(account.balance, account.currency)}
        />
        <AccountStat
          icon={Wallet}
          label="Equity"
          value={formatCurrency(account.equity, account.currency)}
          valueClass={
            account.equity >= account.balance
              ? "text-[#00B843] dark:text-[#74FF44]"
              : "text-[#FF3B30] dark:text-[#FF4B57]"
          }
        />
        <AccountStat
          icon={account.floatingPnL >= 0 ? TrendingUp : TrendingDown}
          label="Floating P/L"
          value={`${account.floatingPnL >= 0 ? "+" : ""}${formatCurrency(account.floatingPnL, account.currency)}`}
          valueClass={getPnLColor(account.floatingPnL)}
        />
        <AccountStat
          icon={Shield}
          label="Free Margin"
          value={formatCurrency(account.freeMargin, account.currency)}
        />
        <AccountStat
          icon={Percent}
          label="Margin Level"
          value={`${formatNumber(account.marginLevel, 1)}%`}
          valueClass={
            account.marginLevel > 500
              ? "text-[#00B843] dark:text-[#74FF44]"
              : account.marginLevel > 200
                ? "text-[#FFE600]"
                : "text-[#FF3B30] dark:text-[#FF4B57]"
          }
        />
        <AccountStat
          icon={Scale}
          label="Leverage"
          value={account.leverage}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5 text-[#00B843] dark:text-[#74FF44]" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-[#FF3B30] dark:text-[#FF4B57]" />
          )}
          <span
            className={cn(
              "text-xs font-bold font-heading",
              isConnected ? "text-[#00B843] dark:text-[#74FF44]" : "text-[#FF3B30] dark:text-[#FF4B57]"
            )}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Server className="w-3 h-3 text-gray-500" />
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono truncate max-w-[140px] font-bold">
            {account.server}
          </span>
        </div>
      </div>
    </NeoCard>
  );
}

/* ────────────────────────────────
   Page Component
   ──────────────────────────────── */
export default function TradingAccountsPage() {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAccounts();
      setAccounts(data);
    } catch {
      setError("Gagal memuat daftar akun trading.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Check for mixed currencies
  const currencies = [...new Set(accounts.map((a) => a.currency))];
  const hasMixedCurrencies = currencies.length > 1;

  // Summary stats
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = accounts.reduce((sum, a) => sum + a.equity, 0);
  const totalFloating = accounts.reduce((sum, a) => sum + a.floatingPnL, 0);
  const connectedCount = accounts.filter(
    (a) => a.connectionStatus === "connected"
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trading Accounts"
        subtitle="Pemantauan Multi-Akun MT5 (Exness Real & Demo, Finex, ICMarkets)"
      >
        <Link
          href="/login"
          className="neo-btn px-3 py-1.5 bg-[#00E5FF] hover:bg-[#00C8E0] text-[#050505] text-xs font-heading font-bold rounded-md flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Hubungkan Akun Exness Baru
        </Link>
        <NeoButton
          variant="outline"
          size="sm"
          onClick={fetchAccounts}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Refresh
        </NeoButton>
      </PageHeader>

      {/* Summary Strip */}
      {!loading && accounts.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              <p className="text-[10px] text-[#FFE600] font-bold">Mata Uang Berbeda</p>
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
              <p className="text-[10px] text-[#FFE600] font-bold">Mata Uang Berbeda</p>
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
              <p className="text-[10px] text-[#FFE600] font-bold">Mata Uang Berbeda</p>
            ) : (
              <p className="text-xs text-gray-500 font-medium mt-0.5">Posisi Berjalan</p>
            )}
          </NeoCard>
        </div>
      )}

      {/* Mixed Currency Warning */}
      {hasMixedCurrencies && !loading && (
        <div className="p-3.5 bg-[#FFE600]/15 border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#FFE600] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-heading font-bold text-[#050505] dark:text-[#FFE600]">
              Peringatan Mata Uang Berbeda (Mixed Currency Guard)
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed">
              Akun Anda menggunakan satuan mata uang yang berbeda ({currencies.join(", ")}). Sesuai aturan fintech, saldo Standard (USD) dan Cent (USC) tidak boleh dijumlahkan secara langsung tanpa kurs konversi valid. Silakan tinjau tiap kartu akun di bawah secara individual.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <NeoCard variant="danger" className="p-4">
          <p className="font-heading font-bold text-sm">{error}</p>
        </NeoCard>
      )}

      {/* Account Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <AccountCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}

      {/* Demo Label */}
      <div className="text-center pt-2">
        <NeoBadge variant="warning">DEMO DATA STREAM</NeoBadge>
        <p className="text-[10px] text-gray-500 mt-1 font-medium">
          Dukungan Penuh: Exness MT5 (Trial / Real / Cent), Finex MT5, ICMarkets
        </p>
      </div>
    </div>
  );
}
