"use client";

import React, { useState } from "react";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  NeoInput,
  NeoSelect,
  PageHeader,
} from "@/components/ui";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  Settings,
  Shield,
  Brain,
  Bell,
  Save,
  CheckCircle2,
  Lock,
  User,
  Sliders,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { demoMode, setDemoMode } = useAppStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [maxDrawdown, setMaxDrawdown] = useState("10.0");
  const [maxDailyLoss, setMaxDailyLoss] = useState("2500");
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState("2.0");
  const [maxPositions, setMaxPositions] = useState("10");
  const [equityShield, setEquityShield] = useState(true);

  // AI states
  const [minConfidence, setMinConfidence] = useState("65");
  const [riskProfile, setRiskProfile] = useState("MODERATE");
  const [autoExecute, setAutoExecute] = useState(true);

  // Notification states
  const [tgAlerts, setTgAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Settings updated and synchronized with local storage & mock backend!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetDefaults = () => {
    setMaxDrawdown("10.0");
    setMaxDailyLoss("2500");
    setMaxRiskPerTrade("2.0");
    setMaxPositions("10");
    setMinConfidence("65");
    setRiskProfile("MODERATE");
    setToastMessage("Settings restored to factory defaults.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Manage Risk Guardrail Thresholds, AI Parameters & Notifications"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
        </NeoButton>
      </PageHeader>

      {/* Save Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#74FF44] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] text-[#050505] text-xs font-heading font-bold rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Account & Environment Setting */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <div className="flex items-center gap-2 mb-4 border-b border-[#132D5E] pb-3">
            <User className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-white text-base">
              Environment & Data Mode
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2">
              <span className="text-xs font-heading font-bold text-white block">
                Dashboard Mode: {demoMode ? "DEMO SIMULATION" : "LIVE MT5"}
              </span>
              <p className="text-[11px] text-gray-400">
                In demo mode, simulated transactions, AI triggers, and risk events are used for safety testing.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDemoMode(true)}
                  className={`px-3 py-1.5 text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] ${
                    demoMode ? "bg-[#FFE600] text-[#050505]" : "bg-[#0D2247] text-gray-400"
                  }`}
                >
                  DEMO MODE (Active)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Live mode requires MT5 bridge authentication and active WebSocket server.");
                  }}
                  className="px-3 py-1.5 text-xs font-heading font-bold border-2 border-[#050505] rounded bg-[#0D2247] text-gray-500 shadow-[2px_2px_0px_#050505] cursor-not-allowed"
                >
                  LIVE MT5 (Locked)
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2">
              <span className="text-xs font-heading font-bold text-white block">
                Primary Account Target
              </span>
              <p className="text-[11px] text-gray-400">
                Select default active account for dashboard KPI computations.
              </p>
              <select className="w-full px-3 py-2 bg-[#0D2247] text-white text-xs border-2 border-[#050505] rounded-md font-mono">
                <option value="acc-1">Exness MT5 (71024589) — USD</option>
                <option value="acc-2">Finex MT5 (30981276) — USD</option>
                <option value="acc-3">ICMarkets MT5 (50234871) — EUR</option>
              </select>
            </div>
          </div>
        </NeoCard>

        {/* 2. Risk Management Thresholds */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <div className="flex items-center gap-2 mb-4 border-b border-[#132D5E] pb-3">
            <Shield className="w-5 h-5 text-[#FFE600]" />
            <h3 className="font-heading font-bold text-white text-base">
              Capital Guardrails & Stop Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-heading font-bold text-gray-400 block mb-1">
                MAX DRAWDOWN (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={maxDrawdown}
                onChange={(e) => setMaxDrawdown(e.target.value)}
                className="w-full px-3 py-2 bg-[#07152F] text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Circuit breaker limit</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-400 block mb-1">
                MAX DAILY LOSS ($)
              </label>
              <input
                type="number"
                step="50"
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(e.target.value)}
                className="w-full px-3 py-2 bg-[#07152F] text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Hard daily cap</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-400 block mb-1">
                MAX RISK PER TRADE (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={maxRiskPerTrade}
                onChange={(e) => setMaxRiskPerTrade(e.target.value)}
                className="w-full px-3 py-2 bg-[#07152F] text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Per-ticket exposure</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-400 block mb-1">
                MAX OPEN POSITIONS
              </label>
              <input
                type="number"
                value={maxPositions}
                onChange={(e) => setMaxPositions(e.target.value)}
                className="w-full px-3 py-2 bg-[#07152F] text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Maximum concurrency</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#132D5E] flex items-center justify-between">
            <div>
              <span className="text-xs font-heading font-bold text-white block">
                Equity Shield Emergency Automation
              </span>
              <span className="text-[11px] text-gray-400">
                Instantly closes all active positions if drawdown breaches 9.5%
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEquityShield(!equityShield)}
              className={cn(
                "px-3 py-1 text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]",
                equityShield ? "bg-[#74FF44] text-[#050505]" : "bg-gray-600 text-white"
              )}
            >
              {equityShield ? "ENABLED" : "DISABLED"}
            </button>
          </div>
        </NeoCard>

        {/* 3. AI Intelligence Parameters */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <div className="flex items-center gap-2 mb-4 border-b border-[#132D5E] pb-3">
            <Brain className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-white text-base">
              AI Decision Engine Thresholds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-heading font-bold text-gray-400 block mb-1">
                MIN CONFIDENCE THRESHOLD (%)
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={minConfidence}
                onChange={(e) => setMinConfidence(e.target.value)}
                className="w-full px-3 py-2 bg-[#07152F] text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Signals below {minConfidence}% will be rejected
              </span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-400 block mb-1">
                STRATEGY PROFILE
              </label>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="w-full px-3 py-2 bg-[#07152F] text-white text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              >
                <option value="CONSERVATIVE">CONSERVATIVE (High win rate)</option>
                <option value="MODERATE">MODERATE (Balanced)</option>
                <option value="AGGRESSIVE">AGGRESSIVE (Scalper)</option>
              </select>
              <span className="text-[10px] text-gray-500 mt-1 block">Lot scaling & grid multiplier</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-400 block mb-1">
                AUTO-EXECUTE SIGNALS
              </label>
              <button
                type="button"
                onClick={() => setAutoExecute(!autoExecute)}
                className={cn(
                  "w-full py-2 text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]",
                  autoExecute ? "bg-[#74FF44] text-[#050505]" : "bg-[#FF4B57] text-white"
                )}
              >
                {autoExecute ? "AUTO-EXECUTE ON" : "CONFIRMATION REQUIRED"}
              </button>
              <span className="text-[10px] text-gray-500 mt-1 block">Autonomous bot dispatch</span>
            </div>
          </div>
        </NeoCard>

        {/* 4. Notification Preferences */}
        <NeoCard className="p-5 bg-[#0D2247]">
          <div className="flex items-center gap-2 mb-4 border-b border-[#132D5E] pb-3">
            <Bell className="w-5 h-5 text-[#74FF44]" />
            <h3 className="font-heading font-bold text-white text-base">
              Notification Channels
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 bg-[#07152F] rounded border border-[#132D5E]">
              <div>
                <span className="text-xs font-heading font-bold text-white block">
                  Telegram Bot Dispatches (@GoldShieldAIBot)
                </span>
                <span className="text-[11px] text-gray-400">
                  Instant push alerts for every trade execution and take profit
                </span>
              </div>
              <input
                type="checkbox"
                checked={tgAlerts}
                onChange={(e) => setTgAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#00E5FF] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#07152F] rounded border border-[#132D5E]">
              <div>
                <span className="text-xs font-heading font-bold text-white block">
                  Audible UI Chime on Order Fill
                </span>
                <span className="text-[11px] text-gray-400">
                  Subtle Neo-Brutalist sound effect when positions open or close
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#00E5FF] cursor-pointer"
              />
            </div>
          </div>
        </NeoCard>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <NeoButton variant="primary" size="lg" type="submit" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Configuration
          </NeoButton>
        </div>
      </form>
    </div>
  );
}

