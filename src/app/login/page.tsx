"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/store";
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Server,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Zap,
  Globe,
  DollarSign,
  Sparkles,
  Layers,
  HelpCircle,
  Sun,
  Moon,
  Bot,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, addExnessAccount, theme, toggleTheme } = useAppStore();

  const [activeTab, setActiveTab] = useState<"exness" | "platform">("exness");

  // Exness Form State
  const [exnessType, setExnessType] = useState<"demo" | "real">("demo");
  const [accountNumber, setAccountNumber] = useState("");
  const [mt5Password, setMt5Password] = useState("");
  const [server, setServer] = useState("Exness-MT5Trial7");
  const [currency, setCurrency] = useState("USD");
  const [leverage, setLeverage] = useState("1:500");
  const [showPassword, setShowPassword] = useState(false);

  // Platform Form State
  const [email, setEmail] = useState("trader@goldshield.ai");
  const [password, setPassword] = useState("");

  // Status & Handshake State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Common Exness Servers
  const demoServers = [
    "Exness-MT5Trial7",
    "Exness-MT5Trial",
    "Exness-MT5Trial2",
    "Exness-MT5Trial3",
  ];

  const realServers = [
    "Exness-MT5Real",
    "Exness-MT5Real2",
    "Exness-MT5Real3",
    "Exness-MT5Real4",
    "Exness-MT5Real5",
    "Exness-MT5Real6",
    "Exness-MT5Real7",
    "Exness-MT5Real8",
  ];

  const handleExnessTypeChange = (type: "demo" | "real") => {
    setExnessType(type);
    setServer(type === "real" ? "Exness-MT5Real" : "Exness-MT5Trial7");
  };

  const handleQuickDemo = () => {
    setExnessType("demo");
    setAccountNumber("71024589");
    setMt5Password("DemoExness2026!");
    setServer("Exness-MT5Trial7");
    setCurrency("USD");
    setLeverage("1:500");
    setErrorNotice(null);
  };

  const handleExnessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) {
      setErrorNotice("Silakan masukkan Nomor Akun MT5 Exness Anda.");
      return;
    }

    setErrorNotice(null);
    setIsSubmitting(true);

    try {
      // Handshake animation steps
      setHandshakeStep(`Pinging ${server} Gateway...`);
      await new Promise((r) => setTimeout(r, 500));

      setHandshakeStep(`Mengotentikasi Akun MT5 #${accountNumber}...`);
      await new Promise((r) => setTimeout(r, 600));

      setHandshakeStep("Sinkronisasi EA-Nevan & Status Margin...");
      await new Promise((r) => setTimeout(r, 500));

      // Add to store
      addExnessAccount({
        accountNumber: accountNumber.trim(),
        type: exnessType,
        server,
        currency,
        leverage,
        balance: exnessType === "real" ? 12500.0 : 50000.0,
        equity: exnessType === "real" ? 12785.4 : 50820.0,
      });

      login(
        `exness-${accountNumber}@goldshield.ai`,
        `Exness ${exnessType.toUpperCase()} #${accountNumber}`
      );

      setHandshakeStep("Koneksi Berhasil! Mengalihkan ke Dashboard...");
      await new Promise((r) => setTimeout(r, 400));

      router.push("/");
    } catch {
      setErrorNotice("Gagal melakukan handshake dengan server MT5 Exness. Periksa server dan nomor akun.");
      setIsSubmitting(false);
      setHandshakeStep(null);
    }
  };

  const handlePlatformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHandshakeStep("Memverifikasi kredensial...");
    await new Promise((r) => setTimeout(r, 700));

    login(email, "GoldShield Admin");
    setHandshakeStep("Login Berhasil! Mengalihkan...");
    await new Promise((r) => setTimeout(r, 400));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#07152F] flex flex-col justify-center items-center p-4 sm:p-6 text-[#050505] dark:text-white relative overflow-hidden transition-colors duration-200">
      {/* Background Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1746FF_1px,transparent_1px)] dark:bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Controls: Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-2 bg-white dark:bg-[#0D2247] text-[#050505] dark:text-white border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md hover:bg-gray-100 dark:hover:bg-[#132D5E] transition-all flex items-center gap-1.5"
          title={theme === "light" ? "Ganti ke Dark Mode" : "Ganti ke Light Mode"}
        >
          {theme === "light" ? (
            <>
              <Moon className="w-4 h-4 text-[#1746FF]" />
              <span className="text-xs font-heading font-bold">DARK MODE</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-[#FFE600]" />
              <span className="text-xs font-heading font-bold">LIGHT MODE</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1746FF] border-3 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-lg mb-1">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-wider text-[#050505] dark:text-white">
            GOLDSHIELD AI
          </h1>
          <p className="text-xs font-bold text-[#1746FF] dark:text-[#00E5FF] tracking-[0.2em] font-heading">
            TRADING INTELLIGENCE & EA-NEVAN
          </p>
        </div>

        {/* Neo Brutalist Card */}
        <div className="neo-card bg-white dark:bg-[#0D2247] p-6 sm:p-8 space-y-6 border-3 border-[#050505] shadow-[6px_6px_0px_#050505]">
          {/* Tab Selection */}
          <div className="grid grid-cols-2 gap-2 bg-[#F4F5F7] dark:bg-[#07152F] p-1.5 border-2 border-[#050505] rounded-md shadow-[3px_3px_0px_#050505]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("exness");
                setErrorNotice(null);
              }}
              className={`py-2 text-xs font-heading font-bold rounded transition-all ${
                activeTab === "exness"
                  ? "bg-[#00E5FF] text-[#050505] border-2 border-[#050505] shadow-[2px_2px_0px_#050505]"
                  : "text-gray-600 dark:text-gray-400 hover:text-[#050505] dark:hover:text-white"
              }`}
            >
              ⚡ Konek Akun Exness
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("platform");
                setErrorNotice(null);
              }}
              className={`py-2 text-xs font-heading font-bold rounded transition-all ${
                activeTab === "platform"
                  ? "bg-[#1746FF] text-white border-2 border-[#050505] shadow-[2px_2px_0px_#050505]"
                  : "text-gray-600 dark:text-gray-400 hover:text-[#050505] dark:hover:text-white"
              }`}
            >
              🔐 Login Platform
            </button>
          </div>

          {/* Error Message */}
          {errorNotice && (
            <div className="p-3 bg-[#FF4B57]/15 border-2 border-[#FF4B57] text-[#FF4B57] text-xs font-heading font-bold rounded-md flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Handshake Progress Indicator */}
          {isSubmitting && handshakeStep && (
            <div className="p-4 bg-[#F4F5F7] dark:bg-[#07152F] border-2 border-[#1746FF] dark:border-[#00E5FF] shadow-[3px_3px_0px_#050505] rounded-md text-center space-y-2 animate-pulse">
              <div className="w-6 h-6 border-2 border-[#1746FF] dark:border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-heading font-bold text-[#1746FF] dark:text-[#00E5FF]">
                {handshakeStep}
              </p>
            </div>
          )}

          {/* FORM 1: EXNESS MT5 DIRECT CONNECT */}
          {activeTab === "exness" && !isSubmitting && (
            <form onSubmit={handleExnessSubmit} className="space-y-4">
              {/* Account Type Selector (Demo vs Real) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-heading font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Tipe Akun Exness
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleExnessTypeChange("demo")}
                    className={`py-2 px-3 text-xs font-heading font-bold border-2 border-[#050505] rounded-md transition-all ${
                      exnessType === "demo"
                        ? "bg-[#FFE600] text-[#050505] shadow-[3px_3px_0px_#050505]"
                        : "bg-[#F4F5F7] dark:bg-[#07152F] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    🟡 EXNESS DEMO
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExnessTypeChange("real")}
                    className={`py-2 px-3 text-xs font-heading font-bold border-2 border-[#050505] rounded-md transition-all ${
                      exnessType === "real"
                        ? "bg-[#74FF44] text-[#050505] shadow-[3px_3px_0px_#050505]"
                        : "bg-[#F4F5F7] dark:bg-[#07152F] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    🟢 EXNESS REAL
                  </button>
                </div>
              </div>

              {/* MT5 Account Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-heading font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Nomor Akun MT5 Exness
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={exnessType === "demo" ? "Contoh: 71024589" : "Nomor Akun Real Exness"}
                    className="w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#07152F] text-[#050505] dark:text-white font-mono text-sm border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF] dark:focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              {/* MT5 Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-heading font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                    Password MT5 (Trading / Investor)
                  </label>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">Investor didukung</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={mt5Password}
                    onChange={(e) => setMt5Password(e.target.value)}
                    placeholder="Password Akun MT5"
                    className="w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#07152F] text-[#050505] dark:text-white font-mono text-sm border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF] dark:focus:border-[#00E5FF] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Server Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-heading font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Pilih Server Exness
                </label>
                <select
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#07152F] text-[#050505] dark:text-white font-mono text-sm border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF] dark:focus:border-[#00E5FF]"
                >
                  {(exnessType === "demo" ? demoServers : realServers).map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency & Leverage Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                    Mata Uang Akun
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="IDR">IDR (Rp)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-heading font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                    Leverage Akun
                  </label>
                  <select
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] dark:bg-[#07152F] text-[#050505] dark:text-white text-xs font-mono border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
                  >
                    <option value="1:200">1:200</option>
                    <option value="1:500">1:500 (Default)</option>
                    <option value="1:1000">1:1000</option>
                    <option value="1:2000">1:2000</option>
                    <option value="1:Unlimited">1:Unlimited</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full neo-btn bg-[#00E5FF] hover:bg-[#00C8E0] text-[#050505] font-heading font-bold py-3 rounded-md text-sm uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
              >
                Koneksikan Akun Exness <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Autofill Button */}
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2 bg-[#FFE600] hover:bg-[#ffe000] text-[#050505] border-2 border-[#050505] rounded text-xs font-heading font-bold flex items-center justify-center gap-1.5 transition-colors shadow-[2px_2px_0px_#050505]"
              >
                <Zap className="w-3.5 h-3.5 text-[#050505]" />
                Gunakan Contoh Akun Exness Demo (1-Click)
              </button>
            </form>
          )}

          {/* FORM 2: PLATFORM ADMIN LOGIN */}
          {activeTab === "platform" && !isSubmitting && (
            <form onSubmit={handlePlatformSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-heading font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Email / Username
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@goldshield.ai"
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#07152F] text-[#050505] dark:text-white text-sm border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-heading font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block">
                  Master Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] dark:bg-[#07152F] text-[#050505] dark:text-white text-sm border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF]"
                />
              </div>

              <button
                type="submit"
                className="w-full neo-btn bg-[#1746FF] hover:bg-[#1239DD] text-white font-heading font-bold py-3 rounded-md text-sm uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
              >
                Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Security & EA-Nevan Note Footer */}
          <div className="p-3 bg-[#F4F5F7] dark:bg-[#07152F] border-2 border-[#050505] rounded-md text-[11px] text-gray-700 dark:text-gray-300 space-y-1 shadow-[2px_2px_0px_#050505]">
            <div className="flex items-center gap-1.5 font-heading font-bold text-[#1746FF] dark:text-[#00E5FF]">
              <Lock className="w-3.5 h-3.5" /> Keamanan End-to-End & Bridge EA-Nevan
            </div>
            <p className="leading-relaxed text-[11px]">
              Kredensial Anda dienkripsi dan diproses secara aman untuk handshake MT5 Bridge lokal. Terkoneksi otomatis dengan robot trading <strong>EA-Nevan (v1.220)</strong>.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-[#1746FF] dark:hover:text-[#00E5FF] font-heading font-bold underline"
          >
            ← Kembali ke Dashboard (Mode Demo Langsung)
          </Link>
        </div>
      </div>
    </div>
  );
}
