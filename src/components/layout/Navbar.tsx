"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import {
  Bell,
  User,
  ChevronDown,
  Wifi,
  WifiOff,
  Brain,
  Bot,
  Shield,
  Plus,
  Check,
  LogOut,
  Zap,
  Sun,
  Moon,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const {
    demoMode,
    accounts,
    selectedAccount,
    setSelectedAccount,
    user,
    logout,
    theme,
    toggleTheme,
    notifications,
  } = useAppStore();

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const activeAccount =
    accounts.find((a) => a.id === selectedAccount) || accounts[0];
  const unreadNotifs = notifications?.filter((n) => !n.read).length ?? 0;

  const userName = user?.name || "Superadmin GoldShield";
  const userEmail = user?.email || "superadmin@goldshield.ai";
  const userRole = user?.role || "superadmin";

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request error:", err);
    }
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] dark:bg-[#07152F] border-b-2 border-[#050505] px-4 md:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Logo & Account Selector */}
        <div className="flex items-center gap-3">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-xs font-bold text-[#050505] dark:text-white">
              EA-NEVAN
            </span>
          </div>

          {/* Account Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F6] dark:bg-[#0D2247] text-[#050505] dark:text-white border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md hover:bg-[#E5E7EB] dark:hover:bg-[#132D5E] transition-colors"
            >
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Akun:</span>
              <span className="text-xs font-mono font-bold">
                #{activeAccount?.accountNumber || "71024589"}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#050505] ${activeAccount?.type === "real"
                  ? "bg-[#74FF44] text-[#050505]"
                  : "bg-[#FFE600] text-[#050505]"
                  }`}
              >
                {activeAccount?.broker || "Exness"} {activeAccount?.type?.toUpperCase() || "DEMO"}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {accountDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#FFFFFF] dark:bg-[#0D2247] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md p-2 z-50 space-y-1">
                <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider px-2 py-1">
                  Akun MT5 Terkoneksi
                </p>

                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccount(acc.id);
                      setAccountDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors ${selectedAccount === acc.id
                      ? "bg-[#E5E7EB] dark:bg-[#07152F] border border-[#1746FF] text-[#050505] dark:text-white"
                      : "hover:bg-[#F3F4F6] dark:hover:bg-[#07152F] text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-heading font-bold text-[#050505] dark:text-white">
                          {acc.broker} #{acc.accountNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1 rounded border border-[#050505] ${acc.type === "real" ? "bg-[#74FF44] text-[#050505]" : "bg-[#FFE600] text-[#050505]"
                            }`}
                        >
                          {acc.type.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        Server: {acc.server}
                      </span>
                    </div>

                    {selectedAccount === acc.id && (
                      <Check className="w-4 h-4 text-[#1746FF] dark:text-[#00E5FF]" />
                    )}
                  </button>
                ))}

                <div className="pt-2 border-t border-gray-200 dark:border-[#132D5E]">
                  <Link
                    href="/login"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="w-full neo-btn py-1.5 px-3 bg-[#00E5FF] hover:bg-[#00C8E0] text-[#050505] text-xs font-heading font-bold rounded flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Hubungkan Akun Exness Baru
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: EA-Nevan Status Telemetry */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* EA Core Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F3F4F6] dark:bg-[#0D2247] border border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
            <Bot className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#74FF44]" />
            <span className="text-[10px] font-heading font-bold text-[#050505] dark:text-white">
              EA-NEVAN: V1.220
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#74FF44] animate-pulse" />
          </div>

          {/* Target Symbol & TF */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F3F4F6] dark:bg-[#0D2247] border border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
            <span className="text-[10px] font-mono font-bold text-[#1746FF] dark:text-[#00E5FF]">
              XAUUSDm [M15]
            </span>
          </div>

          {/* Mode */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFE600] text-[#050505] border border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
            <span className="text-[10px] font-heading font-bold">
              DEMO20 BOUNDED
            </span>
          </div>
        </div>

        {/* Right: Theme Toggle + Connect Exness + User */}
        <div className="flex items-center gap-2">
          {/* THEME TOGGLE (LIGHT / DARK) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 bg-[#F3F4F6] dark:bg-[#0D2247] text-[#050505] dark:text-white border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md hover:bg-[#E5E7EB] dark:hover:bg-[#132D5E] transition-all flex items-center gap-1"
            title={theme === "light" ? "Ganti ke Dark Mode" : "Ganti ke Light Mode"}
          >
            {theme === "light" ? (
              <>
                <Moon className="w-4 h-4 text-[#1746FF]" />
                <span className="text-[10px] font-heading font-bold hidden sm:inline">DARK</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-[#FFE600]" />
                <span className="text-[10px] font-heading font-bold hidden sm:inline">LIGHT</span>
              </>
            )}
          </button>

          {/* Quick Connect Exness Pill */}
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] hover:bg-[#00C8E0] text-[#050505] text-xs font-heading font-bold border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md transition-all active:translate-x-[2px] active:shadow-none"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Konek Exness</span>
          </Link>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-[#050505] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#0D2247] rounded-md transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-[#FF4B57] text-white text-[9px] font-mono font-bold rounded-full border border-white dark:border-[#07152F] flex items-center justify-center">
                {unreadNotifs > 9 ? "9+" : unreadNotifs}
              </span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F3F4F6] dark:hover:bg-[#0D2247] rounded-md transition-colors"
            >
              <div className="w-7 h-7 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xs font-heading font-bold text-[#050505] dark:text-white max-w-[120px] truncate">
                  {userName}
                </span>
                <span
                  className={`text-[9px] font-heading font-bold px-1.5 py-0.5 rounded border border-[#050505] ${
                    userRole === "superadmin"
                      ? "bg-[#1746FF] text-white"
                      : userRole === "admin"
                      ? "bg-[#FFE600] text-[#050505]"
                      : "bg-[#74FF44] text-[#050505]"
                  }`}
                >
                  {userRole.toUpperCase()}
                </span>
              </div>
              <ChevronDown className="hidden sm:block w-3 h-3 text-gray-500" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#FFFFFF] dark:bg-[#0D2247] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md p-2 z-50 space-y-2">
                <div className="p-2 border-b border-gray-200 dark:border-[#132D5E] space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-heading font-bold text-[#050505] dark:text-white truncate">
                      {userName}
                    </p>
                    <span
                      className={`text-[9px] font-heading font-bold px-1.5 py-0.2 rounded border border-[#050505] ${
                        userRole === "superadmin"
                          ? "bg-[#1746FF] text-white"
                          : userRole === "admin"
                          ? "bg-[#FFE600] text-[#050505]"
                          : "bg-[#74FF44] text-[#050505]"
                      }`}
                    >
                      {userRole.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono truncate">
                    {userEmail}
                  </p>
                </div>

                <Link
                  href="/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 w-full p-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#F3F4F6] dark:hover:bg-[#07152F] rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
                  <span>Koneksikan Akun Exness</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 w-full p-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#F3F4F6] dark:hover:bg-[#07152F] rounded transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
                  <span>Pengaturan Guardrail & Profil</span>
                </Link>

                <div className="pt-1 border-t border-gray-200 dark:border-[#132D5E]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full p-2 text-xs text-[#FF4B57] hover:bg-[#FF4B57]/10 rounded transition-colors font-heading font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
