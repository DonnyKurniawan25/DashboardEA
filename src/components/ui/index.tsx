"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "primary" | "success" | "danger" | "warning";
  hover?: boolean;
  onClick?: () => void;
}

export function NeoCard({ children, className, variant = "default", hover = false, onClick }: NeoCardProps) {
  const variants = {
    default: "bg-white dark:bg-[#0D2247] text-[#050505] dark:text-white",
    dark: "bg-white dark:bg-[#0D2247] text-[#050505] dark:text-white",
    primary: "bg-[#1746FF] text-white",
    success: "bg-[#74FF44] text-[#050505]",
    danger: "bg-[#FF4B57] text-white",
    warning: "bg-[#FFE600] text-[#050505]",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "neo-card p-4 transition-colors duration-200",
        variants[variant],
        hover && "cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#050505] transition-all duration-150",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function NeoButton({ variant = "primary", size = "md", className, children, ...props }: NeoButtonProps) {
  const variants = {
    primary: "bg-[#1746FF] text-white hover:bg-[#1239DD]",
    secondary: "bg-[#00E5FF] text-[#050505] hover:bg-[#00C8E0]",
    success: "bg-[#74FF44] text-[#050505] hover:bg-[#60E636]",
    danger: "bg-[#FF4B57] text-white hover:bg-[#E03E49]",
    warning: "bg-[#FFE600] text-[#050505] hover:bg-[#E6CF00]",
    outline: "bg-white dark:bg-transparent text-[#050505] dark:text-white border-[#050505] hover:bg-gray-100 dark:hover:bg-white/10",
    ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:text-[#050505] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#0D2247] border-transparent shadow-none",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "neo-btn font-heading font-bold rounded-md transition-all duration-150",
        variants[variant],
        sizes[size],
        variant === "ghost" && "border-0 shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface NeoBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "warning" | "info" | "neutral";
  className?: string;
}

export function NeoBadge({ children, variant = "info", className }: NeoBadgeProps) {
  const variants = {
    success: "bg-[#74FF44] text-[#050505]",
    danger: "bg-[#FF4B57] text-white",
    warning: "bg-[#FFE600] text-[#050505]",
    info: "bg-[#00E5FF] text-[#050505]",
    neutral: "bg-gray-200 dark:bg-[#0D2247] text-gray-700 dark:text-gray-300",
  };

  return (
    <span
      className={cn(
        "status-badge inline-flex items-center",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function NeoInput({ label, className, ...props }: NeoInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={cn(
          "px-3 py-2 bg-white dark:bg-[#0D2247] text-[#050505] dark:text-white text-sm border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF] dark:focus:border-[#00E5FF] focus:shadow-[3px_3px_0px_#1746FF] transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface NeoSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function NeoSelect({ label, options, className, ...props }: NeoSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-heading font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={cn(
          "px-3 py-2 bg-white dark:bg-[#0D2247] text-[#050505] dark:text-white text-sm border-2 border-[#050505] shadow-[3px_3px_0px_#050505] rounded-md focus:outline-none focus:border-[#1746FF] dark:focus:border-[#00E5FF] appearance-none cursor-pointer",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#050505] dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon: React.ElementType;
  title: string;
  message: string;
}) {
  return (
    <div className="neo-card p-12 flex flex-col items-center justify-center text-center">
      <Icon className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="font-heading text-lg font-bold text-[#050505] dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">{message}</p>
    </div>
  );
}

export function LoadingCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="neo-card p-4">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  variant = "default",
}: {
  label: string;
  value: string;
  change?: string;
  icon?: React.ElementType;
  variant?: "default" | "success" | "danger";
}) {
  return (
    <NeoCard className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-heading font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className={cn(
            "text-xl md:text-2xl font-heading font-bold animate-count",
            variant === "success" && "text-[#00B843] dark:text-[#74FF44]",
            variant === "danger" && "text-[#FF3B30] dark:text-[#FF4B57]",
            variant === "default" && "text-[#050505] dark:text-white"
          )}>
            {value}
          </p>
          {change && (
            <p className={cn(
              "text-xs font-medium mt-1 font-mono",
              change.startsWith("+") ? "text-[#00B843] dark:text-[#74FF44]" : change.startsWith("-") ? "text-[#FF3B30] dark:text-[#FF4B57]" : "text-gray-500 dark:text-gray-400"
            )}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 bg-[#F3F4F6] dark:bg-[#07152F] border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-[#1746FF] dark:text-[#00E5FF]" />
          </div>
        )}
      </div>
    </NeoCard>
  );
}
