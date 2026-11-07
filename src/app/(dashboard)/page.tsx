'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Unlock,
  Gauge,
  Activity,
  Target,
  Bot,
  Brain,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Zap,
  RefreshCw,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  CircleDot,
  Wifi,
  WifiOff,
  Heart,
  Timer,
} from 'lucide-react';
import {
  AreaChart,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  Bar,
  Legend,
} from 'recharts';

import {
  NeoCard,
  NeoButton,
  NeoBadge,
  StatCard,
  PageHeader,
  Skeleton,
  LoadingCards,
} from '@/components/ui';
import { api } from '@/services/api';
import {
  formatCurrency,
  formatNumber,
  formatPnL,
  formatDate,
  formatDuration,
  formatPercent,
  getPnLColor,
  cn,
} from '@/lib/utils';
import type {
  TradingAccount,
  OpenPosition,
  AISignal,
  RiskMetrics,
  BotStatus,
  EquityChartData,
  AnalyticsData,
} from '@/types';
import type { Activity as ActivityType } from '@/services/demo-data';

// ============================================================
// Custom Tooltip Components
// ============================================================
function EquityTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0D2247] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md p-3 text-xs">
      <p className="font-heading font-bold text-white mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="font-medium">
          {entry.dataKey === 'drawdown'
            ? `Drawdown: ${entry.value.toFixed(2)}%`
            : `${entry.dataKey}: ${formatCurrency(entry.value)}`}
        </p>
      ))}
    </div>
  );
}

function DailyPnLTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-[#0D2247] border-2 border-[#050505] shadow-[4px_4px_0px_#050505] rounded-md p-3 text-xs">
      <p className="font-heading font-bold text-white mb-1">{label}</p>
      <p className={cn('font-bold', value >= 0 ? 'text-[#74FF44]' : 'text-[#FF4B57]')}>
        {formatPnL(value)}
      </p>
    </div>
  );
}

// ============================================================
// Main Dashboard Page
// ============================================================
export default function DashboardPage() {
  // ----- State -----
  const [accounts, setAccounts] = useState<TradingAccount[] | null>(null);
  const [positions, setPositions] = useState<OpenPosition[] | null>(null);
  const [signals, setSignals] = useState<AISignal[] | null>(null);
  const [risk, setRisk] = useState<RiskMetrics | null>(null);
  const [bots, setBots] = useState<BotStatus[] | null>(null);
  const [equityData, setEquityData] = useState<EquityChartData[] | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activities, setActivities] = useState<ActivityType[] | null>(null);
  const [chartPeriod, setChartPeriod] = useState('3M');
  const [loading, setLoading] = useState(true);

  // ----- Data Fetching -----
  const fetchData = useCallback(async () => {
    try {
      const [acc, pos, sig, rsk, bot, ana, act] = await Promise.all([
        api.getAccounts(),
        api.getPositions(),
        api.getAISignals(),
        api.getRiskMetrics(),
        api.getBotStatus(),
        api.getAnalytics(),
        api.getActivities(),
      ]);
      setAccounts(acc);
      setPositions(pos);
      setSignals(sig);
      setRisk(rsk);
      setBots(bot);
      setAnalytics(ana);
      setActivities(act);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChart = useCallback(async (period: string) => {
    try {
      const data = await api.getEquityChart(period);
      setEquityData(data);
    } catch (e) {
      console.error('Failed to load equity chart:', e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchChart(chartPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchChart(chartPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartPeriod]);

  // ----- Derived Values -----
  const account = accounts?.[0];
  const runningBots = bots?.filter((b) => b.status === 'RUNNING').length ?? 0;
  const todayPnL = analytics?.dailyPnL?.[analytics.dailyPnL.length - 1]?.pnl ?? 0;
  const last7DailyPnL = analytics?.dailyPnL?.slice(-14) ?? [];

  // ----- Period Selector -----
  const periods = ['1D', '7D', '1M', '3M', '6M', 'YTD', 'ALL'];

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="GoldShield AI Trading Intelligence"
        />
        <LoadingCards count={10} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <NeoCard className="p-6 h-[380px]">
              <Skeleton className="h-full w-full" />
            </NeoCard>
          </div>
          <div>
            <NeoCard className="p-6 h-[380px]">
              <Skeleton className="h-full w-full" />
            </NeoCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ==================== PAGE HEADER ==================== */}
      <PageHeader
        title="Dashboard"
        subtitle="GoldShield AI Trading Intelligence — DEMO DATA"
      >
        <NeoButton
          variant="ghost"
          size="sm"
          onClick={() => {
            setLoading(true);
            fetchData();
            fetchChart(chartPeriod);
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </NeoButton>
        <NeoBadge variant="warning">DEMO MODE</NeoBadge>
      </PageHeader>

      {/* ==================== KPI CARDS ==================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        <StatCard
          label="Account Balance"
          value={formatCurrency(account?.balance ?? 52481.37)}
          icon={Wallet}
        />
        <StatCard
          label="Account Equity"
          value={formatCurrency(account?.equity ?? 53126.84)}
          icon={TrendingUp}
        />
        <StatCard
          label="Floating P/L"
          value={formatPnL(account?.floatingPnL ?? 645.47)}
          icon={DollarSign}
          variant={(account?.floatingPnL ?? 645.47) >= 0 ? 'success' : 'danger'}
        />
        <StatCard
          label="Today's P/L"
          value={formatPnL(todayPnL || 1285.3)}
          icon={BarChart3}
          variant={(todayPnL || 1285.3) >= 0 ? 'success' : 'danger'}
          change={`${((todayPnL || 1285.3) / (account?.balance ?? 52481.37) * 100).toFixed(2)}% today`}
        />
        <StatCard
          label="Free Margin"
          value={formatCurrency(account?.freeMargin ?? 48923.17)}
          icon={Unlock}
        />
        <StatCard
          label="Margin Level"
          value={`${formatNumber(account?.marginLevel ?? 1285.42)}%`}
          icon={Gauge}
          change="Healthy"
        />
        <StatCard
          label="Open Positions"
          value={String(positions?.length ?? 6)}
          icon={BarChart3}
        />
        <StatCard
          label="Total Trades"
          value={String(analytics?.totalTrades ?? 342)}
          icon={Activity}
        />
        <StatCard
          label="Win Rate"
          value={`${analytics?.winRate ?? 62.4}%`}
          icon={Target}
          variant="success"
          change={`${analytics?.winCount ?? 213}W / ${analytics?.lossCount ?? 129}L`}
        />
        <StatCard
          label="Bot Status"
          value={`${runningBots} RUNNING`}
          icon={Bot}
          variant="success"
          change={`${bots?.length ?? 0} total bots`}
        />
      </div>

      {/* ==================== ROW 2: EQUITY + DAILY P/L ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Equity Growth Chart */}
        <NeoCard className="lg:col-span-2 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-white">Equity Growth</h2>
              <p className="text-xs text-gray-400 mt-0.5">Balance, Equity & Drawdown over time</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {periods.map((p) => (
                <NeoButton
                  key={p}
                  size="sm"
                  variant={chartPeriod === p ? 'primary' : 'ghost'}
                  onClick={() => setChartPeriod(p)}
                  className="!px-2.5 !py-1 text-[11px]"
                >
                  {p}
                </NeoButton>
              ))}
            </div>
          </div>
          <div className="h-[300px] md:h-[340px]">
            {equityData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1746FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1746FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#1a3a5c' }}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    interval="preserveStartEnd"
                    minTickGap={40}
                  />
                  <YAxis
                    yAxisId="equity"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    yAxisId="dd"
                    orientation="right"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}%`}
                    domain={[0, 'auto']}
                  />
                  <Tooltip content={<EquityTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={30}
                    iconType="square"
                    wrapperStyle={{ fontSize: 11, color: '#9ca3af' }}
                  />
                  <Area
                    yAxisId="equity"
                    type="monotone"
                    dataKey="balance"
                    stroke="#1746FF"
                    strokeWidth={2}
                    fill="url(#gradBalance)"
                    dot={false}
                    name="Balance"
                  />
                  <Area
                    yAxisId="equity"
                    type="monotone"
                    dataKey="equity"
                    stroke="#00E5FF"
                    strokeWidth={2}
                    fill="url(#gradEquity)"
                    dot={false}
                    name="Equity"
                  />
                  <Area
                    yAxisId="dd"
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#FF4B57"
                    strokeWidth={1.5}
                    fill="none"
                    dot={false}
                    strokeDasharray="4 3"
                    name="Drawdown %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
        </NeoCard>

        {/* Daily P/L Chart */}
        <NeoCard className="p-4 md:p-6">
          <div className="mb-4">
            <h2 className="font-heading text-lg font-bold text-white">Daily P/L</h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 14 days performance</p>
          </div>
          <div className="h-[300px] md:h-[340px]">
            {last7DailyPnL.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7DailyPnL} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#1a3a5c' }}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    interval={1}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<DailyPnLTooltip />} />
                  <Bar
                    dataKey="pnl"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                    name="P/L"
                  >
                    {last7DailyPnL.map((entry, index) => (
                      <rect
                        key={`bar-${index}`}
                        fill={entry.pnl >= 0 ? '#74FF44' : '#FF4B57'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
        </NeoCard>
      </div>

      {/* ==================== ROW 3: OPEN POSITIONS ==================== */}
      <NeoCard className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">Open Positions</h2>
            <p className="text-xs text-gray-400 mt-0.5">{positions?.length ?? 0} active positions</p>
          </div>
          <NeoBadge variant="info">{positions?.length ?? 0} Open</NeoBadge>
        </div>
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b-2 border-[#1a3a5c]">
                {['Ticket', 'Symbol', 'Type', 'Lots', 'Entry', 'Current', 'SL', 'TP', 'P/L', 'Duration', 'Strategy'].map((h) => (
                  <th
                    key={h}
                    className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider py-3 px-2 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions?.map((pos) => (
                <tr
                  key={pos.ticket}
                  className="border-b border-[#1a3a5c]/50 hover:bg-[#0a1e3d] transition-colors"
                >
                  <td className="py-3 px-2 font-mono text-xs text-gray-400">#{pos.ticket}</td>
                  <td className="py-3 px-2 font-heading font-bold text-white">{pos.symbol}</td>
                  <td className="py-3 px-2">
                    <NeoBadge variant={pos.type === 'BUY' ? 'success' : 'danger'}>
                      {pos.type === 'BUY' ? (
                        <span className="flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />{pos.type}</span>
                      ) : (
                        <span className="flex items-center gap-1"><ArrowDownRight className="w-3 h-3" />{pos.type}</span>
                      )}
                    </NeoBadge>
                  </td>
                  <td className="py-3 px-2 font-mono text-white">{pos.lots.toFixed(2)}</td>
                  <td className="py-3 px-2 font-mono text-gray-300">{pos.entryPrice}</td>
                  <td className="py-3 px-2 font-mono text-white">{pos.currentPrice}</td>
                  <td className="py-3 px-2 font-mono text-gray-400">{pos.stopLoss ?? '—'}</td>
                  <td className="py-3 px-2 font-mono text-gray-400">{pos.takeProfit ?? '—'}</td>
                  <td className={cn('py-3 px-2 font-heading font-bold', getPnLColor(pos.floatingPnL))}>
                    {formatPnL(pos.floatingPnL)}
                  </td>
                  <td className="py-3 px-2 text-gray-400 text-xs">{formatDuration(pos.duration)}</td>
                  <td className="py-3 px-2 text-xs text-gray-400 max-w-[140px] truncate">{pos.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NeoCard>

      {/* ==================== ROW 4: AI SIGNALS + RISK CENTER ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Signals Panel */}
        <NeoCard className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#00E5FF]" />
              <h2 className="font-heading text-lg font-bold text-white">AI Signals</h2>
            </div>
            <NeoBadge variant="info">{signals?.filter((s) => s.status === 'active').length ?? 0} Active</NeoBadge>
          </div>
          <div className="space-y-3">
            {signals?.map((sig) => (
              <div
                key={sig.id}
                className="flex items-start gap-3 p-3 bg-[#07152F] border-2 border-[#1a3a5c] rounded-md hover:border-[#00E5FF]/40 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <NeoBadge
                    variant={
                      sig.direction === 'BUY'
                        ? 'success'
                        : sig.direction === 'SELL'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {sig.direction}
                  </NeoBadge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading font-bold text-white text-sm">{sig.symbol}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{sig.timeframe}</span>
                    <NeoBadge
                      variant={
                        sig.trend === 'BULLISH'
                          ? 'success'
                          : sig.trend === 'BEARISH'
                          ? 'danger'
                          : 'neutral'
                      }
                    >
                      {sig.trend}
                    </NeoBadge>
                  </div>
                  {/* Confidence Bar */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-2 bg-[#0D2247] border border-[#1a3a5c] rounded-sm overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-sm transition-all duration-500',
                          sig.confidence >= 75
                            ? 'bg-[#74FF44]'
                            : sig.confidence >= 60
                            ? 'bg-[#FFE600]'
                            : 'bg-[#FF4B57]'
                        )}
                        style={{ width: `${sig.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-heading font-bold text-white w-9 text-right">
                      {sig.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{sig.reason}</p>
                  <p className="text-[10px] text-gray-600 mt-1">
                    {new Date(sig.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </NeoCard>

        {/* Risk Center Mini */}
        <NeoCard className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00E5FF]" />
              <h2 className="font-heading text-lg font-bold text-white">Risk Center</h2>
            </div>
            {risk && (
              <NeoBadge
                variant={
                  risk.riskStatus === 'SAFE'
                    ? 'success'
                    : risk.riskStatus === 'WARNING'
                    ? 'warning'
                    : 'danger'
                }
              >
                {risk.riskStatus === 'SAFE' && <ShieldCheck className="w-3 h-3 mr-1" />}
                {risk.riskStatus !== 'SAFE' && <ShieldAlert className="w-3 h-3 mr-1" />}
                {risk.riskStatus}
              </NeoBadge>
            )}
          </div>
          {risk && (
            <div className="space-y-4">
              {/* Drawdown Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#07152F] border-2 border-[#1a3a5c] rounded-md p-3">
                  <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Current Drawdown
                  </p>
                  <p className={cn(
                    'text-xl font-heading font-bold',
                    risk.currentDrawdown <= 3 ? 'text-[#74FF44]' : risk.currentDrawdown <= 6 ? 'text-[#FFE600]' : 'text-[#FF4B57]'
                  )}>
                    {risk.currentDrawdown.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-[#07152F] border-2 border-[#1a3a5c] rounded-md p-3">
                  <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Max Drawdown
                  </p>
                  <p className="text-xl font-heading font-bold text-[#FF4B57]">
                    {risk.maxDrawdown.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Margin Health */}
              <div className="bg-[#07152F] border-2 border-[#1a3a5c] rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider">
                    Margin Health
                  </p>
                  <span className="text-xs font-heading font-bold text-white">
                    {formatNumber(risk.marginLevel)}%
                  </span>
                </div>
                <div className="h-3 bg-[#0D2247] border border-[#1a3a5c] rounded-sm overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-sm transition-all duration-700',
                      risk.marginLevel >= 500 ? 'bg-[#74FF44]' : risk.marginLevel >= 200 ? 'bg-[#FFE600]' : 'bg-[#FF4B57]'
                    )}
                    style={{ width: `${Math.min((risk.marginLevel / 2000) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-gray-600">0%</span>
                  <span className="text-[9px] text-[#FFE600]">Alert: {risk.marginLevelAlert}%</span>
                  <span className="text-[9px] text-gray-600">2000%</span>
                </div>
              </div>

              {/* Risk Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#07152F] border-2 border-[#1a3a5c] rounded-md p-3">
                  <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Daily Loss
                  </p>
                  <p className="text-sm font-heading font-bold text-white">
                    {formatCurrency(risk.maxDailyLoss)} / {formatCurrency(risk.maxDailyLossLimit)}
                  </p>
                </div>
                <div className="bg-[#07152F] border-2 border-[#1a3a5c] rounded-md p-3">
                  <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Risk Per Trade
                  </p>
                  <p className="text-sm font-heading font-bold text-white">
                    {risk.currentRiskPerTrade}% / {risk.maxRiskPerTrade}%
                  </p>
                </div>
                <div className="bg-[#07152F] border-2 border-[#1a3a5c] rounded-md p-3">
                  <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Consec. Losses
                  </p>
                  <p className="text-sm font-heading font-bold text-white">
                    {risk.consecutiveLosses} / {risk.maxConsecutiveLosses}
                  </p>
                </div>
                <div className="bg-[#07152F] border-2 border-[#1a3a5c] rounded-md p-3">
                  <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Equity Shield
                  </p>
                  <p className={cn('text-sm font-heading font-bold', risk.equityShield ? 'text-[#74FF44]' : 'text-[#FF4B57]')}>
                    {risk.equityShield ? '🛡 ACTIVE' : 'INACTIVE'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </NeoCard>
      </div>

      {/* ==================== ROW 5: BOT HEALTH + RECENT ACTIVITIES ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bot Health Mini */}
        <NeoCard className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#00E5FF]" />
              <h2 className="font-heading text-lg font-bold text-white">Bot Health</h2>
            </div>
            <NeoBadge variant="success">{runningBots} Running</NeoBadge>
          </div>
          <div className="space-y-3">
            {bots?.map((bot) => (
              <div
                key={bot.id}
                className="bg-[#07152F] border-2 border-[#1a3a5c] rounded-md p-4 hover:border-[#00E5FF]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CircleDot
                      className={cn(
                        'w-3 h-3',
                        bot.status === 'RUNNING'
                          ? 'text-[#74FF44]'
                          : bot.status === 'PAUSED'
                          ? 'text-[#FFE600]'
                          : 'text-[#FF4B57]'
                      )}
                    />
                    <span className="font-heading font-bold text-white text-sm">{bot.name}</span>
                  </div>
                  <NeoBadge
                    variant={
                      bot.status === 'RUNNING'
                        ? 'success'
                        : bot.status === 'PAUSED'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {bot.status}
                  </NeoBadge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>Strategy:</span>
                    <span className="text-white truncate max-w-[100px]">{bot.strategy}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Brain className="w-3 h-3" />
                    <span>AI:</span>
                    {bot.aiConnection === 'connected' ? (
                      <span className="text-[#74FF44] flex items-center gap-0.5"><Wifi className="w-3 h-3" /> OK</span>
                    ) : (
                      <span className="text-[#FF4B57] flex items-center gap-0.5"><WifiOff className="w-3 h-3" /> OFF</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Heart className="w-3 h-3" />
                    <span>Heartbeat:</span>
                    <span className="text-white">Active (&lt;5s ago)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Timer className="w-3 h-3" />
                    <span>Uptime:</span>
                    <span className="text-white">{formatDuration(bot.uptime)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </NeoCard>

        {/* Recent Activities */}
        <NeoCard className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00E5FF]" />
              <h2 className="font-heading text-lg font-bold text-white">Recent Activities</h2>
            </div>
            <span className="text-[10px] text-gray-500 font-heading uppercase tracking-wider">Live Feed</span>
          </div>
          <div className="space-y-1">
            {activities?.map((act) => {
              const IconMap: Record<string, React.ElementType> = {
                TrendingUp,
                TrendingDown,
                Brain,
                Bot,
                Shield,
                Target,
                Info,
              };
              const IconComp = IconMap[act.icon] || Activity;
              const colorMap: Record<string, string> = {
                trade: 'text-[#00E5FF]',
                ai: 'text-[#1746FF]',
                bot: 'text-[#74FF44]',
                risk: 'text-[#FFE600]',
                system: 'text-gray-400',
              };

              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-3 rounded-md hover:bg-[#07152F] transition-colors group"
                >
                  <div
                    className={cn(
                      'w-8 h-8 flex-shrink-0 bg-[#07152F] border-2 border-[#1a3a5c] rounded-md flex items-center justify-center group-hover:border-[#00E5FF]/30 transition-colors',
                    )}
                  >
                    <IconComp className={cn('w-4 h-4', colorMap[act.type] || 'text-gray-400')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 leading-snug">{act.message}</p>
                    <p className="text-[10px] text-gray-600 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(act.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </NeoCard>
      </div>
    </div>
  );
}
