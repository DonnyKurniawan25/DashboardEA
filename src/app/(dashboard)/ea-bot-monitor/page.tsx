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
  formatDuration,
  formatDate,
  formatPnL,
  getPnLColor,
  cn,
} from "@/lib/utils";
import { useAppStore } from "@/store";
import type { BotStatus } from "@/types";
import {
  Bot,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Activity,
  Copy,
  Check,
  Brain,
  ShieldAlert,
  Send,
  Terminal,
  ChevronDown,
  ChevronUp,
  Info,
  GitBranch,
  Sliders,
  Plus,
  Edit2,
  Trash2,
  XCircle,
} from "lucide-react";

export default function EABotMonitorPage() {
  const {
    bots,
    addBot,
    updateBot,
    deleteBot,
    toggleBotStatus,
  } = useAppStore();

  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [copiedPreset, setCopiedPreset] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // CRUD Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<BotStatus | null>(null);
  const [deletingBot, setDeletingBot] = useState<BotStatus | null>(null);

  // Form State for Add Bot
  const [formName, setFormName] = useState("EA-Nevan Scalper Pro");
  const [formVersion, setFormVersion] = useState("1.220");
  const [formSymbol, setFormSymbol] = useState("XAUUSDm");
  const [formStrategy, setFormStrategy] = useState("EMA 20/50 + RSI 14 Confluence");
  const [formMode, setFormMode] = useState<BotStatus["activeMode"]>("MODERATE");
  const [formStatus, setFormStatus] = useState<BotStatus["status"]>("RUNNING");
  const [formGridLevel, setFormGridLevel] = useState("2");

  // Form State for Edit Bot
  const [editName, setEditName] = useState("");
  const [editStrategy, setEditStrategy] = useState("");
  const [editMode, setEditMode] = useState<BotStatus["activeMode"]>("MODERATE");
  const [editStatus, setEditStatus] = useState<BotStatus["status"]>("RUNNING");
  const [editGridLevel, setEditGridLevel] = useState("1");

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const toggleLogs = (botId: string) => {
    setExpandedLogs((prev) => ({ ...prev, [botId]: !prev[botId] }));
  };

  const copyPresetToClipboard = () => {
    const preset = `// EA-Nevan Configuration Preset for MT5
// Repository: git@github.com:DonnyKurniawan25/EA-Nevan.git
// File: GoldShield_DEMO20.mq5
InpMagicNumber=26011060
InpSymbol="XAUUSDm"
InpTimeframe=PERIOD_M15
InpLotSize=0.01
InpMaxSpreadPoints=35
InpFastEMA=20
InpSlowEMA=50
InpRSI_Period=14
InpRSI_Overbought=70.0
InpRSI_Oversold=30.0
InpATR_Period=14
InpSL_Multiplier=1.5
InpTP_Multiplier=2.5
InpEquityShieldPct=90.0
InpMaxDailyLossPct=0.5
InpMaxConsecutiveLosses=2
InpMinMarginLevelPct=500.0`;

    navigator.clipboard.writeText(preset);
    setCopiedPreset(true);
    setTimeout(() => setCopiedPreset(false), 2500);
    showToast("Preset EA-Nevan berhasil disalin ke clipboard!");
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormName("EA-Nevan Scalper Pro");
    setFormVersion("1.220");
    setFormSymbol("XAUUSDm");
    setFormStrategy("EMA 20/50 + RSI 14 Confluence");
    setFormMode("MODERATE");
    setFormStatus("RUNNING");
    setFormGridLevel("2");
    setIsAddModalOpen(true);
  };

  // Handle Add Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const created = addBot({
      name: formName.trim(),
      version: formVersion.trim() || "1.0",
      symbol: formSymbol,
      strategy: formStrategy,
      activeMode: formMode,
      status: formStatus,
      currentGridLevel: parseInt(formGridLevel, 10) || 1,
      basketPnL: 0,
      totalOpenPositions: 0,
    });

    setIsAddModalOpen(false);
    showToast(`Robot "${created.name}" berhasil didaftarkan.`);
  };

  // Open Edit Modal
  const handleOpenEdit = (b: BotStatus) => {
    setEditingBot(b);
    setEditName(b.name);
    setEditStrategy(b.strategy);
    setEditMode(b.activeMode);
    setEditStatus(b.status);
    setEditGridLevel(String(b.currentGridLevel));
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBot) return;

    updateBot(editingBot.id, {
      name: editName.trim(),
      strategy: editStrategy,
      activeMode: editMode,
      status: editStatus,
      currentGridLevel: parseInt(editGridLevel, 10) || editingBot.currentGridLevel,
    });

    setEditingBot(null);
    showToast(`Konfigurasi robot "${editName}" berhasil diperbarui.`);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deletingBot) return;
    deleteBot(deletingBot.id);
    showToast(`Robot "${deletingBot.name}" telah dihapus.`);
    setDeletingBot(null);
  };

  // Quick Toggle Bot Status
  const handleToggle = (b: BotStatus) => {
    toggleBotStatus(b.id);
    const nextStatus = b.status === "RUNNING" ? "PAUSED" : "RUNNING";
    showToast(`Robot "${b.name}" diubah ke status ${nextStatus}.`);
  };

  // Top stats
  const runningCount = bots.filter((b) => b.status === "RUNNING").length;
  const pausedCount = bots.filter((b) => b.status === "PAUSED").length;
  const totalBasketPnL = bots.reduce((acc, b) => acc + b.basketPnL, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="EA / Bot Monitor"
        subtitle="Monitoring Robot Trading Algoritmik EA-Nevan & Eksekusi Grid Recovery MT5"
      >
        <NeoButton
          variant="secondary"
          size="sm"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Daftarkan Bot Baru</span>
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

      {/* Safety & Protocol Banner */}
      <div className="p-4 bg-white dark:bg-[#07152F] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-heading font-bold text-[#050505] dark:text-white text-sm flex items-center gap-2">
              MONITORING MODE AKTIF — EA-NEVAN V1.220
              <span className="text-[10px] bg-[#FFE600] text-[#050505] px-1.5 py-0.5 rounded font-bold border border-[#050505]">
                SAFETY AUDIT LOCK
              </span>
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
              Dashboard ini disesuaikan khusus untuk robot trading <strong>EA-Nevan</strong> (repository: <code className="bg-gray-100 dark:bg-[#0D2247] px-1 py-0.5 rounded font-mono text-[11px] font-bold text-[#1746FF] dark:text-[#00E5FF]">git@github.com:DonnyKurniawan25/EA-Nevan.git</code>). Halaman ini mendukung CRUD profil robot, kontrol status RUN/PAUSE seketika, dan parameter grid.
            </p>
          </div>
        </div>
      </div>

      {/* Top Bot Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <NeoCard className="p-4">
          <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
            Robot Aktif
          </p>
          <p className="text-2xl font-heading font-bold text-[#00B843] dark:text-[#74FF44]">
            {runningCount} RUNNING
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">100% Heartbeat Sehat</p>
        </NeoCard>

        <NeoCard className="p-4">
          <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
            Standby / Paused
          </p>
          <p className="text-2xl font-heading font-bold text-[#D97706] dark:text-[#FFE600]">
            {pausedCount} PAUSED
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Status kontrol manual</p>
        </NeoCard>

        <NeoCard className="p-4">
          <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
            Total Basket P/L
          </p>
          <p className={cn("text-2xl font-mono font-bold", getPnLColor(totalBasketPnL))}>
            {formatPnL(totalBasketPnL)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Siklus trading berjalan</p>
        </NeoCard>

        <NeoCard className="p-4">
          <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
            AI Synchronicity
          </p>
          <p className="text-2xl font-heading font-bold text-[#1746FF] dark:text-[#00E5FF]">
            SYNCED
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">&lt; 28ms latency</p>
        </NeoCard>
      </div>

      {/* EA-Nevan Repository & Preset Setup Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repo & Configuration Card */}
        <NeoCard className="lg:col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#050505] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded flex items-center justify-center text-white">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#050505] dark:text-white">
                  Spesifikasi & Konfigurasi EA-Nevan
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  DonnyKurniawan25/EA-Nevan (MQL5 Architecture)
                </p>
              </div>
            </div>
            <NeoBadge variant="success">READY FOR MT5</NeoBadge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
              <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">Simbol Target</span>
              <span className="text-sm font-mono font-bold text-[#1746FF] dark:text-[#00E5FF] block mt-0.5">XAUUSDm</span>
              <span className="text-[10px] text-gray-500">Exness Micro Gold</span>
            </div>

            <div className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
              <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">Timeframe</span>
              <span className="text-sm font-mono font-bold text-[#050505] dark:text-white block mt-0.5">M15 (Trend H1)</span>
              <span className="text-[10px] text-gray-500">Closed-candle rules</span>
            </div>

            <div className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
              <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">Ukuran Lot</span>
              <span className="text-sm font-mono font-bold text-[#050505] dark:text-white block mt-0.5">0.01 Lot</span>
              <span className="text-[10px] text-gray-500">Fixed risk limit</span>
            </div>

            <div className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
              <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">Magic Number</span>
              <span className="text-sm font-mono font-bold text-[#1746FF] dark:text-[#00E5FF] block mt-0.5">26011060</span>
              <span className="text-[10px] text-gray-500">EA Unique ID</span>
            </div>
          </div>

          {/* Preset Code Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-[#050505] dark:text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
                Preset Parameter EA MT5 (.set ready)
              </span>
              <button
                onClick={copyPresetToClipboard}
                className="px-2.5 py-1 text-xs bg-white dark:bg-[#07152F] text-[#050505] dark:text-white border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] hover:bg-gray-100 dark:hover:bg-[#132D5E] font-heading font-bold flex items-center gap-1 transition-all"
              >
                {copiedPreset ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00B843]" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin Preset
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-gray-900 text-[#00E5FF] text-[11px] font-mono rounded border-2 border-[#050505] overflow-x-auto leading-relaxed shadow-[2px_2px_0px_#050505]">
{`InpMagicNumber=26011060 | InpSymbol="XAUUSDm" | InpTimeframe=PERIOD_M15 | InpLotSize=0.01
InpFastEMA=20 | InpSlowEMA=50 | InpRSI_Period=14 | InpATR_Period=14 | InpEquityShieldPct=90.0`}
            </pre>
          </div>
        </NeoCard>

        {/* Quick MT5 Setup Guide */}
        <NeoCard className="p-5 space-y-3">
          <div className="border-b-2 border-[#050505] pb-2">
            <h3 className="font-heading font-bold text-base text-[#050505] dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" /> Panduan Pasang EA di MT5
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Langkah mengaktifkan EA-Nevan di MetaTrader 5
            </p>
          </div>

          <ol className="space-y-2 text-xs text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li className="leading-snug">
              Buka MT5 &rarr; menu <strong>File &rarr; Open Data Folder</strong>.
            </li>
            <li className="leading-snug">
              Salin file <code className="font-mono bg-gray-100 dark:bg-[#07152F] px-1 py-0.5 rounded font-bold">GoldShield_DEMO20.mq5</code> ke folder <code className="font-mono">MQL5/Experts</code>.
            </li>
            <li className="leading-snug">
              Salin folder <code className="font-mono bg-gray-100 dark:bg-[#07152F] px-1 py-0.5 rounded font-bold">GoldShieldDemo20/</code> ke folder <code className="font-mono">MQL5/Include</code>.
            </li>
            <li className="leading-snug">
              Kompilasi di MetaEditor & pasang pada grafik <strong>XAUUSD M15</strong>.
            </li>
            <li className="leading-snug">
              Pastikan tombol <strong>Algo Trading</strong> di MT5 berwarna hijau.
            </li>
          </ol>
        </NeoCard>
      </div>

      {/* Bot Cards Grid (CRUD) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-lg">
              Instance Robot Trading Aktif ({bots.length})
            </h3>
          </div>
          <NeoButton size="sm" onClick={handleOpenAdd} className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Daftarkan Bot
          </NeoButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <NeoCard key={bot.id} className="p-0 overflow-hidden" hover>
              {/* Card Header */}
              <div className="p-4 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-base text-[#050505] dark:text-white">
                      {bot.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-[#07152F] rounded border border-[#050505] font-bold">
                      v{bot.version}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-0.5">
                    Simbol: <strong className="text-[#1746FF] dark:text-[#00E5FF]">{bot.symbol}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <NeoBadge
                    variant={
                      bot.status === "RUNNING"
                        ? "success"
                        : bot.status === "PAUSED"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {bot.status}
                  </NeoBadge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-4">
                {/* Mode & Strategy */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Strategi:</span>
                    <span className="font-bold text-[#050505] dark:text-white truncate max-w-[170px]">
                      {bot.strategy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Mode:</span>
                    <NeoBadge variant="info">{bot.activeMode}</NeoBadge>
                  </div>
                </div>

                {/* Grid & Basket Stats */}
                <div className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md grid grid-cols-3 gap-2 text-center shadow-[2px_2px_0px_#050505]">
                  <div>
                    <span className="text-[10px] text-gray-500 block font-heading font-bold">
                      Grid Level
                    </span>
                    <span className="text-base font-heading font-bold text-[#050505] dark:text-white">
                      Lvl {bot.currentGridLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-heading font-bold">
                      Open Trades
                    </span>
                    <span className="text-base font-heading font-bold text-[#050505] dark:text-white">
                      {bot.totalOpenPositions}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block font-heading font-bold">
                      Basket P/L
                    </span>
                    <span className={cn("text-base font-mono font-bold", getPnLColor(bot.basketPnL))}>
                      {formatPnL(bot.basketPnL)}
                    </span>
                  </div>
                </div>

                {/* Connection Statuses */}
                <div className="space-y-2 pt-1 border-t-2 border-[#050505] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                      <Brain className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" /> AI Neural Link
                    </span>
                    <span className="text-[#00B843] dark:text-[#74FF44] font-heading font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#00B843] dark:bg-[#74FF44] animate-pulse" />
                      CONNECTED
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                      <Send className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" /> Telegram Dispatch
                    </span>
                    <span className={cn("font-heading font-bold", bot.telegramStatus === "connected" ? "text-[#00B843] dark:text-[#74FF44]" : "text-gray-500")}>
                      {bot.telegramStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-500" /> Uptime
                    </span>
                    <span className="font-mono font-bold text-[#050505] dark:text-white">
                      {formatDuration(bot.uptime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                      <Activity className="w-3.5 h-3.5 text-gray-500" /> Transaksi Terakhir
                    </span>
                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                      {formatDate(bot.lastTrade)}
                    </span>
                  </div>
                </div>

                {/* Control Action Buttons (CRUD) */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-[#050505]">
                  <NeoButton
                    variant={bot.status === "RUNNING" ? "warning" : "success"}
                    size="sm"
                    onClick={() => handleToggle(bot)}
                    className="flex items-center justify-center gap-1 text-xs"
                  >
                    {bot.status === "RUNNING" ? (
                      <>
                        <Pause className="w-3 h-3" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" /> Resume
                      </>
                    )}
                  </NeoButton>

                  <NeoButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(bot)}
                    className="flex items-center justify-center gap-1 text-xs"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </NeoButton>

                  <NeoButton
                    variant="danger"
                    size="sm"
                    onClick={() => setDeletingBot(bot)}
                    className="flex items-center justify-center gap-1 text-xs"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus
                  </NeoButton>
                </div>

                {/* Error Log Accordion */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleLogs(bot.id)}
                    className="w-full flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-1.5 px-2 rounded bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505]"
                  >
                    <span className="flex items-center gap-1.5 font-heading font-bold">
                      <Terminal className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
                      Diagnostik & Log ({bot.errorLogs.length})
                    </span>
                    {expandedLogs[bot.id] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {expandedLogs[bot.id] && (
                    <div className="mt-2 p-2 bg-[#F9FAFB] dark:bg-[#050B16] border-2 border-[#050505] rounded text-[11px] font-mono space-y-1.5 max-h-36 overflow-y-auto">
                      {bot.errorLogs.length === 0 ? (
                        <p className="text-gray-500 italic">Tidak ada error tercatat. Operasional normal.</p>
                      ) : (
                        bot.errorLogs.map((log) => (
                          <div key={log.id} className="text-gray-700 dark:text-gray-300 leading-tight">
                            <span className={cn(
                              "font-bold mr-1",
                              log.level === "ERROR" || log.level === "CRITICAL" ? "text-[#FF4B57]" : log.level === "WARNING" ? "text-[#D97706] dark:text-[#FFE600]" : "text-[#1746FF] dark:text-[#00E5FF]"
                            )}>
                              [{log.level}]
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">{log.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </NeoCard>
          ))}
        </div>
      </div>

      {/* ─── MODAL 1: DAFTARKAN BOT BARU (CREATE) ──────────── */}
      <NeoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Daftarkan Robot Trading Baru"
        subtitle="Registrasikan algoritma trading baru untuk dipantau di dashboard"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Nama Robot
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Versi
              </label>
              <input
                type="text"
                value={formVersion}
                onChange={(e) => setFormVersion(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Simbol Target
              </label>
              <select
                value={formSymbol}
                onChange={(e) => setFormSymbol(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="XAUUSDm">XAUUSDm</option>
                <option value="XAUUSD">XAUUSD</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="USDJPY">USDJPY</option>
                <option value="BTCUSD">BTCUSD</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Mode Agresivitas
              </label>
              <select
                value={formMode}
                onChange={(e) => setFormMode(e.target.value as BotStatus["activeMode"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="CONSERVATIVE">CONSERVATIVE</option>
                <option value="MODERATE">MODERATE</option>
                <option value="AGGRESSIVE">AGGRESSIVE</option>
                <option value="SAFE_MODE">SAFE_MODE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Strategi Algoritma
              </label>
              <input
                type="text"
                value={formStrategy}
                onChange={(e) => setFormStrategy(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Status Awal
              </label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as BotStatus["status"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="RUNNING">RUNNING</option>
                <option value="PAUSED">PAUSED</option>
                <option value="SAFE_MODE">SAFE_MODE</option>
              </select>
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
              Daftarkan Robot
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 2: EDIT BOT (UPDATE) ───────────────────── */}
      <NeoModal
        isOpen={!!editingBot}
        onClose={() => setEditingBot(null)}
        title="Konfigurasi Robot Trading"
        subtitle={`Ubah parameter operasional untuk ${editingBot?.name}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Nama Robot
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Status Operasional
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as BotStatus["status"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="RUNNING">RUNNING (Berjalan)</option>
                <option value="PAUSED">PAUSED (Jeda)</option>
                <option value="SAFE_MODE">SAFE_MODE (Proteksi)</option>
                <option value="DISCONNECTED">DISCONNECTED</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Mode Trading
              </label>
              <select
                value={editMode}
                onChange={(e) => setEditMode(e.target.value as BotStatus["activeMode"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="CONSERVATIVE">CONSERVATIVE</option>
                <option value="MODERATE">MODERATE</option>
                <option value="AGGRESSIVE">AGGRESSIVE</option>
                <option value="SAFE_MODE">SAFE_MODE</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Current Grid Level
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={editGridLevel}
                onChange={(e) => setEditGridLevel(e.target.value)}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-mono font-bold"
              />
            </div>
          </div>

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

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingBot(null)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Simpan Konfigurasi
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 3: DELETE BOT ──────────────────────────── */}
      <NeoModal
        isOpen={!!deletingBot}
        onClose={() => setDeletingBot(null)}
        title="Hapus Robot Trading"
        subtitle="Hapus instance robot dari dashboard monitoring"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus robot{" "}
            <strong>{deletingBot?.name} ({deletingBot?.symbol})</strong>?
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingBot(null)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
            >
              Hapus Robot
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
