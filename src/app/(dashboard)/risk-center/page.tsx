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
  formatDate,
  cn,
} from "@/lib/utils";
import { api } from "@/services/api";
import type { RiskMetrics, RiskEvent } from "@/types";
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  AlertTriangle,
  Flame,
  PieChart,
  Sliders,
  BellRing,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Percent,
  Layers,
  ArrowRight,
  TrendingDown,
  Lock,
} from "lucide-react";

export default function RiskCenterPage() {
  const [risk, setRisk] = useState<RiskMetrics | null>(null);
  const [events, setEvents] = useState<RiskEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  const fetchRiskData = async () => {
    setLoading(true);
    try {
      const [r, ev] = await Promise.all([
        api.getRiskMetrics(),
        api.getRiskEvents(),
      ]);
      setRisk(r);
      setEvents(ev);
    } catch (err) {
      console.error("Failed to load risk data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, []);

  const handleToggleEquityShield = () => {
    setSimulatedNotice("Status Equity Shield (90%) disimulasikan dalam DEMO MODE.");
    setTimeout(() => setSimulatedNotice(null), 4000);
  };

  if (loading || !risk) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Risk Center"
          subtitle="Pemantauan Risiko Real-Time & Guardrails Modal EA-Nevan"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NeoCard key={i} className="p-6">
              <Skeleton className="h-20 w-full" />
            </NeoCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Center"
        subtitle="Sistem Proteksi Modal Institusional & Guardrail Risiko EA-Nevan (Exness MT5)"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={fetchRiskData}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </NeoButton>
        <NeoBadge variant={risk.riskStatus === "SAFE" ? "success" : "danger"}>
          SYSTEM {risk.riskStatus}
        </NeoBadge>
      </PageHeader>

      {/* Simulated Notification */}
      {simulatedNotice && (
        <div className="p-3 bg-[#00E5FF]/20 border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md text-xs font-heading font-bold text-[#050505] dark:text-white">
          {simulatedNotice}
        </div>
      )}

      {/* Global Status Banner */}
      <div
        className={cn(
          "p-4 border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
          risk.riskStatus === "SAFE"
            ? "bg-[#00B843]/15 dark:bg-[#74FF44]/15"
            : "bg-[#FF4B57]/15 dark:bg-[#FF4B57]/20"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center shrink-0",
              risk.riskStatus === "SAFE" ? "bg-[#74FF44]" : "bg-[#FF4B57]"
            )}
          >
            {risk.riskStatus === "SAFE" ? (
              <ShieldCheck className="w-7 h-7 text-[#050505]" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-white animate-bounce" />
            )}
          </div>
          <div>
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Status Guardrail Modal: {risk.riskStatus}
            </h3>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed">
              {risk.riskStatus === "SAFE"
                ? "Semua parameter risiko (Equity Shield 90%, Margin Level > 500%, Max Loss 0.5%) berada dalam batas aman. Trading EA diizinkan."
                : "Peringatan risiko terdeteksi! Proteksi pembatasan transaksi otomatis aktif."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEquityShield}
            className="neo-btn px-4 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-heading font-bold rounded-md flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
            Equity Shield (90%): {risk.equityShield ? "AKTIF" : "NONAKTIF"}
          </button>
        </div>
      </div>

      {/* 6 Core Risk Guardrail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Drawdown Monitor */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Drawdown Monitor
            </span>
            <NeoBadge variant={risk.currentDrawdown > 5 ? "danger" : "success"}>
              {risk.currentDrawdown}% DD
            </NeoBadge>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
              {risk.currentDrawdown.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
              Puncak: {risk.maxDrawdown.toFixed(2)}% / Stop: 10%
            </p>
          </div>
          <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-3 rounded-full overflow-hidden border-2 border-[#050505]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                risk.currentDrawdown > 7
                  ? "bg-[#FF4B57]"
                  : risk.currentDrawdown > 4
                  ? "bg-[#FFE600]"
                  : "bg-[#00B843] dark:bg-[#74FF44]"
              )}
              style={{ width: `${(risk.currentDrawdown / 10) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-2">
            Ambang batas peringatan pada 5.0% DD
          </p>
        </NeoCard>

        {/* 2. Daily Loss Limit */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Batas Kerugian Harian (0.5%)
            </span>
            <NeoBadge variant="info">
              {((risk.maxDailyLoss / risk.maxDailyLossLimit) * 100).toFixed(0)}% Terpakai
            </NeoBadge>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
              {formatCurrency(risk.maxDailyLoss)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
              Limit: {formatCurrency(risk.maxDailyLossLimit)}
            </p>
          </div>
          <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-3 rounded-full overflow-hidden border-2 border-[#050505]">
            <div
              className="h-full rounded-full bg-[#1746FF] dark:bg-[#00E5FF] transition-all duration-500"
              style={{
                width: `${Math.min((risk.maxDailyLoss / risk.maxDailyLossLimit) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-2">
            Reset otomatis pada 00:00 Waktu Server MT5
          </p>
        </NeoCard>

        {/* 3. Margin Level Alert */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Margin Level Buffer
            </span>
            <NeoBadge variant={risk.marginLevel < 500 ? "danger" : "success"}>
              HEALTHY (&gt;500%)
            </NeoBadge>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-mono font-bold text-[#00B843] dark:text-[#74FF44]">
              {risk.marginLevel.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
              Trigger Alert: {risk.marginLevelAlert}%
            </p>
          </div>
          <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-3 rounded-full overflow-hidden border-2 border-[#050505]">
            <div
              className="h-full rounded-full bg-[#00B843] dark:bg-[#74FF44] transition-all duration-500"
              style={{ width: `${Math.min((risk.marginLevel / 1500) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-2">
            Buffer keamanan di atas rasio batas minimum broker Exness
          </p>
        </NeoCard>

        {/* 4. Open Positions Cap */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Kapasitas Transaksi Terbuka
            </span>
            <span className="text-xs font-mono font-bold text-[#050505] dark:text-white">
              {risk.currentOpenPositions} / {risk.maxOpenPositions} Maks
            </span>
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white mb-1">
            {risk.currentOpenPositions} Order Aktif
          </p>
          <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-3 rounded-full overflow-hidden border-2 border-[#050505]">
            <div
              className="h-full rounded-full bg-[#FFE600] transition-all duration-500"
              style={{
                width: `${(risk.currentOpenPositions / risk.maxOpenPositions) * 100}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-2">
            Sisa slot sebelum pembatasan entri otomatis
          </p>
        </NeoCard>

        {/* 5. Max Risk Per Trade */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Risiko Per Satu Transaksi
            </span>
            <NeoBadge variant="info">Enforced</NeoBadge>
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white mb-1">
            {risk.currentRiskPerTrade}%
          </p>
          <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-3 rounded-full overflow-hidden border-2 border-[#050505]">
            <div
              className="h-full rounded-full bg-[#1746FF] transition-all duration-500"
              style={{
                width: `${(risk.currentRiskPerTrade / risk.maxRiskPerTrade) * 100}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-2">
            Batas modal: maks {risk.maxRiskPerTrade}% equity per trade
          </p>
        </NeoCard>

        {/* 6. Consecutive Loss Circuit Breaker */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Circuit Breaker Kekalahan Beruntun
            </span>
            <NeoBadge variant="success">Normal (0/2)</NeoBadge>
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white mb-1">
            {risk.consecutiveLosses} / {risk.maxConsecutiveLosses} Loss Streak
          </p>
          <div className="flex gap-1.5 mt-2">
            {Array.from({ length: risk.maxConsecutiveLosses }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-3 rounded-sm border-2 border-[#050505]",
                  i < risk.consecutiveLosses ? "bg-[#FF4B57]" : "bg-[#E5E7EB] dark:bg-[#07152F]"
                )}
              />
            ))}
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-2">
            2 kali loss berturut-turut memicu jeda trading 24 jam (Aturan EA-Nevan)
          </p>
        </NeoCard>
      </div>

      {/* Exposure Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exposure by Symbol */}
        <NeoCard className="p-5">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#050505] pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
              <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
                Eksposur Modal Berdasarkan Simbol
              </h3>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-mono font-bold">Total: $42,600</span>
          </div>

          <div className="space-y-3">
            {risk.exposureBySymbol.map((exp) => (
              <div key={exp.symbol} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-bold text-[#050505] dark:text-white">
                    {exp.symbol}
                  </span>
                  <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">
                    {formatCurrency(exp.exposure)} ({exp.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-3 rounded-full overflow-hidden border-2 border-[#050505]">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      exp.symbol === "XAUUSD"
                        ? "bg-[#FFE600]"
                        : exp.symbol === "EURUSD"
                        ? "bg-[#00E5FF]"
                        : exp.symbol === "USDJPY"
                        ? "bg-[#1746FF]"
                        : "bg-[#00B843] dark:bg-[#74FF44]"
                    )}
                    style={{ width: `${exp.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </NeoCard>

        {/* Exposure by Direction (Long vs Short) */}
        <NeoCard className="p-5">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#050505] pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00B843] dark:text-[#74FF44]" />
              <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
                Alokasi Arah Posisi (BUY vs SELL)
              </h3>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-bold">Net Bias: Bullish</span>
          </div>

          <div className="p-4 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md mb-4 text-center shadow-[2px_2px_0px_#050505]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-heading font-bold">LONG (BUY)</p>
                <p className="text-2xl font-heading font-bold text-[#00B843] dark:text-[#74FF44]">67%</p>
                <p className="text-xs font-mono text-gray-500">$28,800</p>
              </div>
              <div className="border-l-2 border-[#050505]">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-heading font-bold">SHORT (SELL)</p>
                <p className="text-2xl font-heading font-bold text-[#FF3B30] dark:text-[#FF4B57]">33%</p>
                <p className="text-xs font-mono text-gray-500">$14,400</p>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-4 rounded-full overflow-hidden flex border-2 border-[#050505]">
            <div className="bg-[#00B843] dark:bg-[#74FF44] h-full" style={{ width: "67%" }} title="Long 67%" />
            <div className="bg-[#FF4B57] h-full" style={{ width: "33%" }} title="Short 33%" />
          </div>

          <div className="flex justify-between items-center text-xs mt-2 text-gray-600 dark:text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#00B843] dark:bg-[#74FF44] rounded-sm border border-[#050505]" /> Posisi BUY (Long)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#FF4B57] rounded-sm border border-[#050505]" /> Posisi SELL (Short)
            </span>
          </div>
        </NeoCard>
      </div>

      {/* Risk Event Log */}
      <NeoCard className="p-0 overflow-hidden">
        <div className="p-4 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#1746FF] dark:text-[#FFE600]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Riwayat Kejadian Risiko & Audit Sistem
            </h3>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono font-bold">
            {events.length} Peristiwa Tercatat
          </span>
        </div>

        <div className="divide-y-2 divide-[#050505]">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-[#07152F]/40 transition-colors">
              <div className="flex items-start gap-3">
                <NeoBadge
                  variant={
                    ev.severity === "CRITICAL"
                      ? "danger"
                      : ev.severity === "HIGH"
                      ? "warning"
                      : "info"
                  }
                >
                  {ev.severity}
                </NeoBadge>
                <div>
                  <p className="text-xs font-heading font-bold text-[#050505] dark:text-white">
                    {ev.message}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {ev.type} • {formatDate(ev.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {ev.resolved ? (
                  <span className="text-[10px] font-bold text-[#00B843] dark:text-[#74FF44] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Teratasi
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#FFE600] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Aktif
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </NeoCard>
    </div>
  );
}
