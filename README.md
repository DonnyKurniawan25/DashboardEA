# GOLDSHIELD AI — TRADING INTELLIGENCE DASHBOARD

Sistem dashboard trading kuantitatif real-time generasi baru berbasis desain **Modern Neo Brutalism** untuk pemantauan Expert Advisor (EA), robot trading bertenaga AI, akun broker MetaTrader 5 (MT5), performa transaksi, dan manajemen risiko institusional.

---

## 🎨 FITUR UTAMA & DESIGN SYSTEM

### Neo Brutalism Styling
- **Background Utama:** Deep Navy `#07152F`
- **Primary Accent:** Electric Blue `#1746FF`
- **Secondary Accent:** Cyan `#00E5FF`
- **Cards & Surfaces:** Midnight Navy `#0D2247` dengan Border `#050505` tebal 2–3px
- **Hard Shadow:** `shadow-[3px_3px_0px_#050505]` dan `shadow-[4px_4px_0px_#050505]`
- **Status Colors:** Lime Green `#74FF44` (Profit/Running), Bright Red `#FF4B57` (Loss/Error), Yellow `#FFE600` (Warning/Demo)
- **Typography:** Space Grotesk (Heading & Angka penting) + Inter (Body data)

---

## 🚀 STRUKTUR HALAMAN & NAVIGASI (12 MODUL LENGKAP)

1. **Dashboard Overview (`/`)**
   - 10 KPI Summary Cards animasi (Balance, Equity, Floating P/L, Today P/L, Free Margin, Margin Level, Open Positions, Total Trades, Win Rate, Bot Status).
   - Interactive Equity Growth AreaChart (1D, 7D, 1M, 3M, 6M, YTD, ALL).
   - Daily P/L Bar Chart dengan warna hijau/merah dinamis.
   - Live Open Positions Table dengan lot, entry, floating P/L, dan durasi.
   - AI Signals Live Feed dengan progress bar tingkat keyakinan.
   - Risk Center Mini (Drawdown gauge, Margin health, Exposure meter).
   - Bot Health Telemetry & Recent Activities Feed.

2. **Trading Accounts (`/trading-accounts`)**
   - Multi-Account MT5 monitoring (Exness, Finex, ICMarkets).
   - Kartu metrik akun independen (Balance, Equity, Leverage, Server, Status Koneksi).
   - Validasi deteksi mata uang majemuk (USD vs EUR) untuk mencegah salah hitung tanpa konversi.

3. **Open Positions (`/open-positions`)**
   - Monitoring posisi aktif secara real-time.
   - Pencarian tiket, filter sisi (BUY / SELL), dan pengurutan (P/L, lot, durasi).
   - Simulasi penutupan transaksi aman.

4. **Orders & History (`/orders-history`)**
   - Tab filter status (All, Closed, Pending, Cancelled).
   - Ekspor log transaksi ke file CSV langsung dari browser.
   - Pagination dan perhitungan agregat Win Rate serta Profit Factor.

5. **EA / Bot Monitor (`/ea-bot-monitor`)**
   - Telemetry robot trading (GoldShield AI Master, FX Scalper, JPY Runner).
   - Status bot (RUNNING, PAUSED, ERROR, SAFE MODE).
   - Monitoring Grid Level, Basket P/L, Heartbeat, dan Error Diagnostics.
   - Safety audit lock banner untuk proteksi transaksi otomatis.

6. **AI Intelligence (`/ai-intelligence`)**
   - Selector instrumen (XAUUSD, EURUSD, GBPUSD, dll) dan timeframe (M15, H1, H4, D1).
   - Matriks konfluensi teknikal: Multi-TF Trend Alignment, RSI Gauge, Volatility/ATR, Support & Resistance.
   - AI Decision Trail & Risk Gatekeeper Log (penjelasan mengapa risk manager menerima/menolak sinyal).
   - Disclaimer kepatuhan regulasi statistik.

7. **Risk Center (`/risk-center`)**
   - Institutional Capital Guardrails & Circuit Breakers.
   - Toggle sakelar darurat Equity Shield.
   - Drawdown monitor, Daily Loss limit progress bar, Margin Level buffer.
   - Distribusi eksposur modal per simbol dan per arah transaksi (LONG vs SHORT).
   - Log riwayat intervensi risiko.

8. **Trading Analytics (`/trading-analytics`)**
   - Analisis kuantitatif performa: Cumulative Equity Curve, Weekly P/L, Profit by Strategy, Profit by Symbol.
   - Pembagian performa berdasarkan sesi trading (Tokyo, London, New York).
   - Ekspor ringkasan performa ke file CSV.

9. **Market Monitor (`/market-monitor`)**
   - Kuotasi harga live tick feed (simulasi streaming 3 detik).
   - Bid, Ask, Spread point, 24h High/Low range visual bar, dan volume.

10. **Notifications (`/notifications`)**
    - Alert stream terpusat untuk order open/close, take profit, stop loss, drawdown alert, dan status EA.
    - Filter kategori dan tombol uji simulasi dispatch ke channel Telegram.

11. **Integrations & MT5 Bridge (`/integrations`)**
    - Arsitektur: `MetaTrader 5 → Python MT5 Bridge → FastAPI → WebSocket → Next.js Dashboard`.
    - Dokumentasi kontrak endpoint OpenAPI/FastAPI.
    - Zero-knowledge browser credential policy.
    - Uji ping koneksi gateway.

12. **Settings (`/settings`)**
    - Konfigurasi parameter guardrail risiko (Max Drawdown, Max Daily Loss, Max Risk per Trade).
    - Threshold keyakinan minimum AI (misal sinyal <65% ditolak otomatis).
    - Preferensi notifikasi Telegram dan chime audio.

---

## 🛠 TECH STACK

- **Framework:** Next.js (App Router, React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Neo-Brutalist Theme)
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** Zustand
- **Tables & Forms:** TanStack Table, React Hook Form, Zod
- **Data Layer:** TanStack Query & Clean Service Abstraction (`src/services/api.ts`)

---

## 💻 CARA MENJALANKAN SECARA LOKAL

### 1. Masuk ke direktori proyek
```bash
cd e:\NextJS\DashboardEATrade
```

### 2. Jalankan server development
```bash
npm run dev
```

### 3. Buka di browser
Buka browser dan akses:
```
http://localhost:3000
```

### 4. Build untuk Production (Opsional)
```bash
npm run build
npm run start
```
