"use client";

import React from "react";
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
} from "lucide-react";

export default function Navbar() {
  const { demoMode } = useAppStore();

  return (
    <header className="sticky top-0 z-30 bg-[#07152F] border-b-2 border-[#050505] px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Logo (mobile) + Account Selector */}
        <div className="flex items-center gap-3">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1746FF] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading text-xs font-bold text-white">GOLDSHIELD</span>
          </div>

          {/* Account Selector */}
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#0D2247] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md hover:bg-[#132D5E] transition-colors">
            <span className="text-xs font-medium text-gray-400">Account:</span>
            <span className="text-xs font-bold text-white">71024589</span>
            <span className="text-[10px] font-bold text-[#00E5FF] bg-[#07152F] px-1.5 py-0.5 rounded border border-[#00E5FF]/30">
              Exness
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>

        {/* Center: Status Indicators */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Broker Connection */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0D2247] border border-[#132D5E] rounded-md">
            {demoMode ? (
              <WifiOff className="w-3.5 h-3.5 text-[#FFE600]" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-[#74FF44]" />
            )}
            <span className="text-[10px] font-bold text-gray-400">
              {demoMode ? "DEMO" : "LIVE"}
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
          {/* Demo Badge */}
          {demoMode && (
            <span className="demo-badge rounded text-[10px]">DEMO DATA</span>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-[#0D2247] rounded-md transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4B57] rounded-full border border-[#07152F]" />
          </button>

          {/* User */}
          <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#0D2247] rounded-md transition-colors">
            <div className="w-7 h-7 bg-[#1746FF] border-2 border-[#050505] rounded-md flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-xs font-medium text-white">Admin</span>
            <ChevronDown className="hidden sm:block w-3 h-3 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}

