"use client";

import React, { useState } from "react";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  NeoModal,
  PageHeader,
} from "@/components/ui";
import { formatDate, cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Notification } from "@/types";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Brain,
  Send,
  ShieldAlert,
  Trash2,
  Plus,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearNotifications,
  } = useAppStore();

  const [filter, setFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CRUD Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Form State for Add Notification
  const [formType, setFormType] = useState<Notification["type"]>("TRADE_OPENED");
  const [formTitle, setFormTitle] = useState("Order Baru Terbuka");
  const [formMessage, setFormMessage] = useState("BUY 0.05 Lot XAUUSDm telah dieksekusi oleh EA-Nevan.");
  const [formSeverity, setFormSeverity] = useState<Notification["severity"]>("info");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) return;

    addNotification({
      type: formType,
      title: formTitle.trim(),
      message: formMessage.trim(),
      severity: formSeverity,
      read: false,
    });

    setIsAddModalOpen(false);
    showToast("Notifikasi broadcast berhasil dibuat!");
  };

  const sendTestTelegram = () => {
    addNotification({
      type: "AI_SIGNAL",
      title: "Telegram Live Alert Dispatched",
      message: "Pesan tes bot telegram berhasil disimulasikan: Sinyal AI BUY XAUUSDm pada M15.",
      severity: "success",
      read: false,
    });
    showToast("Pesan tes Telegram berhasil dikirim ke saluran bot!");
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
        return <AlertTriangle className="w-5 h-5 text-[#D97706] dark:text-[#FFE600]" />;
      default:
        return <Bell className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Notifications"
        subtitle="Pusat Peringatan Real-Time, Warning Risiko & Notifikasi Telegram EA-Nevan"
      >
        <NeoButton
          variant="secondary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Notifikasi</span>
        </NeoButton>
        <NeoButton
          variant="outline"
          size="sm"
          onClick={sendTestTelegram}
          className="flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-[#1746FF] dark:text-[#00E5FF]" />
          <span>Test Telegram</span>
        </NeoButton>
        {unreadCount > 0 && (
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => {
              markAllNotificationsAsRead();
              showToast("Semua notifikasi ditandai telah dibaca.");
            }}
            className="flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tandai Semua Dibaca ({unreadCount})</span>
          </NeoButton>
        )}
      </PageHeader>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#1746FF] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md text-white text-xs font-heading font-bold animate-in fade-in duration-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="hover:opacity-75">
            <XCircle className="w-4 h-4" />
          </button>
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
          <div className="flex items-center gap-1 bg-[#F9FAFB] dark:bg-[#07152F] p-1 border-2 border-[#050505] rounded-md shadow-[2px_2px_0px_#050505] flex-wrap">
            {[
              { id: "ALL", label: `Semua (${notifications.length})` },
              { id: "UNREAD", label: `Belum Dibaca (${unreadCount})` },
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

          {notifications.length > 0 && (
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-[#FF3B30] dark:hover:text-[#FF4B57] flex items-center gap-1 font-heading font-bold self-end sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
            </button>
          )}
        </div>
      </NeoCard>

      {/* Notification Stream (CRUD) */}
      <NeoCard className="p-0 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="font-heading font-bold text-[#050505] dark:text-white">Tidak ada notifikasi dalam filter ini</p>
            <p className="text-xs text-gray-500 mt-1 mb-4">Semua status sistem dan transaksi normal.</p>
            <NeoButton size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1 inline" /> Buat Notifikasi Baru
            </NeoButton>
          </div>
        ) : (
          <div className="divide-y-2 divide-[#050505]">
            {filteredNotifs.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 flex items-start gap-4 transition-colors",
                  !item.read ? "bg-blue-50/60 dark:bg-[#07152F]/80" : "hover:bg-gray-50 dark:hover:bg-[#07152F]/30"
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

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
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

                    <div className="flex items-center gap-1.5">
                      {!item.read ? (
                        <button
                          onClick={() => {
                            markNotificationAsRead(item.id);
                            showToast("Ditandai sudah dibaca.");
                          }}
                          title="Tandai Sudah Dibaca"
                          className="px-2 py-0.5 text-[10px] font-heading font-bold bg-white dark:bg-[#07152F] text-gray-700 dark:text-gray-300 hover:text-black border border-[#050505] rounded shadow-[1px_1px_0px_#050505] flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Baca
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">Dibaca</span>
                      )}

                      <button
                        onClick={() => {
                          deleteNotification(item.id);
                          showToast("Notifikasi dihapus.");
                        }}
                        title="Hapus Notifikasi"
                        className="p-1 text-gray-400 hover:text-[#FF4B57] border border-transparent hover:border-[#050505] rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </NeoCard>

      {/* ─── MODAL 1: BUAT NOTIFIKASI BARU (CREATE) ────────── */}
      <NeoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Buat Notifikasi / Broadcast Baru"
        subtitle="Kirimkan notifikasi manual ke log aktivitas dashboard"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Kategori Notifikasi
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as Notification["type"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="TRADE_OPENED">TRADE_OPENED</option>
                <option value="TRADE_CLOSED">TRADE_CLOSED</option>
                <option value="TAKE_PROFIT">TAKE_PROFIT</option>
                <option value="STOP_LOSS">STOP_LOSS</option>
                <option value="AI_SIGNAL">AI_SIGNAL</option>
                <option value="HIGH_DRAWDOWN">HIGH_DRAWDOWN</option>
                <option value="MARGIN_ALERT">MARGIN_ALERT</option>
                <option value="EA_DISCONNECTED">EA_DISCONNECTED</option>
                <option value="DAILY_RECAP">DAILY_RECAP</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
                Tingkat Severity
              </label>
              <select
                value={formSeverity}
                onChange={(e) => setFormSeverity(e.target.value as Notification["severity"])}
                className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              >
                <option value="info">INFO (Biru)</option>
                <option value="success">SUCCESS (Hijau)</option>
                <option value="warning">WARNING (Kuning)</option>
                <option value="error">ERROR (Merah)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Judul Notifikasi
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505] font-bold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-gray-700 dark:text-gray-300 uppercase block mb-1">
              Pesan Notifikasi
            </label>
            <textarea
              rows={3}
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              className="w-full text-xs p-2 bg-white dark:bg-[#07152F] border-2 border-[#050505] rounded shadow-[2px_2px_0px_#050505]"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Batal
            </NeoButton>
            <NeoButton type="submit" variant="primary" size="sm">
              Kirim Notifikasi
            </NeoButton>
          </div>
        </form>
      </NeoModal>

      {/* ─── MODAL 2: CLEAR ALL NOTIFICATIONS ─────────────── */}
      <NeoModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Bersihkan Semua Notifikasi"
        subtitle="Hapus seluruh notifikasi dari daftar"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus seluruh ({notifications.length}) notifikasi? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-[#132D5E]">
            <NeoButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsClearModalOpen(false)}
            >
              Batal
            </NeoButton>
            <NeoButton
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                clearNotifications();
                setIsClearModalOpen(false);
                showToast("Semua notifikasi telah dibersihkan.");
              }}
            >
              Bersihkan Semua
            </NeoButton>
          </div>
        </div>
      </NeoModal>
    </div>
  );
}
