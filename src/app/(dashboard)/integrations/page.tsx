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
import type { Integration } from "@/types";
import {
  Plug,
  Server,
  Send,
  Globe,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lock,
  ArrowRight,
  Shield,
  Code2,
  Terminal,
  Activity,
  Zap,
} from "lucide-react";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const data = await api.getIntegrations();
      setIntegrations(data);
    } catch (err) {
      console.error("Failed to load integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestBridge = (id: string, name: string) => {
    setTestingId(id);
    setTestResult(null);
    setTimeout(() => {
      setTestingId(null);
      setTestResult(`[HANDSHAKE SIMULATED] Ping to ${name} returned 200 OK (Latency: 14ms). Mock bridge ready.`);
      setTimeout(() => setTestResult(null), 5000);
    }, 1200);
  };

  const contracts = [
    { endpoint: "/api/accounts", method: "GET", description: "Fetch connected MT5 accounts, balances & margins" },
    { endpoint: "/api/positions", method: "GET", description: "Real-time floating positions & active ticket lots" },
    { endpoint: "/api/orders", method: "GET", description: "Order queue, pending stops and limits" },
    { endpoint: "/api/trades/history", method: "GET", description: "Historical closed trade log with P/L & swap" },
    { endpoint: "/api/analytics", method: "GET", description: "Quantitative performance metrics, sessions & drawdowns" },
    { endpoint: "/api/ai/signals", method: "GET", description: "AI neural market recommendations & confidence" },
    { endpoint: "/api/bots/status", method: "GET", description: "EA heartbeat, grid level and runtime diagnostics" },
    { endpoint: "/api/risk", method: "GET", description: "Real-time risk guardrail parameters & circuit breakers" },
    { endpoint: "/api/notifications", method: "GET", description: "Centralized event notifications & alerts" },
    { endpoint: "/ws/market", method: "WS", description: "Real-time sub-second tick stream from MT5 bridge" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations & MT5 Bridge"
        subtitle="Gateway Architecture, Python FastAPI Service Layer & WebSocket Dispatch"
      >
        <NeoButton
          variant="outline"
          size="sm"
          onClick={fetchIntegrations}
          className="flex items-center gap-1.5"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          Check Gateways
        </NeoButton>
        <NeoBadge variant="warning">SANDBOX / DEMO</NeoBadge>
      </PageHeader>

      {/* Security Guarantee Banner (Mandatory Prompt Requirement) */}
      <div className="p-4 bg-[#07152F] border-2 border-[#1746FF] shadow-[4px_4px_0px_#050505] rounded-md">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-heading font-bold text-white text-sm">
              ZERO-KNOWLEDGE BROWSER CREDENTIAL POLICY
            </h4>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Kredensial broker, password investor MT5, master trade key, dan token otentikasi disimpan secara eksklusif pada Python MT5 Bridge Backend terenkripsi vault. Frontend Next.js hanya menerima agregasi metrik tanpa pernah mengakses kunci sensitif akun.
            </p>
          </div>
        </div>
      </div>

      {/* Handshake Result */}
      {testResult && (
        <div className="p-3 bg-[#74FF44]/20 border-2 border-[#74FF44] shadow-[3px_3px_0px_#050505] rounded-md text-white text-xs font-heading font-bold">
          {testResult}
        </div>
      )}

      {/* Architecture Pipeline Flow Diagram (Neo Brutalist Flow) */}
      <NeoCard className="p-5 bg-[#0D2247]">
        <h3 className="font-heading font-bold text-white text-base mb-1">
          High-Frequency Bridge Architecture Pipeline
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          End-to-end data pipeline from MetaTrader 5 terminal to Next.js Neo-Brutalist Dashboard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
          <div className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md">
            <span className="text-[10px] font-heading font-bold text-[#FFE600] uppercase block">
              Level 1
            </span>
            <span className="font-heading font-bold text-white text-sm block mt-0.5">
              MetaTrader 5
            </span>
            <p className="text-[10px] text-gray-400 mt-1">Terminal Execution</p>
          </div>

          <div className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md">
            <span className="text-[10px] font-heading font-bold text-[#00E5FF] uppercase block">
              Level 2
            </span>
            <span className="font-heading font-bold text-white text-sm block mt-0.5">
              Python Bridge
            </span>
            <p className="text-[10px] text-gray-400 mt-1">MetaTrader5 PyPI</p>
          </div>

          <div className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md">
            <span className="text-[10px] font-heading font-bold text-[#74FF44] uppercase block">
              Level 3
            </span>
            <span className="font-heading font-bold text-white text-sm block mt-0.5">
              FastAPI Server
            </span>
            <p className="text-[10px] text-gray-400 mt-1">Async Core & Uvicorn</p>
          </div>

          <div className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md">
            <span className="text-[10px] font-heading font-bold text-[#1746FF] uppercase block">
              Level 4
            </span>
            <span className="font-heading font-bold text-white text-sm block mt-0.5">
              WebSocket Layer
            </span>
            <p className="text-[10px] text-gray-400 mt-1">Sub-second Stream</p>
          </div>

          <div className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md">
            <span className="text-[10px] font-heading font-bold text-[#00E5FF] uppercase block">
              Level 5
            </span>
            <span className="font-heading font-bold text-white text-sm block mt-0.5">
              Next.js UI
            </span>
            <p className="text-[10px] text-gray-400 mt-1">Zustand State</p>
          </div>
        </div>
      </NeoCard>

      {/* Connected Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((item) => (
          <NeoCard key={item.id} className="p-5 bg-[#0D2247]">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#07152F] border-2 border-[#050505] rounded-md flex items-center justify-center">
                  {item.type === "MT5_BRIDGE" ? (
                    <Server className="w-5 h-5 text-[#00E5FF]" />
                  ) : item.type === "TELEGRAM" ? (
                    <Send className="w-5 h-5 text-[#74FF44]" />
                  ) : item.type === "API" ? (
                    <Code2 className="w-5 h-5 text-[#FFE600]" />
                  ) : (
                    <Globe className="w-5 h-5 text-[#1746FF]" />
                  )}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">
                    {item.name}
                  </h4>
                  <span className="text-xs text-gray-400 font-mono">
                    Type: {item.type}
                  </span>
                </div>
              </div>

              <NeoBadge variant={item.status === "connected" ? "success" : "neutral"}>
                {item.status.toUpperCase()}
              </NeoBadge>
            </div>

            <div className="p-3 bg-[#07152F] border-2 border-[#050505] rounded-md text-xs font-mono text-gray-300 space-y-1 my-3">
              {Object.entries(item.config).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}:</span>
                  <span className="text-white">{String(v)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#132D5E]">
              <span className="text-[11px] text-gray-500">
                Last Heartbeat: {formatDate(item.lastSync)}
              </span>

              <NeoButton
                variant="outline"
                size="sm"
                onClick={() => handleTestBridge(item.id, item.name)}
                disabled={testingId === item.id}
                className="text-xs"
              >
                {testingId === item.id ? "Pinging..." : "Test Ping"}
              </NeoButton>
            </div>
          </NeoCard>
        ))}
      </div>

      {/* OpenAPI Endpoint Contract Specification */}
      <NeoCard className="p-0 overflow-hidden bg-[#0D2247]">
        <div className="p-4 border-b-2 border-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="font-heading font-bold text-white text-base">
              Standardized FastAPI Backend Contract
            </h3>
          </div>
          <NeoBadge variant="info">OAS 3.1 COMPATIBLE</NeoBadge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full neo-table">
            <thead>
              <tr>
                <th className="text-left">Method</th>
                <th className="text-left">Endpoint Path</th>
                <th className="text-left">Payload & Purpose</th>
                <th className="text-center">Auth Required</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.endpoint}>
                  <td>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded font-mono font-bold text-xs border border-[#050505]",
                        c.method === "GET"
                          ? "bg-[#1746FF] text-white"
                          : c.method === "POST"
                          ? "bg-[#74FF44] text-[#050505]"
                          : "bg-[#00E5FF] text-[#050505]"
                      )}
                    >
                      {c.method}
                    </span>
                  </td>
                  <td className="font-mono font-bold text-white text-xs">{c.endpoint}</td>
                  <td className="text-xs text-gray-300">{c.description}</td>
                  <td className="text-center">
                    <span className="text-[10px] text-[#74FF44] font-bold">Bearer JWT</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NeoCard>
    </div>
  );
}

