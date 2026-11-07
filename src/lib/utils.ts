import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatPnL(value: number, currency: string = "USD"): string {
  const formatted = formatCurrency(Math.abs(value), currency);
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "running":
    case "connected":
    case "active":
    case "buy":
      return "text-[#74FF44]";
    case "error":
    case "disconnected":
    case "sell":
      return "text-[#FF4B57]";
    case "paused":
    case "warning":
      return "text-[#FFE600]";
    default:
      return "text-white";
  }
}

export function getStatusBgColor(status: string): string {
  switch (status.toLowerCase()) {
    case "running":
    case "connected":
    case "active":
      return "bg-[#74FF44]";
    case "error":
    case "disconnected":
      return "bg-[#FF4B57]";
    case "paused":
    case "warning":
      return "bg-[#FFE600]";
    case "safe mode":
      return "bg-[#00E5FF]";
    default:
      return "bg-gray-500";
  }
}

export function getPnLColor(value: number): string {
  if (value > 0) return "text-[#74FF44]";
  if (value < 0) return "text-[#FF4B57]";
  return "text-white";
}

export function getPnLBgColor(value: number): string {
  if (value > 0) return "bg-[#74FF44]/10 border-[#74FF44]/30";
  if (value < 0) return "bg-[#FF4B57]/10 border-[#FF4B57]/30";
  return "bg-white/10 border-white/30";
}

