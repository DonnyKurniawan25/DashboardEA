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
    setSimulatedNotice("Equity Shield state toggle simulated in DEMO MODE.");
    setTimeout(() => setSimulatedNotice(null), 4000);
  };

  if (loading || !risk) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Risk Center"
          subtitle="Real-Time Risk Monitoring & Guardrail Management"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <NeoCard key={i} className="p-6 bg-[#0D2247]">
              <Skeleton className="h-20 w-full" />
            </NeoCard>
          ))}
        </div>
      </div>
    );
  }

  const isWarning = risk.riskStatus !== "SAFE";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Center"
        subtitle="Institutional Capital Protection & Automated Risk Guardrails"
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
        <div className="p-3 bg-[#1746FF]/20 border-2 border-[#1746FF] shadow-[3px_3px_0px_#050505] rounded-md text-xs font-heading text-white">
          {simulatedNotice}
        </div>
      )}

      {/* Global Status Banner */}
      <div
        className={cn(
          "p-4 border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
          risk.riskStatus === "SAFE"
            ? "bg-[#74FF44]/15 border-[#74FF44]"
            : "bg-[#FF4B57]/15 border-[#FF4B57]"
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
            <h3 className="font-heading font-bold text-white text-base">
              Capital Guardrail Status: {risk.riskStatus}
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              {risk.riskStatus === "SAFE"
                ? "All 8 risk parameters are within normal variance thresholds. EA trading permitted."
                : "Active risk breach detected! Automated trade throttling in progress."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleEquityShield}
            className="neo-btn px-4 py-2 bg-[#07152F] hover:bg-[#132D5E] text-white text-xs font-heading font-bold rounded-md flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5 text-[#00E5FF]" />
            Equity Shield: {risk.equityShield ? "ENGAGED" : "DISABLED"}
          </button>
        </div>
      </div>

      {/* 6 Core Risk Guardrail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Drawdown Monitor */}
        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Drawdown Monitor
            </span>
            <NeoBadge variant={risk.currentDrawdown > 5 ? "danger" : "success"}>
              {risk.currentDrawdown}% DD
            </NeoBadge>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-heading font-bold text-white">
              {risk.currentDrawdown.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-400 font-mono">
              Peak: {risk.maxDrawdown.toFixed(2)}% / Hard Stop: 10%
            </p>
          </div>
          <div className="w-full bg-[#07152F] h-2.5 rounded-full overflow-hidden border border-[#050505]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                risk.currentDrawdown > 7
                  ? "bg-[#FF4B57]"
                  : risk.currentDrawdown > 4
                  ? "bg-[#FFE600]"
                  : "bg-[#74FF44]"
              )}
              style={{ width: `${(risk.currentDrawdown / 10) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            Safety threshold alerts at 5.0% DD
          </p>
        </NeoCard>

        {/* 2. Daily Loss Limit */}
        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Daily Loss Limit
            </span>
            <NeoBadge variant="info">
              {((risk.maxDailyLoss / risk.maxDailyLossLimit) * 100).toFixed(0)}% Used
            </NeoBadge>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-heading font-bold text-white">
              {formatCurrency(risk.maxDailyLoss)}
            </p>
            <p className="text-xs text-gray-400 font-mono">
              Limit: {formatCurrency(risk.maxDailyLossLimit)}
            </p>
          </div>
          <div className="w-full bg-[#07152F] h-2.5 rounded-full overflow-hidden border border-[#050505]">
            <div
              className="h-full rounded-full bg-[#00E5FF] transition-all duration-500"
              style={{
                width: `${Math.min((risk.maxDailyLoss / risk.maxDailyLossLimit) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            Resets automatically at 00:00 MT5 Server Time
          </p>
        </NeoCard>

        {/* 3. Margin Level Alert */}
        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Margin Level Buffer
            </span>
            <NeoBadge variant={risk.marginLevel < 300 ? "danger" : "success"}>
              HEALTHY
            </NeoBadge>
          </div>
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-2xl font-heading font-bold text-[#74FF44]">
              {risk.marginLevel.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-400 font-mono">
              Alert Trigger: {risk.marginLevelAlert}%
            </p>
          </div>
          <div className="w-full bg-[#07152F] h-2.5 rounded-full overflow-hidden border border-[#050505]">
            <div
              className="h-full rounded-full bg-[#74FF44] transition-all duration-500"
              style={{ width: `${Math.min((risk.marginLevel / 1500) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            Margin call safety buffer: 6.4x above requirement
          </p>
        </NeoCard>

        {/* 4. Open Positions Cap */}
        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Active Trade Capacity
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {risk.currentOpenPositions} / {risk.maxOpenPositions} Max
            </span>
          </div>
          <p className="text-2xl font-heading font-bold text-white mb-1">
            {risk.currentOpenPositions} Orders
          </p>
          <div className="w-full bg-[#07152F] h-2.5 rounded-full overflow-hidden border border-[#050505]">
            <div
              className="h-full rounded-full bg-[#FFE600] transition-all duration-500"
              style={{
                width: `${(risk.currentOpenPositions / risk.maxOpenPositions) * 100}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            4 slots remaining before automated entry freeze
          </p>
        </NeoCard>

        {/* 5. Max Risk Per Trade */}
        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Risk Per Single Trade
            </span>
            <NeoBadge variant="info">Enforced</NeoBadge>
          </div>
          <p className="text-2xl font-heading font-bold text-white mb-1">
            {risk.currentRiskPerTrade}%
          </p>
          <div className="w-full bg-[#07152F] h-2.5 rounded-full overflow-hidden border border-[#050505]">
            <div
              className="h-full rounded-full bg-[#1746FF] transition-all duration-500"
              style={{
                width: `${(risk.currentRiskPerTrade / risk.maxRiskPerTrade) * 100}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            Hard cap: {risk.maxRiskPerTrade}% equity per trade
          </p>
        </NeoCard>

        {/* 6. Consecutive Loss Circuit Breaker */}
        <NeoCard className="p-4 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider">
              Streak Circuit Breaker
            </span>
            <NeoBadge variant="success">Normal</NeoBadge>
          </div>
          <p className="text-2xl font-heading font-bold text-white mb-1">
            {risk.consecutiveLosses} / {risk.maxConsecutiveLosses} Loss Streak
          </p>
          <div className="flex gap-1.5 mt-2">
            {Array.from({ length: risk.maxConsecutiveLosses }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-3 rounded-sm border border-[#050505]",
                  i < risk.consecutiveLosses ? "bg-[#FF4B57]" : "bg-[#07152F]"
                )}
              />
            ))}
          </div>
          <p className="text-[10px] text-gray-500 mt-2">
            5 consecutive losses triggers 24h trading cooldown
          </p>
        </NeoCard>
      </div>

      {/* Exposure Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exposure by Symbol */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#00E5FF]" />
              <h3 className="font-heading font-bold text-white text-base">
                Capital Exposure by Symbol
              </h3>
            </div>
            <span className="text-xs text-gray-400">Total: $42,600 Exposure</span>
          </div>

          <div className="space-y-3">
            {risk.exposureBySymbol.map((exp) => (
              <div key={exp.symbol} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-bold text-white">
                    {exp.symbol}
                  </span>
                  <span className="font-mono text-gray-300">
                    {formatCurrency(exp.exposure)} ({exp.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#07152F] h-2.5 rounded-full overflow-hidden border border-[#050505]">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      exp.symbol === "XAUUSD"
                        ? "bg-[#FFE600]"
                        : exp.symbol === "EURUSD"
                        ? "bg-[#00E5FF]"
                        : exp.symbol === "USDJPY"
                        ? "bg-[#1746FF]"
                        : "bg-[#74FF44]"
                    )}
                    style={{ width: `${exp.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </NeoCard>

        {/* Exposure by Direction (Long vs Short) */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#74FF44]" />
              <h3 className="font-heading font-bold text-white text-base">
                Directional Bias Allocation
              </h3>
            </div>
            <span className="text-xs text-gray-400">Net Delta: Bullish</span>
          </div>

          <div className="p-4 bg-[#07152F] border-2 border-[#050505] rounded-md mb-4 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-heading">LONG (BUY)</p>
                <p className="text-2xl font-heading font-bold text-[#74FF44]">67%</p>
                <p className="text-xs font-mono text-gray-500">$28,800</p>
              </div>
              <div className="border-l border-[#132D5E]">
                <p className="text-xs text-gray-400 font-heading">SHORT (SELL)</p>
                <p className="text-2xl font-heading font-bold text-[#FF4B57]">33%</p>
                <p className="text-xs font-mono text-gray-500">$14,400</p>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#07152F] h-4 rounded-full overflow-hidden flex border-2 border-[#050505]">
            <div className="bg-[#74FF44] h-full" style={{ width: "67%" }} title="Long 67%" />
            <div className="bg-[#FF4B57] h-full" style={{ width: "33%" }} title="Short 33%" />
          </div>

          <div className="flex justify-between items-center text-xs mt-2 text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#74FF44] rounded-sm" /> LONG Exposure
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#FF4B57] rounded-sm" /> SHORT Exposure
            </span>
          </div>
        </NeoCard>
      </div>

      {/* Risk Event Log */}
      <NeoCard className="p-0 overflow-hidden bg-[#0D2247]">
        <div className="p-4 border-b-2 border-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#FFE600]" />
            <h3 className="font-heading font-bold text-white text-base">
              Risk Event History & System Audit
            </h3>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {events.length} events logged
          </span>
        </div>

        <div className="divide-y divide-[#132D5E]">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-[#07152F]/40 transition-colors">
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
                  <p className="text-xs font-heading font-bold text-white">
                    {ev.message}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {ev.type} • {formatDate(ev.timestamp)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {ev.resolved ? (
                  <span className="text-[10px] font-bold text-[#74FF44] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#FFE600] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Active
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

