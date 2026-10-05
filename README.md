# KKN Desa Cipelang — Svarakarsa

Website full-stack untuk profil KKN, informasi Desa Cipelang, publikasi program kerja, kegiatan, berita, galeri, dan dashboard admin.

## Teknologi
- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL
- Authentication: JWT
- Upload foto: JPG / PNG / WEBP, maksimal 5 MB

## Fitur Publik
- Beranda KKN Svarakarsa
- Profil Desa Cipelang
- Program kerja
- Kegiatan
- Galeri dokumentasi
- Anggota KKN
- Berita
- Form kontak
- Responsive desktop & mobile

## Fitur Admin
- Login admin
- Dashboard statistik
- Kelola profil desa
- Tambah / edit / hapus anggota
- Tambah / edit / hapus program kerja
- Tambah / edit / hapus kegiatan
- Tambah / edit / hapus berita
- Tambah / edit / hapus galeri
- Upload dan preview foto
- Ganti foto tanpa mengetik URL
- Date picker untuk tanggal
- Kelola pesan masuk
- Ganti password admin

## Menjalankan di Windows

### Cara cepat

Setelah database dan `.env` siap, dari folder utama jalankan:

```powershell
.\run-all.ps1
```

Script akan membuka backend dan frontend pada dua jendela PowerShell.

### Cara manual

#### 1. Buat database PostgreSQL

```sql
CREATE DATABASE kkn_svarakarsa;
```

#### 2. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` dan sesuaikan `DATABASE_URL` dengan password PostgreSQL kamu.

```powershell
uvicorn app.main:app --reload
```

Backend:
- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/health

#### 3. Frontend

Buka terminal baru:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend:
- http://localhost:5173
- Admin: http://localhost:5173/admin

## Akun Admin Awal

Atur di `backend/.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

Setelah berhasil masuk, ganti password melalui menu **Keamanan**.

## Jika password PostgreSQL salah

Error berikut:

```text
FATAL: password authentication failed for user "postgres"
```

berarti password di `backend/.env` tidak sama dengan password user PostgreSQL. Samakan keduanya lalu restart backend.

## Logo

Logo terbaru tersimpan di:

```text
frontend/public/svarakarsa-logo.png
```

Logo digunakan pada header, login, sidebar admin, footer, hero, dan favicon.

## Deployment Render

File `render.yaml` sudah disiapkan untuk:
- Static Site React
- FastAPI Web Service
- PostgreSQL

Sebelum deployment production, isi secret:
- `SECRET_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CORS_ORIGINS`

### Catatan upload production
Folder upload lokal pada service web tidak cocok dijadikan penyimpanan dokumentasi jangka panjang. Untuk production, gunakan object storage/CDN atau persistent disk yang sesuai dengan hosting.
