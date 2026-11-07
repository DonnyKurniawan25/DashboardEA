"use client";

import React, { useState, useEffect } from "react";
import {
  NeoCard,
  NeoBadge,
  NeoButton,
  PageHeader,
  Skeleton,
} from "@/components/ui";
import {
  formatNumber,
  formatPercent,
  formatDate,
  cn,
} from "@/lib/utils";
import { api } from "@/services/api";
import type { MarketData } from "@/types";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
} from "lucide-react";

export default function MarketMonitorPage() {
  const [market, setMarket] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const fetchMarket = async () => {
    setLoading(true);
    try {
      const data = await api.getMarketData();
      setMarket(data);
    } catch (err) {
      console.error("Failed to load market data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarket();
    // Simulate tick updates every 3s
    const interval = setInterval(() => {
      setMarket((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.5) * 0.05 * (item.symbol === "XAUUSD" ? 5 : 0.01);
          const newBid = Math.round((item.bid + delta) * 1000) / 1000;
          const spreadOffset = item.spread * (item.symbol === "XAUUSD" ? 0.01 : 0.0001);
          return {
            ...item,
            bid: newBid,
            ask: Math.round((newBid + spreadOffset) * 1000) / 1000,
            lastUpdate: new Date().toISOString(),
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredMarket = market.filter((m) => {
    const matchesSearch = m.symbol.toLowerCase().includes(search.toLowerCase());
    if (filter === "METALS") return matchesSearch && m.symbol.includes("XAU");
    if (filter === "MAJORS") return matchesSearch && ["EURUSD", "GBPUSD", "USDJPY"].includes(m.symbol);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Monitor"
        subtitle="Real-Time MT5 Feed, Liquidity Spreads & Ticker Rates"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={fetchMarket}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Sync Quotes
        </NeoButton>
        <NeoBadge variant="info">LIVE FEED (3s TICK)</NeoBadge>
      </PageHeader>

      {/* Filter and Search */}
      <NeoCard className="p-4 bg-[#0D2247]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symbol (e.g. XAUUSD)..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#07152F] text-white text-xs border-2 border-[#050505] shadow-[2px_2px_0px_#050505] rounded-md focus:outline-none focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#07152F] p-1 border-2 border-[#050505] rounded-md">
              {["ALL", "METALS", "MAJORS"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1 text-xs font-heading font-bold rounded transition-colors",
                    filter === f
                      ? "bg-[#00E5FF] text-[#050505]"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#74FF44] animate-pulse" />
            <span>Bridge Latency: 12ms (Direct WebSocket)</span>
          </div>
        </div>
      </NeoCard>

      {/* Quotes Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <NeoCard key={i} className="p-4 bg-[#0D2247]">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-4 w-32" />
            </NeoCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMarket.map((item) => {
            const isPositive = item.change >= 0;
            const highLowSpan = item.high - item.low;
            const currentPosition = highLowSpan > 0 ? ((item.bid - item.low) / highLowSpan) * 100 : 50;

            return (
              <NeoCard key={item.symbol} className="p-4 bg-[#0D2247]" hover>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">
                      {item.symbol}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-mono">
                      Spread: <span className="text-[#00E5FF] font-bold">{item.spread} pts</span>
                    </p>
                  </div>
                  <NeoBadge variant={isPositive ? "success" : "danger"}>
                    {isPositive ? (
                      <span className="flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> +{item.changePercent}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <ArrowDownRight className="w-3 h-3" /> {item.changePercent}%
                      </span>
                    )}
                  </NeoBadge>
                </div>

                {/* Bid / Ask Price Box */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-[#07152F] border-2 border-[#050505] rounded-md mb-3 text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 font-heading uppercase block">
                      Bid
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      {item.bid.toFixed(item.symbol === "XAUUSD" ? 2 : 4)}
                    </span>
                  </div>
                  <div className="border-l border-[#132D5E]">
                    <span className="text-[10px] text-gray-500 font-heading uppercase block">
                      Ask
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      {item.ask.toFixed(item.symbol === "XAUUSD" ? 2 : 4)}
                    </span>
                  </div>
                </div>

                {/* 24h High / Low Range */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-gray-400">
                    <span>L: {item.low}</span>
                    <span>H: {item.high}</span>
                  </div>
                  <div className="w-full bg-[#07152F] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00E5FF] h-full rounded-full"
                      style={{ width: `${Math.min(Math.max(currentPosition, 5), 95)}%` }}
                    />
                  </div>
                </div>

                {/* Footer Volume */}
                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-3 mt-3 border-t border-[#132D5E]">
                  <span>Vol: {item.volume.toLocaleString()}</span>
                  <span className="font-mono">
                    {new Date(item.lastUpdate).toLocaleTimeString()}
                  </span>
                </div>
              </NeoCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

