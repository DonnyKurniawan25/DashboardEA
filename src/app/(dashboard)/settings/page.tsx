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
  const { demoMode, setDemoMode, accounts, selectedAccount, setSelectedAccount } = useAppStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [maxDrawdown, setMaxDrawdown] = useState("10.0");
  const [maxDailyLoss, setMaxDailyLoss] = useState("2500");
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState("0.5");
  const [maxPositions, setMaxPositions] = useState("3");
  const [equityShield, setEquityShield] = useState(true);

  // AI states
  const [minConfidence, setMinConfidence] = useState("65");
  const [riskProfile, setRiskProfile] = useState("MODERATE");
  const [autoExecute, setAutoExecute] = useState(false);

  // Notification states
  const [tgAlerts, setTgAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Pengaturan berhasil disimpan dan disinkronkan dengan parameter EA-Nevan!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleResetDefaults = () => {
    setMaxDrawdown("10.0");
    setMaxDailyLoss("2500");
    setMaxRiskPerTrade("0.5");
    setMaxPositions("3");
    setMinConfidence("65");
    setRiskProfile("MODERATE");
    setToastMessage("Pengaturan dikembalikan ke setelan default EA-Nevan (DEMO20).");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Settings & Konfigurasi"
        subtitle="Kelola Ambang Batas Risiko EA-Nevan, Parameter AI & Notifikasi"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Default
        </NeoButton>
      </PageHeader>

      {/* Save Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#00B843] dark:bg-[#74FF44] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] text-[#050505] text-xs font-heading font-bold rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Account & Environment Setting */}
        <NeoCard className="p-5">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#050505] pb-3">
            <User className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Mode Lingkungan & Target Akun
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
              <span className="text-xs font-heading font-bold text-[#050505] dark:text-white block">
                Mode Dashboard: {demoMode ? "DEMO SIMULASI" : "LIVE MONITORING MT5"}
              </span>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                Dalam mode demo, data akun simulasi dan transaksi contoh digunakan untuk uji coba strategi dan keandalan sistem tanpa risiko finansial.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDemoMode(true)}
                  className={`px-3 py-1.5 text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] ${
                    demoMode ? "bg-[#FFE600] text-[#050505]" : "bg-white dark:bg-[#0D2247] text-gray-500"
                  }`}
                >
                  DEMO MODE (Aktif)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Koneksi live MT5 memerlukan terminal MetaTrader 5 aktif dengan login valid.");
                  }}
                  className="px-3 py-1.5 text-xs font-heading font-bold border-2 border-[#050505] rounded bg-gray-200 dark:bg-[#0D2247] text-gray-600 dark:text-gray-400 shadow-[2px_2px_0px_#050505]"
                >
                  LIVE MT5 (Siap Terkoneksi)
                </button>
              </div>
            </div>

            <div className="p-4 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
              <span className="text-xs font-heading font-bold text-[#050505] dark:text-white block">
                Pilih Akun Utama Aktif
              </span>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                Pilih akun MT5 default untuk kalkulasi KPI, saldo balance, dan floating P/L di dashboard.
              </p>
              <select
                value={selectedAccount || ""}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#0D2247] text-[#050505] dark:text-white text-xs border-2 border-[#050505] rounded-md font-mono font-bold shadow-[2px_2px_0px_#050505]"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.broker} #{acc.accountNumber} ({acc.type.toUpperCase()}) — {acc.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </NeoCard>

        {/* 2. Risk Management Thresholds */}
        <NeoCard className="p-5">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#050505] pb-3">
            <Shield className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Guardrails Modal & Batas Stop EA-Nevan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                MAX DRAWDOWN (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={maxDrawdown}
                onChange={(e) => setMaxDrawdown(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Batas circuit breaker</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                MAX DAILY LOSS ($)
              </label>
              <input
                type="number"
                step="50"
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Hard daily cap (0.5%)</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                MAX RISK PER TRADE (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={maxRiskPerTrade}
                onChange={(e) => setMaxRiskPerTrade(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Risiko maksimal per tiket (0.5%)</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                MAX POSISI TERBUKA
              </label>
              <input
                type="number"
                value={maxPositions}
                onChange={(e) => setMaxPositions(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Maksimal 3 posisi simultan</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-[#050505] flex items-center justify-between">
            <div>
              <span className="text-xs font-heading font-bold text-[#050505] dark:text-white block">
                Equity Shield (Proteksi Modal 90%)
              </span>
              <span className="text-[11px] text-gray-600 dark:text-gray-400">
                Otomatis menutup seluruh transaksi terbuka jika modal turun mendekati batas 90%
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEquityShield(!equityShield)}
              className={cn(
                "px-3 py-1.5 text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]",
                equityShield ? "bg-[#00B843] dark:bg-[#74FF44] text-[#050505]" : "bg-gray-400 text-black"
              )}
            >
              {equityShield ? "AKTIF" : "NONAKTIF"}
            </button>
          </div>
        </NeoCard>

        {/* 3. AI Intelligence Parameters */}
        <NeoCard className="p-5">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#050505] pb-3">
            <Brain className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Ambang Batas Model Keputusan AI
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                MINIMAL CONFIDENCE (%)
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={minConfidence}
                onChange={(e) => setMinConfidence(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">
                Sinyal di bawah {minConfidence}% akan ditolak otomatis
              </span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                PROFIL STRATEGI
              </label>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              >
                <option value="CONSERVATIVE">KONSERVATIF (Fokus Win Rate)</option>
                <option value="MODERATE">MODERAT (Baseline EA-Nevan M15)</option>
                <option value="AGGRESSIVE">AGRESIF (Scalper Dinamis)</option>
              </select>
              <span className="text-[10px] text-gray-500 mt-1 block">Parameter lot & filter ATR</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                OTOMASI EKSEKUSI SINYAL
              </label>
              <button
                type="button"
                onClick={() => setAutoExecute(!autoExecute)}
                className={cn(
                  "w-full py-2 text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]",
                  autoExecute ? "bg-[#00B843] dark:bg-[#74FF44] text-[#050505]" : "bg-[#FF3B30] dark:bg-[#FF4B57] text-white"
                )}
              >
                {autoExecute ? "AUTO-EXECUTE AKTIF" : "KONFIRMASI MANUAL (SAFE)"}
              </button>
              <span className="text-[10px] text-gray-500 mt-1 block">Mode fail-safe eksekusi</span>
            </div>
          </div>
        </NeoCard>

        {/* 4. Notification Preferences */}
        <NeoCard className="p-5">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#050505] pb-3">
            <Bell className="w-5 h-5 text-[#00B843] dark:text-[#74FF44]" />
            <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
              Preferensi Saluran Notifikasi
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#F9FAFB] dark:bg-[#07152F] rounded-md border-2 border-[#050505] shadow-[2px_2px_0px_#050505]">
              <div>
                <span className="text-xs font-heading font-bold text-[#050505] dark:text-white block">
                  Notifikasi Telegram Bot
                </span>
                <span className="text-[11px] text-gray-600 dark:text-gray-400">
                  Kirim peringatan instan pada setiap pembukaan order, take profit, dan stop loss
                </span>
              </div>
              <input
                type="checkbox"
                checked={tgAlerts}
                onChange={(e) => setTgAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#1746FF] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#F9FAFB] dark:bg-[#07152F] rounded-md border-2 border-[#050505] shadow-[2px_2px_0px_#050505]">
              <div>
                <span className="text-xs font-heading font-bold text-[#050505] dark:text-white block">
                  Efek Suara Chime Saat Order Terisi
                </span>
                <span className="text-[11px] text-gray-600 dark:text-gray-400">
                  Bunyi notifikasi visual saat posisi baru dibuka atau ditutup
                </span>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#1746FF] cursor-pointer"
              />
            </div>
          </div>
        </NeoCard>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <NeoButton variant="primary" size="lg" type="submit" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Simpan Konfigurasi
          </NeoButton>
        </div>
      </form>
    </div>
  );
}
