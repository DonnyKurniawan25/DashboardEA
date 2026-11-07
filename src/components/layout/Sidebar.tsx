"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  ClipboardList,
  Bot,
  Brain,
  ShieldAlert,
  TrendingUp,
  Globe,
  Bell,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Trading Accounts", href: "/trading-accounts", icon: Wallet },
  { label: "Open Positions", href: "/open-positions", icon: BarChart3 },
  { label: "Orders & History", href: "/orders-history", icon: ClipboardList },
  { label: "EA / Bot Monitor", href: "/ea-bot-monitor", icon: Bot },
  { label: "AI Intelligence", href: "/ai-intelligence", icon: Brain },
  { label: "Risk Center", href: "/risk-center", icon: ShieldAlert },
  { label: "Trading Analytics", href: "/trading-analytics", icon: TrendingUp },
  { label: "Market Monitor", href: "/market-monitor", icon: Globe },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-[#07152F] border-r-2 border-[#050505] z-40 transition-all duration-300 ${
          sidebarCollapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b-2 border-[#050505]">
          <div className="flex-shrink-0 w-10 h-10 bg-[#1746FF] border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-heading text-sm font-bold text-white tracking-wider leading-tight">
                GOLDSHIELD AI
              </h1>
              <p className="text-[10px] font-bold text-[#00E5FF] tracking-[0.15em] leading-tight">
                TRADING INTELLIGENCE
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-150 group ${
                  isActive
                    ? "neo-nav-active"
                    : "text-gray-400 hover:text-white hover:bg-[#0D2247]"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? "text-[#050505]" : "text-gray-400 group-hover:text-[#00E5FF]"
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center py-3 border-t-2 border-[#050505] text-gray-400 hover:text-white hover:bg-[#0D2247] transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav md:hidden flex items-center justify-around py-2 px-1">
        {menuItems.slice(0, 5).map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
                isActive ? "text-[#00E5FF]" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
        <Link
          href="/notifications"
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md ${
            pathname === "/notifications" ? "text-[#00E5FF]" : "text-gray-500"
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[9px] font-medium">More</span>
        </Link>
      </nav>
    </>
  );
}

