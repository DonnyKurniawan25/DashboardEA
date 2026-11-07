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
  formatDate,
  cn,
} from "@/lib/utils";
import { api } from "@/services/api";
import type { AIAnalysis, AIDecision, AISignal } from "@/types";
import {
  Brain,
  Cpu,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  Target,
  Activity,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Compass,
  Zap,
} from "lucide-react";

export default function AIIntelligencePage() {
  const [selectedSymbol, setSelectedSymbol] = useState("XAUUSDm");
  const [selectedTimeframe, setSelectedTimeframe] = useState("M15");
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(true);

  const symbols = ["XAUUSDm", "EURUSD", "GBPUSD", "USDJPY", "BTCUSD"];
  const timeframes = ["M15", "H1", "H4", "D1"];

  const loadData = async (symbol: string) => {
    setLoading(true);
    try {
      const querySymbol = symbol === "XAUUSDm" ? "XAUUSD" : symbol;
      const [ana, dec, sig] = await Promise.all([
        api.getAIAnalysis(querySymbol),
        api.getAIDecisions(),
        api.getAISignals(),
      ]);
      setAnalysis(ana);
      setDecisions(dec);
      setSignals(sig);
    } catch (err) {
      console.error("Failed to load AI intelligence data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedSymbol);
  }, [selectedSymbol]);

  const getRecommendationBadge = (rec?: string) => {
    switch (rec) {
      case "STRONG_BUY":
      case "BUY":
        return <NeoBadge variant="success">⚡ {rec.replace("_", " ")}</NeoBadge>;
      case "STRONG_SELL":
      case "SELL":
        return <NeoBadge variant="danger">🔻 {rec.replace("_", " ")}</NeoBadge>;
      case "HOLD":
      default:
        return <NeoBadge variant="warning">✋ HOLD / WAIT CANDLE</NeoBadge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Intelligence"
        subtitle="Analisis Neural Market Structure, Multi-Timeframe Confluence & Aturan EA-Nevan"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={() => loadData(selectedSymbol)}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Re-Analyze
        </NeoButton>
        <NeoBadge variant="info">CLOSED CANDLE RULES</NeoBadge>
      </PageHeader>

      {/* Mandatory Risk Disclaimer (Prompt Requirement) */}
      <div className="p-3.5 bg-white dark:bg-[#07152F] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2.5">
        <AlertCircle className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF] shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-[#050505] dark:text-white">Pemberitahuan Algoritma & Proteksi Risiko:</strong> Tingkat keyakinan (AI Confidence) merupakan probabilitas statistik berbasis analisis multi-timeframe (H4, H1, M15) dan filter indikator teknis EA-Nevan (EMA20/50, RSI14, ATR14), <span className="text-[#1746FF] dark:text-[#FFE600] font-bold">bukan jaminan keuntungan trading mutlak</span>.
        </p>
      </div>

      {/* Symbol & Timeframe Selector Bar */}
      <NeoCard className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mr-1">
              Symbol Target:
            </span>
            {symbols.map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={cn(
                  "px-3 py-1.5 text-xs font-heading font-bold border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505] transition-all",
                  selectedSymbol === sym
                    ? "bg-[#00E5FF] text-[#050505]"
                    : "bg-white dark:bg-[#07152F] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#132D5E]"
                )}
              >
                {sym}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-[#F9FAFB] dark:bg-[#07152F] p-1 border-2 border-[#050505] rounded-md self-start md:self-auto shadow-[2px_2px_0px_#050505]">
            <span className="text-xs font-heading font-bold text-gray-500 px-2">TF:</span>
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={cn(
                  "px-2.5 py-1 text-xs font-heading font-bold rounded transition-colors",
                  selectedTimeframe === tf
                    ? "bg-[#1746FF] text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </NeoCard>

      {/* AI Market Analysis Panel */}
      {loading || !analysis ? (
        <NeoCard className="p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </NeoCard>
      ) : (
        <NeoCard className="p-0 overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b-2 border-[#050505] bg-[#F9FAFB] dark:bg-[#07152F] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00E5FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center">
                <Brain className="w-6 h-6 text-[#050505]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[#050505] dark:text-white text-lg flex items-center gap-2">
                  {selectedSymbol} Matrix Confluence & Aturan Sinyal
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  TF Masuk: <span className="font-mono font-bold text-[#1746FF] dark:text-[#00E5FF]">{selectedTimeframe}</span> • Regime Pasar: <span className="font-bold text-[#050505] dark:text-white">{analysis.marketRegime}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-gray-500 font-heading font-bold uppercase block">
                  AI Confidence
                </span>
                <span className="text-lg font-heading font-bold text-[#1746FF] dark:text-[#00E5FF]">
                  {analysis.confidence}%
                </span>
              </div>
              <div>{getRecommendationBadge(analysis.recommendation)}</div>
            </div>
          </div>

          {/* Matrix Body */}
          <div className="p-5 space-y-6">
            {/* Confidence Progress Meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Kekuatan Sinyal & Keselarasan Indikator
                </span>
                <span className="font-mono font-bold text-[#050505] dark:text-white">
                  {analysis.confidence}% Probabilitas
                </span>
              </div>
              <div className="w-full bg-[#E5E7EB] dark:bg-[#07152F] border-2 border-[#050505] h-4 rounded-full overflow-hidden p-0.5 shadow-[2px_2px_0px_#050505]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1746FF] via-[#00E5FF] to-[#00B843] transition-all duration-700"
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 1. Multi-Timeframe Alignment */}
              <div className="p-3.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
                <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" /> Multi-TF Trend
                </p>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-mono font-bold">H4 Horizon</span>
                    <NeoBadge variant={analysis.trendH4 === "BULLISH" ? "success" : analysis.trendH4 === "BEARISH" ? "danger" : "warning"}>
                      {analysis.trendH4}
                    </NeoBadge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-mono font-bold">H1 Primary</span>
                    <NeoBadge variant={analysis.trendH1 === "BULLISH" ? "success" : analysis.trendH1 === "BEARISH" ? "danger" : "warning"}>
                      {analysis.trendH1}
                    </NeoBadge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400 font-mono font-bold">M15 Entry</span>
                    <NeoBadge variant={analysis.trendM15 === "BULLISH" ? "success" : analysis.trendM15 === "BEARISH" ? "danger" : "warning"}>
                      {analysis.trendM15}
                    </NeoBadge>
                  </div>
                </div>
              </div>

              {/* 2. Technical Confluence (EMA & RSI) */}
              <div className="p-3.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
                <p className="text-[10px] font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FFE600]" /> Momentum & RSI(14)
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
                  <p className="text-[10px] text-gray-500 font-medium mt-1">
                    {analysis.rsi > 70 ? "Overbought Zone" : analysis.rsi < 30 ? "Oversold Zone" : "Momentum Bullish Sehat"}
                  </p>
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
          </div>
        </NeoCard>
      )}

      {/* AI Decision History Section */}
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
                <div className="flex items-center gap-2.5">
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

                <span className="text-[11px] text-gray-500 font-mono font-bold">
                  {formatDate(dec.timestamp)}
                </span>
              </div>

              {/* Reasoning */}
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                <strong className="text-[#050505] dark:text-white font-heading">Alasan Keputusan AI:</strong> {dec.reason}
              </p>

              {/* Risk Manager Explanation Note */}
              {dec.riskManagerNote && (
                <div className="p-3 bg-[#F9FAFB] dark:bg-[#07152F] border-l-4 border-[#1746FF] dark:border-[#00E5FF] border-2 border-r-[#050505] border-t-[#050505] border-b-[#050505] rounded text-xs text-gray-700 dark:text-gray-300 space-y-1 shadow-[2px_2px_0px_#050505]">
                  <div className="flex items-center gap-1.5 font-heading font-bold text-[#1746FF] dark:text-[#00E5FF] text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Evaluasi Risk Engine / CapitalGuard:
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
    </div>
  );
}
