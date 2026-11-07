"use client";

import React, { useState, useEffect } from "react";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  NeoModal,
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
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  const {
    demoMode,
    setDemoMode,
    accounts,
    selectedAccount,
    setSelectedAccount,
    user,
    setUser,
    riskMetrics,
    updateRiskMetrics,
    resetToDemoDefaults,
  } = useAppStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // User Profile
  const [userName, setUserName] = useState(user?.name || "Superadmin GoldShield");
  const [userEmail, setUserEmail] = useState(user?.email || "superadmin@goldshield.ai");
  const [gatewayUrl, setGatewayUrl] = useState("http://localhost:8000");

  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
    }
  }, [user]);

  // Form states (Risk)
  const [maxDrawdown, setMaxDrawdown] = useState(String(riskMetrics.maxDrawdown));
  const [maxDailyLoss, setMaxDailyLoss] = useState(String(riskMetrics.maxDailyLossLimit));
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState(String(riskMetrics.maxRiskPerTrade));
  const [maxPositions, setMaxPositions] = useState(String(riskMetrics.maxOpenPositions));
  const [equityShield, setEquityShield] = useState(riskMetrics.equityShield);

  // AI states
  const [minConfidence, setMinConfidence] = useState("65");
  const [riskProfile, setRiskProfile] = useState("MODERATE");
  const [autoExecute, setAutoExecute] = useState(false);

  // Notification states
  const [tgAlerts, setTgAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        name: userName.trim(),
        email: userEmail.trim(),
      });
    }

    updateRiskMetrics({
      maxDrawdown: parseFloat(maxDrawdown) || 10.0,
      maxDailyLossLimit: parseFloat(maxDailyLoss) || 2500,
      maxRiskPerTrade: parseFloat(maxRiskPerTrade) || 0.5,
      maxOpenPositions: parseInt(maxPositions, 10) || 3,
      equityShield,
    });

    showToast("Seluruh pengaturan dan guardrail berhasil disimpan!");
  };

  const handleConfirmReset = () => {
    resetToDemoDefaults();
    setIsResetModalOpen(false);
    showToast("Seluruh data akun, posisi, bot, dan riwayat berhasil di-reset ke nilai default!");
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
          onClick={() => setIsResetModalOpen(true)}
          className="flex items-center gap-1.5 text-[#FF4B57]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Semua Data</span>
        </NeoButton>
      </PageHeader>

      {/* Save Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#00B843] dark:bg-[#74FF44] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] text-[#050505] text-xs font-heading font-bold rounded-md flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Account & Environment Setting */}
        <NeoCard className="p-5">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#050505] pb-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
              <h3 className="font-heading font-bold text-[#050505] dark:text-white text-base">
                Profil Pengguna & Target Akun
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">HAK AKSES:</span>
              <span
                className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded border border-[#050505] shadow-[1px_1px_0px_#050505] ${
                  user?.role === "superadmin"
                    ? "bg-[#1746FF] text-white"
                    : user?.role === "admin"
                    ? "bg-[#FFE600] text-[#050505]"
                    : "bg-[#74FF44] text-[#050505]"
                }`}
              >
                👑 {(user?.role || "superadmin").toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                NAMA TRADER
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                EMAIL LOGIN
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                FASTAPI MT5 GATEWAY
              </label>
              <input
                type="text"
                value={gatewayUrl}
                onChange={(e) => setGatewayUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t-2 border-[#050505]">
            <div className="p-3.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
              <span className="text-xs font-heading font-bold text-[#050505] dark:text-white block">
                Mode Dashboard: {demoMode ? "DEMO SIMULASI" : "LIVE MONITORING MT5"}
              </span>
              <p className="text-[11px] text-gray-600 dark:text-gray-400">
                Data simulasi memungkinkan pengujian tanpa risiko. Beralih ke Live ketika terminal MT5 terhubung.
              </p>
              <div className="pt-1 flex items-center gap-2">
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
                  onClick={() => setDemoMode(false)}
                  className={`px-3 py-1.5 text-xs font-heading font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] ${
                    !demoMode ? "bg-[#74FF44] text-[#050505]" : "bg-white dark:bg-[#0D2247] text-gray-500"
                  }`}
                >
                  LIVE MONITORING
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-[#F9FAFB] dark:bg-[#07152F] border-2 border-[#050505] rounded-md space-y-2 shadow-[2px_2px_0px_#050505]">
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
                    #{acc.accountNumber} — {acc.broker} ({acc.type.toUpperCase()}) [{acc.currency}]
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
              <span className="text-[10px] text-gray-500 mt-1 block">Batas drawdown portofolio</span>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 block mb-1">
                MAX DAILY LOSS ($)
              </label>
              <input
                type="number"
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono font-bold border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Kerugian maksimal harian</span>
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

      {/* ─── RESET ALL DATA CONFIRMATION MODAL ────────────── */}
      <NeoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Seluruh Data Dashboard"
        subtitle="Kembalikan semua akun, posisi, bot, dan riwayat ke kondisi awal"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-[#FF4B57]/15 border-2 border-[#FF4B57] rounded text-xs text-[#FF4B57] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Tindakan ini akan menghapus seluruh data kustom yang baru Anda tambahkan dan memulihkan demo default EA-Nevan.
            </span>
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300">
            Apakah Anda yakin ingin melakukan factory reset data dashboard sekarang?
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetModalOpen(false)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmReset}
            >
              Ya, Reset Semua Data
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
