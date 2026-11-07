# 🛡️ PANDUAN DEPLOYMENT KE SERVER & KEAMANAN SUPERADMIN
## GOLDSHIELD AI — TRADING INTELLIGENCE DASHBOARD

Dokumen ini memuat panduan lengkap untuk melakukan upload dan deployment aplikasi **GOLDSHIELD AI** ke server VPS (Ubuntu/Debian), Docker, atau Cloud Hosting dengan sistem keamanan berbasis **Next.js Route Middleware** dan **Superadmin Role-Based Access Control (RBAC)**.

---

## 1. KREDENSIAL SUPERADMIN BAWAAN

Secara default, aplikasi telah dikonfigurasi dengan akun **Superadmin** dengan hak akses penuh:

| Parameter | Nilai Default | Keterangan |
| :--- | :--- | :--- |
| **Email Superadmin** | `superadmin@goldshield.ai` | Akun utama hak akses tertinggi |
| **Password Superadmin** | `GoldShield#Admin2026!` | Password master awal |
| **Email Admin Standar** | `admin@goldshield.ai` | Akun officer operasional |
| **Password Admin** | `Admin@GoldShield2026` | Password admin standar |
| **Sesi Token** | HMAC-SHA256 (Web Crypto) | Disimpan dalam cookie aman `goldshield_session` |
| **Masa Berlaku Sesi** | 7 Hari | Otomatis diperpanjang saat aktif |

> [!IMPORTANT]
> **SEBELUM UPLOAD KE SERVER PRODUKSI:**
> Ubah password default di atas dengan mengedit file `.env.production` atau `.env.local` pada server Anda.

---

## 2. ARSITEKTUR KEAMANAN SISTEM

Aplikasi ini menggunakan beberapa lapis keamanan:

1. **Next.js Secure Route Middleware (`src/middleware.ts`)**:
   - Memfilter setiap request yang masuk ke dashboard (`/`, `/trading-accounts`, `/open-positions`, `/orders-history`, `/ea-bot-monitor`, `/ai-intelligence`, dll.).
   - Jika pengguna belum login atau token sesi tidak valid/kedaluwarsa, server otomatis melakukan **redirect 307 ke `/login`**.
   - Mencegah akses langsung tanpa autentikasi melalui URL browser.

2. **HttpOnly & Secure Session Cookie**:
   - Cookie sesi (`goldshield_session`) disetel dengan flag `HttpOnly`, `SameSite=Lax`, dan `Secure` (saat mode produksi).
   - Cookie tidak dapat diakses atau dicuri oleh skrip JavaScript di browser (proteksi XSS).

3. **Verifikasi Kriptografi Universal (Web Crypto API)**:
   - Token ditandatangani menggunakan algoritma kriptografi HMAC-SHA256.
   - Kompatibel 100% dengan Next.js Edge Runtime, Linux x64/ARM64, Docker, dan Node.js.

4. **Multi-Role RBAC**:
   - **`superadmin`**: Hak kontrol tertinggi (guardrail, kill switch bot, manajemen akun).
   - **`admin`**: Manajemen akun dan pemantauan sinyal.
   - **`trader`**: Akun trading langsung dari Exness MT5.

---

## 3. LANGKAH DEPLOYMENT KE SERVER VPS (UBUNTU / DEBIAN)

### Langkah A: Persiapan Server
Pastikan Node.js 18+ (atau Node.js 20 LTS) dan Git sudah terpasang di VPS Anda:
```bash
# Update repository
sudo apt update && sudo apt upgrade -y

# Pasang Node.js 20 LTS (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

# Pasang PM2 untuk process management background
sudo npm install -g pm2
```

### Langkah B: Clone Repository & Konfigurasi File Lingkungan (.env)
```bash
# Masuk ke direktori web server
cd /var/www

# Clone repository project Anda
git clone <URL_REPO_ANDA> goldshield-dashboard
cd goldshield-dashboard

# Salin konfigurasi environment
cp .env.example .env.production

# Edit password dan secret key Anda
nano .env.production
```

Contoh konfigurasi `.env.production` yang aman:
```env
# Ganti dengan string acak rahasia Anda sendiri
AUTH_SECRET="kunci-rahasia-acak-super-kuat-minimal-32-karakter-xyz-2026"

# Kredensial Superadmin Anda
SUPERADMIN_NAME="Superadmin GoldShield"
SUPERADMIN_EMAIL="admin-anda@domainanda.com"
SUPERADMIN_PASSWORD="PasswordKuatAnda#2026!"

# Fast API MT5 Gateway
NEXT_PUBLIC_GATEWAY_URL="http://127.0.0.1:8000"

NODE_ENV="production"
PORT=3000
```

### Langkah C: Install Dependensi & Build Aplikasi
```bash
# Install seluruh packages
npm install

# Build Next.js untuk production
npm run build
```

### Langkah D: Jalankan dengan PM2 (Auto-Restart 24/7)
```bash
# Jalankan Next.js produksi dengan PM2
pm2 start npm --name "goldshield-app" -- start

# Simpan konfigurasi PM2 agar auto-start saat VPS reboot
pm2 save
pm2 startup
```

---

## 4. KONFIGURASI NGINX REVERSE PROXY & SSL (HTTPS)

Untuk mengarahkan domain Anda (misal `trade.domainanda.com`) ke port 3000 dengan sertifikat SSL gratis dari Let's Encrypt:

```bash
# Pasang Nginx dan Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Buat file konfigurasi Nginx
sudo nano /etc/nginx/sites-available/goldshield
```

Isi dengan:
```nginx
server {
    listen 80;
    server_name trade.domainanda.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi dan pasang SSL:
```bash
sudo ln -s /etc/nginx/sites-available/goldshield /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Pasang SSL gratis (HTTPS otomatis aktif)
sudo certbot --nginx -d trade.domainanda.com
```

---

## 5. ALTERNATIF: DEPLOYMENT DENGAN DOCKER

Jika menggunakan Docker, buat file `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

Build dan jalankan:
```bash
docker build -t goldshield-ai:latest .
docker run -d -p 3000:3000 --env-file .env.production --name goldshield-app goldshield-ai:latest
```

---

## 6. CARA LOGIN PERTAMA KALI SETELAH DEPLOY

1. Buka browser dan akses domain Anda: `https://trade.domainanda.com`
2. Sistem otomatis mengalihkan ke halaman **`/login`**.
3. Pilih tab **👑 Superadmin**.
4. Masukkan email dan password Superadmin yang telah Anda tentukan di `.env.production`.
5. Klik **"Masuk sebagai Superadmin"**.
6. Dashboard akan terbuka dengan role badge `👑 SUPERADMIN`.

Selesai! Aplikasi Anda siap digunakan secara aman di server produksi.

