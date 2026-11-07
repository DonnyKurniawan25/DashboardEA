"use client";

import React, { useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function Navbar() {
  const {
    demoMode,
    accounts,
    selectedAccount,
    setSelectedAccount,
    user,
    logout,
  } = useAppStore();

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const activeAccount =
    accounts.find((a) => a.id === selectedAccount) || accounts[0];

  return (
    <header className="sticky top-0 z-30 bg-[#07152F] border-b-2 border-[#050505] px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Logo & Account Selector */}
        <div className="flex items-center gap-3">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-xs font-bold text-white">GOLDSHIELD</span>
          </div>

          {/* Account Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0D2247] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md hover:bg-[#132D5E] transition-colors"
            >
              <span className="text-xs font-medium text-gray-400">Akun:</span>
              <span className="text-xs font-mono font-bold text-white">
                #{activeAccount?.accountNumber || "71024589"}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  activeAccount?.type === "real"
                    ? "bg-[#74FF44]/20 text-[#74FF44] border-[#74FF44]/40"
                    : "bg-[#FFE600]/20 text-[#FFE600] border-[#FFE600]/40"
                }`}
              >
                {activeAccount?.broker || "Exness"} {activeAccount?.type?.toUpperCase() || "DEMO"}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {accountDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#0D2247] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md p-2 z-50 space-y-1">
                <p className="text-[10px] font-heading font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                  Akun MT5 Terkoneksi
                </p>

                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccount(acc.id);
                      setAccountDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors ${
                      selectedAccount === acc.id
                        ? "bg-[#07152F] border border-[#00E5FF]/40 text-white"
                        : "hover:bg-[#07152F] text-gray-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-heading font-bold text-white">
                          {acc.broker} #{acc.accountNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1 rounded ${
                            acc.type === "real" ? "bg-[#74FF44] text-[#050505]" : "bg-[#FFE600] text-[#050505]"
                          }`}
                        >
                          {acc.type.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Server: {acc.server}
                      </span>
                    </div>

                    {selectedAccount === acc.id && (
                      <Check className="w-4 h-4 text-[#00E5FF]" />
                    )}
                  </button>
                ))}

                <div className="pt-2 border-t border-[#132D5E]">
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

        {/* Center: Status Indicators */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Broker Connection */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0D2247] border border-[#132D5E] rounded-md">
            {activeAccount?.type === "real" ? (
              <Wifi className="w-3.5 h-3.5 text-[#74FF44]" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-[#FFE600]" />
            )}
            <span className="text-[10px] font-bold text-gray-300">
              {activeAccount?.broker?.toUpperCase()}: {activeAccount?.type?.toUpperCase()}
            </span>
          </div>

          {/* AI Engine */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0D2247] border border-[#132D5E] rounded-md">
            <Brain className="w-3.5 h-3.5 text-[#74FF44]" />
            <span className="text-[10px] font-bold text-gray-400">AI ENGINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#74FF44] animate-pulse-dot" />
          </div>

          {/* EA Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0D2247] border border-[#132D5E] rounded-md">
            <Bot className="w-3.5 h-3.5 text-[#74FF44]" />
            <span className="text-[10px] font-bold text-gray-400">EA ACTIVE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#74FF44] animate-pulse-dot" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Connect Exness Pill */}
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] hover:bg-[#00C8E0] text-[#050505] text-xs font-heading font-bold border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md transition-all active:translate-x-[2px] active:shadow-none"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Konek Exness</span>
          </Link>

          {/* Demo Badge */}
          {activeAccount?.type === "demo" && (
            <span className="demo-badge rounded text-[10px]">DEMO MODE</span>
          )}

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative p-2 text-gray-400 hover:text-white hover:bg-[#0D2247] rounded-md transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4B57] rounded-full border border-[#07152F]" />
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#0D2247] rounded-md transition-colors"
            >
              <div className="w-7 h-7 bg-[#1746FF] border-2 border-[#050505] rounded-md flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-xs font-medium text-white">
                {user?.name || "Trader"}
              </span>
              <ChevronDown className="hidden sm:block w-3 h-3 text-gray-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0D2247] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md p-2 z-50 space-y-2">
                <div className="p-2 border-b border-[#132D5E]">
                  <p className="text-xs font-heading font-bold text-white truncate">
                    {user?.name || "Alex Trader"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">
                    {user?.email || "trader@goldshield.ai"}
                  </p>
                </div>

                <Link
                  href="/login"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 w-full p-2 text-xs text-gray-300 hover:text-white hover:bg-[#07152F] rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Koneksikan Akun Lain</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 w-full p-2 text-xs text-gray-300 hover:text-white hover:bg-[#07152F] rounded transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Pengaturan Risiko</span>
                </Link>

                <div className="pt-1 border-t border-[#132D5E]">
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full p-2 text-xs text-[#FF4B57] hover:bg-[#07152F] rounded transition-colors"
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
