"use client";

import React from "react";
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
  const { sidebarCollapsed } = useAppStore();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#07152F]">
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

