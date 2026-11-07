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
} from "lucide-react";

export default function EABotMonitorPage() {
  const [bots, setBots] = useState<BotStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [simulationNotice, setSimulationNotice] = useState<string | null>(null);

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
      `[SAFETY LOCK] ${action} on "${botName}" simulated. Live execution requires 2FA & active MT5 bridge.`
    );
    setTimeout(() => setSimulationNotice(null), 5000);
  };

  const runningCount = bots.filter((b) => b.status === "RUNNING").length;
  const pausedCount = bots.filter((b) => b.status === "PAUSED").length;
  const totalBasketPnL = bots.reduce((acc, b) => acc + b.basketPnL, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="EA / Bot Monitor"
        subtitle="Autonomous Trading Robots & Execution Engine Telemetry"
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
        <NeoBadge variant="info">DEMO TELEMETRY</NeoBadge>
      </PageHeader>

      {/* Safety & Protocol Banner (Direct requirement from user prompt) */}
      <div className="p-4 bg-[#07152F] border-2 border-[#FFE600] shadow-[4px_4px_0px_#050505] rounded-md">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#FFE600] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
              MONITORING MODE ACTIVE
              <span className="text-[10px] bg-[#FFE600] text-[#050505] px-1.5 py-0.5 rounded font-bold">
                AUDIT LOCK
              </span>
            </h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Halaman ini difungsikan untuk pemantauan parameter robot. Kontrol intervensi transaksi langsung dinonaktifkan hingga sistem backend mendukung autentikasi bertingkat, verifikasi otorisasi API key, audit trail immutable, dan konfirmasi ganda (2FA).
            </p>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {simulationNotice && (
        <div className="p-3 bg-[#1746FF]/20 border-2 border-[#1746FF] shadow-[3px_3px_0px_#050505] rounded-md text-xs font-heading text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-[#00E5FF]" />
          <span>{simulationNotice}</span>
        </div>
      )}

      {/* Top Bot Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <NeoCard className="p-4 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider mb-1">
            Running Bots
          </p>
          <p className="text-2xl font-heading font-bold text-[#74FF44]">
            {runningCount} ACTIVE
          </p>
          <p className="text-xs text-gray-400 mt-1">100% heartbeat healthy</p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider mb-1">
            Standby / Paused
          </p>
          <p className="text-2xl font-heading font-bold text-[#FFE600]">
            {pausedCount} PAUSED
          </p>
          <p className="text-xs text-gray-400 mt-1">Manual pause state</p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider mb-1">
            Combined Basket P/L
          </p>
          <p className={cn("text-2xl font-heading font-bold", getPnLColor(totalBasketPnL))}>
            {formatPnL(totalBasketPnL)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Current open cycles</p>
        </NeoCard>

        <NeoCard className="p-4 bg-[#0D2247]">
          <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider mb-1">
            AI Synchronicity
          </p>
          <p className="text-2xl font-heading font-bold text-[#00E5FF]">
            SYNCED
          </p>
          <p className="text-xs text-gray-400 mt-1">&lt; 35ms inference lag</p>
        </NeoCard>
      </div>

      {/* Bots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <NeoCard key={i} className="p-6 space-y-4 bg-[#0D2247]">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </NeoCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <NeoCard key={bot.id} className="p-0 overflow-hidden bg-[#0D2247]">
              {/* Card Header */}
              <div className="p-5 border-b-2 border-[#050505] bg-[#07152F]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-base">
                        {bot.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-[#00E5FF]">
                          {bot.symbol}
                        </span>
                        <span className="text-[10px] text-gray-400">
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
                  <div className="p-2.5 bg-[#07152F] border-2 border-[#050505] rounded">
                    <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">
                      Strategy
                    </span>
                    <span className="font-heading font-bold text-white truncate block mt-0.5">
                      {bot.strategy}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#07152F] border-2 border-[#050505] rounded">
                    <span className="text-[10px] font-heading font-bold text-gray-500 uppercase block">
                      Risk Mode
                    </span>
                    <span className="font-heading font-bold text-[#00E5FF] block mt-0.5">
                      {bot.activeMode}
                    </span>
                  </div>
                </div>

                {/* Grid & Basket Stats */}
                <div className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-heading">
                      Grid Level
                    </span>
                    <span className="text-base font-heading font-bold text-white">
                      Lvl {bot.currentGridLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-heading">
                      Open Trades
                    </span>
                    <span className="text-base font-heading font-bold text-white">
                      {bot.totalOpenPositions}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-heading">
                      Basket P/L
                    </span>
                    <span className={cn("text-base font-heading font-bold", getPnLColor(bot.basketPnL))}>
                      {formatPnL(bot.basketPnL)}
                    </span>
                  </div>
                </div>

                {/* Connection Statuses */}
                <div className="space-y-2 pt-1 border-t border-[#132D5E] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-[#00E5FF]" /> AI Neural Link
                    </span>
                    <span className="text-[#74FF44] font-heading font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#74FF44] animate-pulse" />
                      CONNECTED
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#00E5FF]" /> Telegram Dispatch
                    </span>
                    <span className={cn("font-heading font-bold", bot.telegramStatus === "connected" ? "text-[#74FF44]" : "text-gray-500")}>
                      {bot.telegramStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> Uptime
                    </span>
                    <span className="font-mono text-white">
                      {formatDuration(bot.uptime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-gray-400" /> Last Trade
                    </span>
                    <span className="font-mono text-xs text-gray-300">
                      {formatDate(bot.lastTrade)}
                    </span>
                  </div>
                </div>

                {/* Control Action Buttons (Simulated with Safe Confirm) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#132D5E]">
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
                    className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-white py-1 px-2 rounded bg-[#07152F] border border-[#132D5E]"
                  >
                    <span className="flex items-center gap-1.5 font-heading">
                      <Terminal className="w-3.5 h-3.5 text-[#FFE600]" />
                      Diagnostics ({bot.errorLogs.length})
                    </span>
                    {expandedLogs[bot.id] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {expandedLogs[bot.id] && (
                    <div className="mt-2 p-2 bg-[#050B16] border border-[#132D5E] rounded text-[11px] font-mono space-y-1.5 max-h-36 overflow-y-auto">
                      {bot.errorLogs.length === 0 ? (
                        <p className="text-gray-500 italic">No errors logged. Operations nominal.</p>
                      ) : (
                        bot.errorLogs.map((log) => (
                          <div key={log.id} className="text-gray-300 leading-tight">
                            <span className={cn(
                              "font-bold mr-1",
                              log.level === "ERROR" || log.level === "CRITICAL" ? "text-[#FF4B57]" : log.level === "WARNING" ? "text-[#FFE600]" : "text-[#00E5FF]"
                            )}>
                              [{log.level}]
                            </span>
                            <span className="text-gray-400">{log.message}</span>
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

