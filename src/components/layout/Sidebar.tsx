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
  { label: "EA-Nevan Monitor", href: "/ea-bot-monitor", icon: Bot },
  { label: "AI Intelligence", href: "/ai-intelligence", icon: Brain },
  { label: "Risk Center", href: "/risk-center", icon: ShieldAlert },
  { label: "Trading Analytics", href: "/trading-analytics", icon: TrendingUp },
  { label: "Market Monitor", href: "/market-monitor", icon: Globe },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Integrations & MT5", href: "/integrations", icon: Plug },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-[#FFFFFF] dark:bg-[#07152F] border-r-2 border-[#050505] z-40 transition-all duration-300 ${
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
              <h1 className="font-heading text-sm font-bold text-[#050505] dark:text-white tracking-wider leading-tight">
                GOLDSHIELD AI
              </h1>
              <p className="text-[10px] font-bold text-[#1746FF] dark:text-[#00E5FF] tracking-[0.15em] leading-tight">
                EA-NEVAN TRADING
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
                    : "text-gray-700 dark:text-gray-400 hover:text-[#050505] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#0D2247]"
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive
                      ? "text-[#050505]"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-[#1746FF] dark:group-hover:text-[#00E5FF]"
                  }`}
                />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* EA Badge & Collapse Toggle */}
        <div className="border-t-2 border-[#050505] p-2 bg-[#F9FAFB] dark:bg-[#07152F]">
          {!sidebarCollapsed && (
            <div className="px-2 py-1.5 mb-2 bg-[#FFFFFF] dark:bg-[#0D2247] border border-[#050505] rounded text-[11px] font-mono">
              <span className="text-[#1746FF] dark:text-[#00E5FF] font-bold block">EA-Nevan v1.220</span>
              <span className="text-gray-500 text-[10px]">Core: GoldShield AI V2</span>
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-[#050505] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#0D2247] rounded transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav md:hidden flex items-center justify-around py-2 px-1 bg-[#FFFFFF] dark:bg-[#07152F] border-t-2 border-[#050505]">
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
                isActive ? "text-[#1746FF] dark:text-[#00E5FF] font-bold" : "text-gray-500"
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
            pathname === "/notifications" ? "text-[#1746FF] dark:text-[#00E5FF]" : "text-gray-500"
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[9px] font-medium">Alerts</span>
        </Link>
      </nav>
    </>
  );
}
