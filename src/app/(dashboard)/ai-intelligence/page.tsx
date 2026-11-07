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
  formatDate,
  cn,
} from "@/lib/utils";
import { getDemoAIAnalysis } from "@/services/demo-data";
import { useAppStore } from "@/store";
import type { AIDecision, AIAnalysis } from "@/types";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  ShieldAlert,
  Cpu,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";

export default function AIIntelligencePage() {
  const {
    decisions,
    addDecision,
    updateDecision,
    deleteDecision,
  } = useAppStore();

  const [selectedSymbol, setSelectedSymbol] = useState("XAUUSD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("M15");
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // CRUD Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<AIDecision | null>(null);
  const [deletingDecision, setDeletingDecision] = useState<AIDecision | null>(null);

  // Form State for Add Decision
  const [formSymbol, setFormSymbol] = useState("XAUUSD");
  const [formAction, setFormAction] = useState<AIDecision["action"]>("BUY");
  const [formConfidence, setFormConfidence] = useState("88");
  const [formReason, setFormReason] = useState("EMA20 melintasi EMA50 ke atas dengan filter RSI14 pada level 48.2 (Golden Cross terkonfirmasi).");
  const [formRiskNote, setFormRiskNote] = useState("Disetujui: Drawdown akun 2.1% di bawah batas maksimal 6.0%.");

  // Form State for Edit Decision
  const [editAction, setEditAction] = useState<AIDecision["action"]>("BUY");
  const [editConfidence, setEditConfidence] = useState("88");
  const [editReason, setEditReason] = useState("");
  const [editRiskNote, setEditRiskNote] = useState("");

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const analysis: AIAnalysis = getDemoAIAnalysis(selectedSymbol);

  // Handle Add Decision Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReason.trim()) return;

    const conf = parseInt(formConfidence, 10) || 80;
    const created = addDecision({
      symbol: formSymbol,
      action: formAction,
      confidence: conf,
      reason: formReason.trim(),
      riskManagerNote: formRiskNote.trim() || null,
      executedTicket: formAction === "ENTRY_EXECUTED" || formAction === "BUY" ? String(Math.floor(10000000 + Math.random() * 90000000)) : null,
    });

    setIsAddModalOpen(false);
    showToast(`Keputusan AI untuk ${created.symbol} (${created.action}) berhasil dicatat.`);
  };

  // Open Edit Modal
  const handleOpenEdit = (dec: AIDecision) => {
    setEditingDecision(dec);
    setEditAction(dec.action);
    setEditConfidence(String(dec.confidence));
    setEditReason(dec.reason);
    setEditRiskNote(dec.riskManagerNote || "");
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDecision) return;

    updateDecision(editingDecision.id, {
      action: editAction,
      confidence: parseInt(editConfidence, 10) || editingDecision.confidence,
      reason: editReason.trim(),
      riskManagerNote: editRiskNote.trim() || null,
    });

    setEditingDecision(null);
    showToast("Keputusan AI berhasil diperbarui.");
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deletingDecision) return;
    deleteDecision(deletingDecision.id);
    showToast("Catatan keputusan AI telah dihapus.");
    setDeletingDecision(null);
  };

  // Quick Action to Execute or Reject
  const handleQuickStatusChange = (dec: AIDecision, action: AIDecision["action"]) => {
    updateDecision(dec.id, { action });
    showToast(`Status sinyal ${dec.symbol} diubah ke ${action}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="AI Intelligence"
        subtitle="Analisis Pasar Multi-Timeframe, Keputusan Neural & Evaluasi Risk Gatekeeper"
      >
        <NeoButton
          variant="secondary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Sinyal AI Manual</span>
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

      {/* Mandatory Risk Disclaimer */}
      <div className="p-3.5 bg-white dark:bg-[#07152F] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2.5">
        <AlertCircle className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF] shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-[#050505] dark:text-white">Pemberitahuan Algoritma & Proteksi Risiko:</strong> Tingkat keyakinan (AI Confidence) merupakan probabilitas statistik berbasis analisis multi-timeframe (H4, H1, M15) dan filter indikator teknis EA-Nevan (EMA20/50, RSI14, ATR14), <span className="text-[#1746FF] dark:text-[#00E5FF] font-bold">bukan jaminan keuntungan trading mutlak</span>.
        </p>
      </div>

      {/* Symbol & Timeframe Selector Bar */}
      <NeoCard className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300">Instrumen:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "BTCUSD"].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setSelectedSymbol(sym)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-heading font-bold rounded-md border-2 border-[#050505] transition-all",
                    selectedSymbol === sym
                      ? "bg-[#00E5FF] text-[#050505] shadow-[2px_2px_0px_#050505]"
                      : "bg-white dark:bg-[#07152F] text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                  )}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300">Timeframe:</span>
            <div className="flex items-center gap-1">
              {["M15", "H1", "H4", "D1"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-heading font-bold rounded border-2 border-[#050505] transition-all",
                    selectedTimeframe === tf
                      ? "bg-[#1746FF] text-white shadow-[2px_2px_0px_#050505]"
                      : "bg-white dark:bg-[#07152F] text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </NeoCard>

      {/* Market Intelligence Analysis Card */}
      {analysis && (
        <NeoCard className="p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#050505] pb-4 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1746FF] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md flex items-center justify-center text-white">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#050505] dark:text-white">
                  Analisis Intelijen Pasar: {analysis.symbol}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  Multi-Timeframe Engine ({selectedTimeframe}) • Mode Tertutup Lilin (Closed Candle)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono font-bold">Rekomendasi Akhir:</span>
              <NeoBadge
                variant={
                  analysis.recommendation.includes("BUY")
                    ? "success"
                    : analysis.recommendation.includes("SELL")
                    ? "danger"
                    : "warning"
                }
                className="text-xs py-1 px-3"
              >
                {analysis.recommendation.replace("_", " ")}
              </NeoBadge>
            </div>
          </div>

          {/* AI Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Multi Timeframe Matrix */}
            <div className="p-3.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
              <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" /> Matriks Tren Multi-TF
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-600 dark:text-gray-400">H4 Trend</span>
                  <NeoBadge variant={analysis.trendH4 === "BULLISH" ? "success" : "danger"}>
                    {analysis.trendH4}
                  </NeoBadge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-600 dark:text-gray-400">H1 Trend</span>
                  <NeoBadge variant={analysis.trendH1 === "BULLISH" ? "success" : "danger"}>
                    {analysis.trendH1}
                  </NeoBadge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-gray-600 dark:text-gray-400">M15 Trend</span>
                  <NeoBadge variant={analysis.trendM15 === "BULLISH" ? "success" : "danger"}>
                    {analysis.trendM15}
                  </NeoBadge>
                </div>
              </div>
            </div>

            {/* 2. Technical Confluence (EMA & RSI) */}
            <div className="p-3.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
              <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" /> Momentum & RSI(14)
              </p>
              <div className="pt-1">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">RSI (14 Filter)</span>
                  <span className="font-mono font-bold text-[#050505] dark:text-white">{analysis.rsi.toFixed(1)}</span>
                </div>
                <div className="w-full bg-[#E5E7EB] dark:bg-[#0D2247] h-2.5 border border-[#050505] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      analysis.rsi > 70 ? "bg-[#FF4B57]" : analysis.rsi < 30 ? "bg-[#00B843]" : "bg-[#00E5FF]"
                    )}
                    style={{ width: `${analysis.rsi}%` }}
                  />
                </div>
              </div>
              <div className="text-[11px] text-gray-700 dark:text-gray-300 font-mono pt-1">
                EMA 20/50: <strong className="text-[#00B843] dark:text-[#74FF44]">{analysis.ema.signal}</strong>
              </div>
            </div>

            {/* 3. Volatility & ATR */}
            <div className="p-3.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
              <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00B843] dark:text-[#74FF44]" /> Volatilitas & ATR(14)
              </p>
              <div className="pt-1 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Regime</span>
                  <span className="font-heading font-bold text-[#050505] dark:text-white">{analysis.marketRegime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Rentang ATR</span>
                  <span className="font-mono font-bold text-[#00B843] dark:text-[#74FF44]">{analysis.atr}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <NeoBadge variant="info">{analysis.volatility} VOL</NeoBadge>
                </div>
              </div>
            </div>

            {/* 4. Support & Resistance */}
            <div className="p-3.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
              <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#FF4B57]" /> Batas Harga Utama
              </p>
              <div className="pt-1 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between items-center p-1.5 bg-[#FF4B57]/15 rounded border-2 border-[#050505]">
                  <span className="text-gray-700 dark:text-gray-300 font-bold">Resistance</span>
                  <span className="font-bold text-[#FF3B30] dark:text-[#FF4B57]">{analysis.resistance}</span>
                </div>
                <div className="flex justify-between items-center p-1.5 bg-[#00B843]/15 rounded border-2 border-[#050505]">
                  <span className="text-gray-700 dark:text-gray-300 font-bold">Support</span>
                  <span className="font-bold text-[#00B843] dark:text-[#74FF44]">{analysis.support}</span>
                </div>
              </div>
            </div>
          </div>
        </NeoCard>
      )}

      {/* AI Decision History Section (CRUD) */}
      <NeoCard className="p-0 overflow-hidden">
        <div className="p-4 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Riwayat Keputusan AI & Evaluasi Risk Gatekeeper
            </h3>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-mono font-bold">
            {decisions.length} Kejadian Tercatat
          </span>
        </div>

        <div className="divide-y-2 divide-[#050505]">
          {decisions.map((dec) => (
            <div key={dec.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#07152F]/60 transition-colors space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-heading font-bold text-[#050505] dark:text-white text-sm">
                    {dec.symbol}
                  </span>
                  <NeoBadge
                    variant={
                      dec.action === "ENTRY_EXECUTED" || dec.action === "BUY"
                        ? "success"
                        : dec.action === "SIGNAL_REJECTED" || dec.action === "SELL"
                        ? "danger"
                        : dec.action === "HOLD"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {dec.action.replace("_", " ")}
                  </NeoBadge>
                  <span className="text-xs font-mono font-bold text-[#1746FF] dark:text-[#00E5FF]">
                    Conf: {dec.confidence}%
                  </span>
                  {dec.executedTicket && (
                    <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300 bg-[#E5E7EB] dark:bg-[#07152F] px-1.5 py-0.5 rounded border border-[#050505]">
                      Ticket #{dec.executedTicket}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 font-mono font-bold">
                    {formatDate(dec.timestamp)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(dec)}
                      title="Edit Keputusan AI"
                      className="p-1 text-gray-700 dark:text-gray-300 hover:text-[#1746FF] hover:bg-gray-100 dark:hover:bg-[#07152F] border border-[#050505] rounded shadow-[1px_1px_0px_#050505]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingDecision(dec)}
                      title="Hapus Keputusan AI"
                      className="p-1 text-gray-500 hover:text-[#FF4B57] hover:bg-gray-100 dark:hover:bg-[#07152F] border border-[#050505] rounded shadow-[1px_1px_0px_#050505]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                <strong className="text-[#050505] dark:text-white font-heading">Alasan Keputusan AI:</strong> {dec.reason}
              </p>

              {/* Risk Manager Explanation Note */}
              {dec.riskManagerNote && (
                <div className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-l-4 border-[#1746FF] dark:border-[#00E5FF] border-2 border-r-[#050505] border-t-[#050505] border-b-[#050505] rounded text-xs text-gray-700 dark:text-gray-300 space-y-1 shadow-[2px_2px_0px_#050505]">
                  <div className="flex items-center gap-1.5 font-heading font-bold text-[#1746FF] dark:text-[#00E5FF] text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5" /> Evaluasi Risk Engine / CapitalGuard:
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic pl-5">
                    "{dec.riskManagerNote}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </NeoCard>

      {/* ─── MODAL 1: BUAT KEPUTUSAN / SINYAL AI (CREATE) ──── */}
      <NeoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Buat Keputusan / Sinyal AI Manual"
        subtitle="Tambahkan rekomendasi algoritma baru ke dalam log evaluasi"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
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
                <option value="XAUUSD">XAUUSD</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="BTCUSD">BTCUSD</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Aksi (Action)
              </label>
              <select
                value={formAction}
                onChange={(e) => setFormAction(e.target.value as AIDecision["action"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="HOLD">HOLD</option>
                <option value="ENTRY_EXECUTED">ENTRY_EXECUTED</option>
                <option value="SIGNAL_REJECTED">SIGNAL_REJECTED</option>
                <option value="ENTRY_SKIPPED">ENTRY_SKIPPED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Confidence Level (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formConfidence}
              onChange={(e) => setFormConfidence(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Alasan Keputusan AI (Rationale)
            </label>
            <textarea
              rows={3}
              value={formReason}
              onChange={(e) => setFormReason(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Catatan Evaluasi Risk Manager (Opsional)
            </label>
            <input
              type="text"
              value={formRiskNote}
              onChange={(e) => setFormRiskNote(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
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
              Catat Sinyal AI
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 2: EDIT KEPUTUSAN AI (UPDATE) ───────────── */}
      <NeoModal
        isOpen={!!editingDecision}
        onClose={() => setEditingDecision(null)}
        title="Edit Keputusan AI"
        subtitle={`Perbarui evaluasi untuk ${editingDecision?.symbol}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Aksi
              </label>
              <select
                value={editAction}
                onChange={(e) => setEditAction(e.target.value as AIDecision["action"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="HOLD">HOLD</option>
                <option value="ENTRY_EXECUTED">ENTRY_EXECUTED</option>
                <option value="SIGNAL_REJECTED">SIGNAL_REJECTED</option>
                <option value="ENTRY_SKIPPED">ENTRY_SKIPPED</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Confidence (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={editConfidence}
                onChange={(e) => setEditConfidence(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Alasan Keputusan
            </label>
            <textarea
              rows={3}
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Catatan Risk Manager
            </label>
            <input
              type="text"
              value={editRiskNote}
              onChange={(e) => setEditRiskNote(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingDecision(null)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Perbarui Keputusan
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 3: DELETE KEPUTUSAN (DELETE) ────────────── */}
      <NeoModal
        isOpen={!!deletingDecision}
        onClose={() => setDeletingDecision(null)}
        title="Hapus Keputusan AI"
        subtitle="Hapus catatan dari riwayat evaluasi"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus catatan keputusan{" "}
            <strong>{deletingDecision?.action} {deletingDecision?.symbol}</strong>?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingDecision(null)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
            >
              Hapus Catatan
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
