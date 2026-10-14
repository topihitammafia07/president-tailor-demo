# DEPLOYMENT RUNBOOK — President Tailor MVP V1.1

Panduan resmi untuk melakukan deployment President Tailor MVP ke platform cloud (**Vercel** untuk Frontend dan **PHP 8.3 + MySQL Host** untuk Backend).

---

## 1. Topologi Arsitektur Produksi

```
[ Pengunjung Publik ] ---> https://presidenttailor.com (Vercel Project: landing)
                                    | (Informasi Publik, Statis, Ringan)
                                    v
[ Staf / Operator ]   ---> https://internal.presidenttailor.com (Vercel Project: internal)
                                    |
                                    | HTTPS API (Cookie-Session & Sanctum CSRF)
                                    v
[ Laravel Backend ]   ---> https://api.presidenttailor.com (Railway / Fly.io / VPS)
                                    |
                                    v
[ Database MySQL ]    ---> MySQL 8.x (Managed DB / Railway / VPS)
```

---

## 2. Deployment Frontend ke Vercel

Monorepo ini memisahkan dua aplikasi Next.js App Router: `landing/` dan `internal/`. Setiap aplikasi dibuatkan proyek terpisah di dasbor Vercel.

### Proyek 1: Landing Page Publik (`landing/`)
1. **Import Git Repository**: Pilih repositori Git `president-tailor`.
2. **Project Name**: `president-tailor` (atau custom).
3. **Framework Preset**: `Next.js`.
4. **Root Directory**: `landing`.
5. **Build Command**: `npm run build` (default).
6. **Output Directory**: `.next` (default).
7. **Environment Variables**: Tidak memerlukan variabel backend (halaman publik murni).
8. **Deploy**: Klik *Deploy*.

### Proyek 2: Internal Dashboard (`internal/`)
1. **Import Git Repository**: Pilih repositori Git `president-tailor` yang sama.
2. **Project Name**: `president-tailor-internal`.
3. **Framework Preset**: `Next.js`.
4. **Root Directory**: `internal`.
5. **Build Command**: `npm run build` (default).
6. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://api.presidenttailor.com` (URL backend Laravel produksi Anda).
7. **Deploy**: Klik *Deploy*.

---

## 3. Deployment Backend Laravel (`api/`)

Backend dapat dideploy pada platform seperti **Railway.app**, **Render**, **Fly.io**, atau **VPS Ubuntu (Nginx + PHP 8.3-FPM)**.

### Konfigurasi Environment Backend (`.env` Produksi)
```ini
APP_NAME="President Tailor API"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.presidenttailor.com

# URL Frontend untuk CORS & Sanctum
FRONTEND_URL=https://presidenttailor.com
INTERNAL_FRONTEND_URL=https://internal.presidenttailor.com

# Domain Stateful Sanctum (Domain Dashboard internal tanpa https://)
SANCTUM_STATEFUL_DOMAINS=internal.presidenttailor.com

# Domain Cookie Session (Gunakan apex domain jika menggunakan subdomain yang sama, misal .presidenttailor.com)
SESSION_DOMAIN=.presidenttailor.com
SESSION_SECURE_COOKIE=true
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Database MySQL Produksi
DB_CONNECTION=mysql
DB_HOST=mysql.railway.internal (atau host DB Anda)
DB_PORT=3306
DB_DATABASE=president_tailor
DB_USERNAME=db_user
DB_PASSWORD=secret_db_password
```

### Perintah Inisialisasi Produksi
Jalankan langkah berikut pada deployment server:
```bash
# 1. Install dependensi
composer install --no-dev --optimize-autoloader

# 2. Generate Application Key jika belum ada
php artisan key:generate

# 3. Jalankan migrasi dan seeder awal
php artisan migrate --force
php artisan db:seed --class=ServiceTypeSeeder --force

# 4. Buat akun staf pertama kali (atau via artisan tinker)
php artisan db:seed --force

# 5. Cache konfigurasi dan route untuk performa tinggi
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 4. Prosedur Backup & Restore Database (MySQL)

### Backup Berkala (Dump)
```bash
mysqldump -u [db_user] -p[db_password] -h [db_host] president_tailor > backup_pt_$(date +%Y%m%d_%H%M%S).sql
```

### Rehearsal Pemulihan (Restore)
```bash
mysql -u [db_user] -p[db_password] -h [db_host] president_tailor < backup_pt_[timestamp].sql
```

---

## 5. Rollback Plan
Jika terjadi kegagalan saat rilis:
1. **Frontend (Vercel)**: Buka dashboard Vercel -> Deployments -> Pilih deployment sukses sebelumnya -> Klik *Promote to Production*.
2. **Backend**:
   - Kembalikan versi Git commit sebelumnya.
   - Jika ada migrasi yang perlu dibatalkan:
     ```bash
     php artisan migrate:rollback --step=1
     ```
   - Clear dan rebuild cache:
     ```bash
     php artisan config:cache
     php artisan route:cache
     ```
