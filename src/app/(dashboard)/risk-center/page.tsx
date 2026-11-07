"use client";

import React, { useState } from "react";
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
  formatPercent,
  formatDate,
  cn,
} from "@/lib/utils";
import { useAppStore } from "@/store";
import type { RiskEvent, RiskMetrics } from "@/types";
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
  Percent,
  Layers,
  ArrowRight,
  TrendingDown,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Check,
} from "lucide-react";

export default function RiskCenterPage() {
  const {
    riskMetrics: risk,
    riskEvents: events,
    updateRiskMetrics,
    addRiskEvent,
    toggleResolveRiskEvent,
    deleteRiskEvent,
  } = useAppStore();

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // CRUD Modals
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isConfigGuardrailOpen, setIsConfigGuardrailOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<RiskEvent | null>(null);

  // Form State for Add Risk Event
  const [formEventType, setFormEventType] = useState<RiskEvent["type"]>("DRAWDOWN_ALERT");
  const [formSeverity, setFormSeverity] = useState<RiskEvent["severity"]>("HIGH");
  const [formMessage, setFormMessage] = useState("Drawdown sementara mencapai 3.4% pada pasangan XAUUSDm saat volatilitas tinggi.");

  // Form State for Guardrails Config
  const [cfgMaxDrawdown, setCfgMaxDrawdown] = useState(String(risk.maxDrawdown));
  const [cfgMaxDailyLoss, setCfgMaxDailyLoss] = useState(String(risk.maxDailyLossLimit));
  const [cfgMarginAlert, setCfgMarginAlert] = useState(String(risk.marginLevelAlert));
  const [cfgConsecutiveLoss, setCfgConsecutiveLoss] = useState(String(risk.maxConsecutiveLosses));
  const [cfgEquityShield, setCfgEquityShield] = useState(risk.equityShield);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Handle Add Risk Event Submit
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMessage.trim()) return;

    addRiskEvent({
      type: formEventType,
      severity: formSeverity,
      message: formMessage.trim(),
      resolved: false,
    });

    setIsAddEventOpen(false);
    showToast("Event risiko berhasil dicatat ke dalam audit trail.");
  };

  // Open Config Guardrails Modal
  const handleOpenConfig = () => {
    setCfgMaxDrawdown(String(risk.maxDrawdown));
    setCfgMaxDailyLoss(String(risk.maxDailyLossLimit));
    setCfgMarginAlert(String(risk.marginLevelAlert));
    setCfgConsecutiveLoss(String(risk.maxConsecutiveLosses));
    setCfgEquityShield(risk.equityShield);
    setIsConfigGuardrailOpen(true);
  };

  // Handle Guardrails Submit
  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxDD = parseFloat(cfgMaxDrawdown) || risk.maxDrawdown;
    const maxDL = parseFloat(cfgMaxDailyLoss) || risk.maxDailyLossLimit;
    const marginLvl = parseFloat(cfgMarginAlert) || risk.marginLevelAlert;
    const consec = parseInt(cfgConsecutiveLoss, 10) || risk.maxConsecutiveLosses;

    updateRiskMetrics({
      maxDrawdown: maxDD,
      maxDailyLossLimit: maxDL,
      marginLevelAlert: marginLvl,
      maxConsecutiveLosses: consec,
      equityShield: cfgEquityShield,
    });

    setIsConfigGuardrailOpen(false);
    showToast("Batas parameter risiko institusional berhasil diperbarui.");
  };

  // Handle Confirm Delete Event
  const handleConfirmDeleteEvent = () => {
    if (!deletingEvent) return;
    deleteRiskEvent(deletingEvent.id);
    showToast("Event risiko telah dihapus dari log.");
    setDeletingEvent(null);
  };

  // Handle Toggle Resolve
  const handleToggleResolve = (ev: RiskEvent) => {
    toggleResolveRiskEvent(ev.id);
    showToast(
      ev.resolved
        ? `Event #${ev.id} ditandai sebagai AKTIF kembali.`
        : `Event #${ev.id} ditandai sebagai TERATASI.`
    );
  };

  const isCritical = risk.riskStatus === "CRITICAL";
  const isDanger = risk.riskStatus === "DANGER";
  const isWarning = risk.riskStatus === "WARNING";

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Risk Center"
        subtitle="Sistem Proteksi Modal Institusional & Guardrail Risiko EA-Nevan (Exness MT5)"
      >
        <NeoButton
          variant="secondary"
          size="sm"
          onClick={() => setIsAddEventOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Event Risiko</span>
        </NeoButton>
        <NeoButton
          variant="outline"
          size="sm"
          onClick={handleOpenConfig}
          className="flex items-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
          <span>Konfigurasi Guardrail</span>
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

      {/* Primary Risk Status Alert Box */}
      <div
        className={cn(
          "p-4 border-2 border-[#050505] rounded-md shadow-[4px_4px_0px_#050505] transition-all",
          isCritical
            ? "bg-[#FF4B57]/20 border-[#FF4B57]"
            : isDanger
            ? "bg-[#FF3B30]/20"
            : isWarning
            ? "bg-[#FFE600]/20"
            : "bg-[#00B843]/15"
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center shrink-0",
                isCritical || isDanger
                  ? "bg-[#FF4B57] text-white"
                  : isWarning
                  ? "bg-[#FFE600] text-[#050505]"
                  : "bg-[#74FF44] text-[#050505]"
              )}
            >
              {isCritical || isDanger ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-[#050505] dark:text-white">
                  Status Risiko Portfolio: {risk.riskStatus}
                </h3>
                <NeoBadge
                  variant={
                    risk.riskStatus === "SAFE"
                      ? "success"
                      : risk.riskStatus === "WARNING"
                      ? "warning"
                      : "danger"
                  }
                >
                  {risk.riskStatus}
                </NeoBadge>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">
                {isCritical
                  ? "BAHAYA KRITIKAL: Batas drawdown telah terlampaui. Segera evaluasi posisi terbuka robot."
                  : isWarning
                  ? "PERINGATAN: Metrik risiko mendekati ambang batas toleransi harian."
                  : "Seluruh parameter modal dan proteksi akun beroperasi dalam zona hijau aman."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="text-xs font-mono font-bold text-[#050505] dark:text-white">
              Equity Shield:
            </span>
            <button
              onClick={() => {
                updateRiskMetrics({ equityShield: !risk.equityShield });
                showToast(`Equity Shield ${!risk.equityShield ? "DIAKTIFKAN" : "DINONAKTIFKAN"}.`);
              }}
              className={cn(
                "px-2.5 py-1 text-xs font-heading font-bold rounded border-2 border-[#050505] shadow-[2px_2px_0px_#050505] transition-all",
                risk.equityShield
                  ? "bg-[#74FF44] text-[#050505]"
                  : "bg-gray-200 dark:bg-[#07152F] text-gray-600 dark:text-gray-400"
              )}
            >
              {risk.equityShield ? "AKTIF (90%)" : "NONAKTIF"}
            </button>
          </div>
        </div>
      </div>

      {/* Top Risk KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Current Drawdown */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Current Drawdown
            </p>
            <TrendingDown className="w-4 h-4 text-[#FF4B57]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
            {formatPercent(risk.currentDrawdown)}
          </p>
          <div className="w-full bg-gray-200 dark:bg-[#07152F] h-2 border border-[#050505] rounded-full mt-2 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                risk.currentDrawdown > 5 ? "bg-[#FF4B57]" : risk.currentDrawdown > 3 ? "bg-[#FFE600]" : "bg-[#00B843]"
              )}
              style={{ width: `${Math.min((risk.currentDrawdown / risk.maxDrawdown) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Batas Maks: {risk.maxDrawdown}%</p>
        </NeoCard>

        {/* Daily Drawdown / Max Daily Loss */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Daily Loss Intraday
            </p>
            <Flame className="w-4 h-4 text-[#FFE600]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
            ${risk.maxDailyLoss.toFixed(2)}
          </p>
          <div className="w-full bg-gray-200 dark:bg-[#07152F] h-2 border border-[#050505] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#1746FF] dark:bg-[#00E5FF] transition-all duration-300"
              style={{ width: `${Math.min((risk.maxDailyLoss / 250) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Batas Harian: {risk.maxDailyLossLimit}% Modal</p>
        </NeoCard>

        {/* Margin Level */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Margin Health
            </p>
            <Percent className="w-4 h-4 text-[#00B843] dark:text-[#74FF44]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#00B843] dark:text-[#74FF44]">
            {formatNumber(risk.marginLevel, 0)}%
          </p>
          <div className="w-full bg-gray-200 dark:bg-[#07152F] h-2 border border-[#050505] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#00B843] transition-all duration-300"
              style={{ width: "95%" }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Ambang Alert: &lt; {risk.marginLevelAlert}%</p>
        </NeoCard>

        {/* Consecutive Losses */}
        <NeoCard className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Consecutive Losses
            </p>
            <Activity className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
          </div>
          <p className="text-2xl font-mono font-bold text-[#050505] dark:text-white">
            {risk.consecutiveLosses} / {risk.maxConsecutiveLosses}
          </p>
          <div className="w-full bg-gray-200 dark:bg-[#07152F] h-2 border border-[#050505] rounded-full mt-2 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                risk.consecutiveLosses >= risk.maxConsecutiveLosses ? "bg-[#FF4B57]" : "bg-[#1746FF] dark:bg-[#00E5FF]"
              )}
              style={{ width: `${(risk.consecutiveLosses / risk.maxConsecutiveLosses) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Maks 2 Loss berturut-turut</p>
        </NeoCard>
      </div>

      {/* Exposure Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exposure by Symbol */}
        <NeoCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#050505] pb-3">
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
              Paparan Modal Berdasarkan Simbol
            </h3>
            <span className="text-xs text-gray-500 font-mono font-bold">Total 100%</span>
          </div>

          <div className="space-y-3">
            {risk.exposureBySymbol.map((item) => (
              <div key={item.symbol} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-heading font-bold text-[#050505] dark:text-white">
                    {item.symbol}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-gray-500 font-bold">${item.exposure.toFixed(2)}</span>
                    <span className="font-bold text-[#1746FF] dark:text-[#00E5FF]">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-3 border-2 border-[#050505] rounded shadow-[1px_1px_0px_#050505] overflow-hidden">
                  <div
                    className="h-full bg-[#1746FF] dark:bg-[#00E5FF]"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </NeoCard>

        {/* Exposure by Direction */}
        <NeoCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#050505] pb-3">
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00B843] dark:text-[#74FF44]" />
              Paparan Arah Transaksi (Long vs Short)
            </h3>
            <span className="text-xs text-gray-500 font-mono font-bold">Balance Exposure</span>
          </div>

          <div className="space-y-4 pt-2">
            {risk.exposureByDirection.map((item) => (
              <div key={item.direction} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-heading">
                  <span className="font-bold text-[#050505] dark:text-white flex items-center gap-1.5">
                    <NeoBadge variant={item.direction === "LONG" ? "success" : "danger"}>
                      {item.direction}
                    </NeoBadge>
                  </span>
                  <span className="font-mono font-bold text-sm text-[#050505] dark:text-white">
                    {item.percentage}% ({formatCurrency(item.exposure)})
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] h-3 border-2 border-[#050505] rounded shadow-[1px_1px_0px_#050505] overflow-hidden">
                  <div
                    className={cn(
                      "h-full",
                      item.direction === "LONG" ? "bg-[#74FF44]" : "bg-[#FF4B57]"
                    )}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </NeoCard>
      </div>

      {/* Risk Event Log & CRUD Audit */}
      <NeoCard className="p-0 overflow-hidden">
        <div className="p-4 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Riwayat Kejadian Risiko & Audit Sistem
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400 font-mono font-bold">
              {events.length} Peristiwa Tercatat
            </span>
            <NeoButton size="sm" onClick={() => setIsAddEventOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1 inline" /> Catat Kejadian
            </NeoButton>
          </div>
        </div>

        <div className="divide-y-2 divide-[#050505]">
          {events.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle2 className="w-10 h-10 text-[#00B843] mx-auto mb-2" />
              <p className="font-heading font-bold text-[#050505] dark:text-white">Tidak Ada Kejadian Risiko</p>
              <p className="text-xs text-gray-500 mt-1">Audit log risiko bersih tanpa pelanggaran batas.</p>
            </div>
          ) : (
            events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-[#07152F]/40 transition-colors"
              >
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

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleToggleResolve(ev)}
                    className={cn(
                      "px-2 py-1 text-[10px] font-heading font-bold border border-[#050505] rounded shadow-[1px_1px_0px_#050505] flex items-center gap-1 transition-all",
                      ev.resolved
                        ? "bg-[#74FF44]/30 text-[#00B843] dark:text-[#74FF44]"
                        : "bg-[#FFE600]/30 text-[#D97706] dark:text-[#FFE600]"
                    )}
                  >
                    {ev.resolved ? (
                      <>
                        <Check className="w-3 h-3" /> Teratasi
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" /> Aktif (Tandai Selesai)
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setDeletingEvent(ev)}
                    title="Hapus Event"
                    className="p-1 text-gray-500 hover:text-[#FF4B57] hover:bg-gray-100 dark:hover:bg-[#07152F] border border-[#050505] rounded shadow-[1px_1px_0px_#050505]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </NeoCard>

      {/* ─── MODAL 1: CATAT EVENT RISIKO BARU (CREATE) ─────── */}
      <NeoModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        title="Catat Kejadian Risiko Manual"
        subtitle="Masukkan insiden batas risiko atau intervensi modal ke buku audit"
      >
        <form onSubmit={handleAddEventSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Kategori Event
              </label>
              <select
                value={formEventType}
                onChange={(e) => setFormEventType(e.target.value as RiskEvent["type"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="DRAWDOWN_ALERT">DRAWDOWN_ALERT</option>
                <option value="MARGIN_ALERT">MARGIN_ALERT</option>
                <option value="MAX_LOSS">MAX_LOSS</option>
                <option value="CONSECUTIVE_LOSS">CONSECUTIVE_LOSS</option>
                <option value="EQUITY_SHIELD">EQUITY_SHIELD</option>
                <option value="EXPOSURE_ALERT">EXPOSURE_ALERT</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Tingkat Keparahan
              </label>
              <select
                value={formSeverity}
                onChange={(e) => setFormSeverity(e.target.value as RiskEvent["severity"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="LOW">LOW (Rendah)</option>
                <option value="MEDIUM">MEDIUM (Menengah)</option>
                <option value="HIGH">HIGH (Tinggi)</option>
                <option value="CRITICAL">CRITICAL (Kritikal)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Deskripsi Kejadian Risiko
            </label>
            <textarea
              rows={3}
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddEventOpen(false)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Simpan Kejadian
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 2: KONFIGURASI GUARDRAIL (UPDATE) ──────── */}
      <NeoModal
        isOpen={isConfigGuardrailOpen}
        onClose={() => setIsConfigGuardrailOpen(false)}
        title="Konfigurasi Batas Risiko (Guardrails)"
        subtitle="Ubah batas toleransi drawdown, stop harian, dan margin protection"
      >
        <form onSubmit={handleConfigSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Max Drawdown (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={cfgMaxDrawdown}
                onChange={(e) => setCfgMaxDrawdown(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Max Daily Loss (% Modal)
              </label>
              <input
                type="number"
                step="0.1"
                value={cfgMaxDailyLoss}
                onChange={(e) => setCfgMaxDailyLoss(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Margin Level Alert (%)
              </label>
              <input
                type="number"
                value={cfgMarginAlert}
                onChange={(e) => setCfgMarginAlert(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Max Consecutive Losses
              </label>
              <input
                type="number"
                value={cfgConsecutiveLoss}
                onChange={(e) => setCfgConsecutiveLoss(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-gray-100 dark:bg-[#07152F] border-2 border-[#050505] rounded flex items-center justify-between">
            <div>
              <span className="text-xs font-heading font-bold text-[#050505] dark:text-white block">
                Equity Shield (90% Modal Terkunci)
              </span>
              <span className="text-[10px] text-gray-500">
                Otomatis menutup posisi dan menjeda robot bila saldo turun ke level proteksi.
              </span>
            </div>
            <input
              type="checkbox"
              checked={cfgEquityShield}
              onChange={(e) => setCfgEquityShield(e.target.checked)}
              className="w-5 h-5 accent-[#1746FF] rounded cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfigGuardrailOpen(false)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Perbarui Batas
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 3: DELETE EVENT (DELETE) ───────────────── */}
      <NeoModal
        isOpen={!!deletingEvent}
        onClose={() => setDeletingEvent(null)}
        title="Hapus Event Risiko"
        subtitle="Hapus rekaman audit insiden risiko"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus catatan risiko: <strong>"{deletingEvent?.message}"</strong>?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingEvent(null)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDeleteEvent}
            >
              Hapus Kejadian
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
