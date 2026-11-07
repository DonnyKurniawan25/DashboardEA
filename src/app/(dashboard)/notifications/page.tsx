"use client";

import React, { useState, useEffect } from "react";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  PageHeader,
  Skeleton,
} from "@/components/ui";
import { formatDate, cn } from "@/lib/utils";
import { api } from "@/services/api";
import type { Notification } from "@/types";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Brain,
  Bot,
  Send,
  ShieldAlert,
  Clock,
  Trash2,
  Filter,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastMessage("Semua notifikasi ditandai telah dibaca.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const clearAll = () => {
    setNotifications([]);
    setToastMessage("Pusat notifikasi dikosongkan.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sendTestTelegram = () => {
    setToastMessage("Simulasi pengiriman pesan Telegram berhasil dikirim ke bot!");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "ALERTS") return n.severity === "warning" || n.severity === "error";
    if (filter === "TRADES")
      return (
        n.type === "TRADE_OPENED" ||
        n.type === "TRADE_CLOSED" ||
        n.type === "TAKE_PROFIT" ||
        n.type === "STOP_LOSS"
      );
    return true;
  });

  const getIcon = (type: string, severity: string) => {
    switch (type) {
      case "TRADE_OPENED":
      case "TRADE_CLOSED":
      case "TAKE_PROFIT":
        return <TrendingUp className="w-5 h-5 text-[#00B843] dark:text-[#74FF44]" />;
      case "STOP_LOSS":
        return <XCircle className="w-5 h-5 text-[#FF3B30] dark:text-[#FF4B57]" />;
      case "AI_SIGNAL":
        return <Brain className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />;
      case "HIGH_DRAWDOWN":
      case "MARGIN_ALERT":
        return <ShieldAlert className="w-5 h-5 text-[#FF3B30] dark:text-[#FF4B57]" />;
      case "EA_DISCONNECTED":
      case "API_TIMEOUT":
        return <AlertTriangle className="w-5 h-5 text-[#FFE600]" />;
      default:
        return <Bell className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Pusat Peringatan Real-Time, Warning Risiko & Notifikasi Telegram EA-Nevan"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={sendTestTelegram}
          className="flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
          Test Telegram
        </NeoButton>
        <NeoButton
          variant="primary"
          size="sm"
          onClick={markAllRead}
          className="flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Tandai Dibaca
        </NeoButton>
      </PageHeader>

      {/* Toast popup */}
      {toastMessage && (
        <div className="p-3 bg-[#1746FF] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md text-white text-xs font-heading font-bold animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Telegram Bridge Integration Card */}
      <NeoCard className="p-4 border-l-4 border-l-[#1746FF] dark:border-l-[#00E5FF]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F4F5F7] dark:bg-[#07152F] border-2 border-[#050505] rounded-md flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#050505]">
              <Send className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-[#050505] dark:text-white text-sm">
                Kanal Notifikasi Telegram: EA-Nevan Live Dispatcher
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Forwarder otomatis untuk eksekusi trade MT5, alarm drawdown modal, dan konfirmasi sinyal AI
              </p>
            </div>
          </div>
          <NeoBadge variant="info">INTEGRASI TELEGRAM READY</NeoBadge>
        </div>
      </NeoCard>

      {/* Filter Tabs */}
      <NeoCard className="p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-[#F9FAFB] dark:bg-[#07152F] p-1 border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505]">
            {[
              { id: "ALL", label: "Semua Alert" },
              { id: "UNREAD", label: "Belum Dibaca" },
              { id: "ALERTS", label: "Peringatan Risiko" },
              { id: "TRADES", label: "Aktivitas Trade" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-heading font-bold rounded transition-colors",
                  filter === t.id
                    ? "bg-[#00E5FF] text-[#050505]"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={clearAll}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-[#FF3B30] dark:hover:text-[#FF4B57] flex items-center gap-1 font-heading font-bold self-end sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
          </button>
        </div>
      </NeoCard>

      {/* Notification Stream */}
      <NeoCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="font-heading font-bold text-[#050505] dark:text-white">Tidak ada notifikasi dalam filter ini</p>
            <p className="text-xs text-gray-500 mt-1">Semua status sistem dan transaksi normal</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-[#050505]">
            {filteredNotifs.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 flex items-start gap-4 transition-colors",
                  !item.read ? "bg-blue-50/50 dark:bg-[#07152F]/70" : "hover:bg-gray-50 dark:hover:bg-[#07152F]/30"
                )}
              >
                <div className="w-10 h-10 bg-white dark:bg-[#07152F] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.type, item.severity)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-[#050505] dark:text-white text-sm">
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1746FF] dark:bg-[#00E5FF]" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono font-bold">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <NeoBadge
                      variant={
                        item.severity === "error"
                          ? "danger"
                          : item.severity === "warning"
                          ? "warning"
                          : item.severity === "success"
                          ? "success"
                          : "info"
                      }
                    >
                      {item.type.replace("_", " ")}
                    </NeoBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </NeoCard>
    </div>
  );
}
