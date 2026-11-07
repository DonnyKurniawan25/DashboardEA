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
  formatDuration,
  formatDate,
  formatPnL,
  getPnLColor,
  cn,
} from "@/lib/utils";
import { api } from "@/services/api";
import type { BotStatus } from "@/types";
import {
  Bot,
  Brain,
  Send,
  Zap,
  Activity,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Terminal,
  Wifi,
  WifiOff,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  Info,
  GitBranch,
  Download,
  FileCode,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

export default function EABotMonitorPage() {
  const [bots, setBots] = useState<BotStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState("EXNESS_DEMO_XAUUSDm_SHADOW.set");
  const [copiedPreset, setCopiedPreset] = useState(false);

  const fetchBots = async () => {
    setLoading(true);
    try {
      const data = await api.getBotStatus();
      setBots(data);
    } catch (err) {
      console.error("Failed to load bot status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const toggleLogs = (botId: string) => {
    setExpandedLogs((prev) => ({ ...prev, [botId]: !prev[botId] }));
  };

  const handleSimulatedAction = (botName: string, action: string) => {
    setSimulationNotice(
      `[EA-NEVAN SAFETY LOCK] Tindakan "${action}" pada bot "${botName}" disimulasikan. Eksekusi live MT5 memerlukan 2FA & Python MT5 Bridge aktif.`
    );
    setTimeout(() => setSimulationNotice(null), 5000);
  };

  const handleCopyPreset = () => {
    const presetText = `# EA-Nevan Exness GoldShield Preset
; Generated for MT5 XAUUSDm
TradeSymbol=XAUUSDm
SignalTimeframe=15
TrendTimeframe=60
MagicNumber=26011060
ExecutionMode=SHADOW
BaseLot=0.01
FastEMAPeriod=20
SlowEMAPeriod=50
RSIPeriod=14
ATRPeriod=14
StopATRMultiple=2.0
RewardRiskMultiple=2.0
EquityShieldMinPctOfReference=90.0
MaxDailyLossPct=0.5
MaxConsecutiveLossesPerDay=2
MaxEntriesPerDay=3
MinMarginLevelPct=500.0`;
    navigator.clipboard.writeText(presetText);
    setCopiedPreset(true);
    setTimeout(() => setCopiedPreset(false), 2500);
  };

  const runningCount = bots.filter((b) => b.status === "RUNNING").length;
  const pausedCount = bots.filter((b) => b.status === "PAUSED").length;
  const totalBasketPnL = bots.reduce((acc, b) => acc + b.basketPnL, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="EA / Bot Monitor"
        subtitle="Monitoring & Telemetri Robot Trading EA-Nevan (GoldShield AI v1.220)"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={fetchBots}
          className="flex items-center gap-1.5"
        >
          <RotateCcw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Refresh Heartbeat
        </NeoButton>
        <NeoBadge variant="info">DEMO20 ACTIVE</NeoBadge>
      </PageHeader>

      {/* Safety & Protocol Banner */}
      <div className="p-4 bg-white dark:bg-[#07152F] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#1746FF] dark:text-[#FFE600] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-heading font-bold text-[#050505] dark:text-white text-sm flex items-center gap-2">
              MONITORING MODE AKTIF — EA-NEVAN V1.220
              <span className="text-[10px] bg-[#FFE600] text-[#050505] px-1.5 py-0.5 rounded font-bold border border-[#050505]">
                SAFETY AUDIT LOCK
              </span>
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
              Dashboard ini disesuaikan khusus untuk robot trading <strong>EA-Nevan</strong> (repository: <code className="bg-gray-100 dark:bg-[#0D2247] px-1 py-0.5 rounded font-mono text-[11px] font-bold text-[#1746FF] dark:text-[#00E5FF]">git@github.com:DonnyKurniawan25/EA-Nevan.git</code>). Halaman ini digunakan untuk memantau status, strategi, margin, dan sinyal. Modifikasi parameter langsung ke broker MT5 diamankan dengan fail-safe protocol.
            </p>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {simulationNotice && (
        <div className="p-3 bg-[#00E5FF]/20 border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md text-xs font-heading font-bold text-[#050505] dark:text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF] shrink-0" />
          <span>{simulationNotice}</span>
        </div>
      )}

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
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Manual pause state</p>
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
                <FileCode className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
                Preset Aktif: <code className="font-mono text-xs">{selectedPreset}</code>
              </span>
              <button
                onClick={handleCopyPreset}
                className="neo-btn py-1 px-2.5 bg-[#00E5FF] hover:bg-[#00C8E0] text-[#050505] text-[11px] font-heading font-bold rounded flex items-center gap-1"
              >
                {copiedPreset ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin Preset .SET
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 bg-[#F9FAFB] dark:bg-[#050B16] border-2 border-[#050505] rounded-md font-mono text-[11px] text-[#050505] dark:text-gray-300 overflow-x-auto max-h-36 leading-relaxed">
{`; EA-Nevan Exness GoldShield Preset (DEMO20 BOUNDED)
TradeSymbol=XAUUSDm
SignalTimeframe=PERIOD_M15
TrendTimeframe=PERIOD_H1
MagicNumber=26011060
ExecutionMode=SHADOW ; default safe shadow mode
BaseLot=0.01
FastEMAPeriod=20
SlowEMAPeriod=50
RSIPeriod=14
ATRPeriod=14
StopATRMultiple=2.0
RewardRiskMultiple=2.0
EquityShieldMinPctOfReference=90.0
MaxDailyLossPct=0.5
MaxConsecutiveLossesPerDay=2
MaxEntriesPerDay=3
MinMarginLevelPct=500.0`}
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
              Buka chart <strong>XAUUSDm</strong> (M15) di Exness MT5, lalu drag EA ke chart.
            </li>
            <li className="leading-snug">
              Centang <strong>Allow Algo Trading</strong> dan muat preset <code className="font-mono">EXNESS_DEMO_XAUUSDm_SHADOW.set</code>.
            </li>
            <li className="leading-snug">
              Jalankan bridge Python: <code className="font-mono bg-gray-100 dark:bg-[#07152F] px-1 py-0.5 rounded font-bold">python backend/main.py</code> untuk telemetri real-time.
            </li>
          </ol>
        </NeoCard>
      </div>

      {/* Bots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <NeoCard key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </NeoCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <NeoCard key={bot.id} className="p-0 overflow-hidden">
              {/* Card Header */}
              <div className="p-5 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
                        {bot.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-[#1746FF] dark:text-[#00E5FF]">
                          {bot.symbol}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold">
                          v{bot.version}
                        </span>
                      </div>
                    </div>
                  </div>

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

              {/* Bot Info Body */}
              <div className="p-5 space-y-4">
                {/* Mode & Strategy */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded">
                    <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">
                      Strategi
                    </span>
                    <span className="font-heading font-bold text-[#050505] dark:text-white truncate block mt-0.5">
                      {bot.strategy}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded">
                    <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">
                      Mode Eksekusi
                    </span>
                    <span className="font-heading font-bold text-[#1746FF] dark:text-[#00E5FF] block mt-0.5">
                      {bot.activeMode}
                    </span>
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

                {/* Control Action Buttons (Simulated with Safe Confirm) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-[#050505]">
                  <NeoButton
                    variant={bot.status === "RUNNING" ? "warning" : "success"}
                    size="sm"
                    onClick={() => handleSimulatedAction(bot.name, bot.status === "RUNNING" ? "Pause" : "Resume")}
                    className="flex items-center justify-center gap-1.5 text-xs"
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
                    onClick={() => handleSimulatedAction(bot.name, "Restart")}
                    className="flex items-center justify-center gap-1.5 text-xs"
                  >
                    <RotateCcw className="w-3 h-3" /> Restart
                  </NeoButton>
                </div>

                {/* Error Log Accordion */}
                <div className="pt-2">
                  <button
                    onClick={() => toggleLogs(bot.id)}
                    className="w-full flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-1.5 px-2 rounded bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505]"
                  >
                    <span className="flex items-center gap-1.5 font-heading font-bold">
                      <Terminal className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#FFE600]" />
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
      )}
    </div>
  );
}
