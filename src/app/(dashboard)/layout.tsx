"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout";
import { Navbar } from "@/components/layout";
import { useAppStore } from "@/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, theme, setTheme } = useAppStore();

  useEffect(() => {
    // Sync theme with document class on mount & changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#07152F] text-[#050505] dark:text-white transition-colors duration-200">
        <Sidebar />
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
          }`}
        >
          <Navbar />
          <main className="p-4 md:p-6 pb-24 md:pb-6">
            {children}
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
