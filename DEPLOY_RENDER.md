# Publikasi KKN Svarakarsa ke Render

Project ini sudah disiapkan sebagai monorepo: frontend React/Vite, backend FastAPI, dan PostgreSQL. Render mendukung static site untuk frontend, web service untuk FastAPI, dan managed Postgres; `render.yaml` menyatukan konfigurasi tersebut. Untuk pengguna Indonesia, service dan database dapat ditempatkan di Singapore. Static site tetap dilayani melalui global CDN.

## 1. Siapkan GitHub
Buat repository baru, misalnya:

`kkn-svarakarsa`

Push seluruh isi folder project ke branch `main`.

## 2. Hubungkan repository ke Render
Di Render Dashboard pilih **New → Blueprint** lalu pilih repository yang berisi `render.yaml`.

Blueprint akan membaca:
- `backend` sebagai FastAPI service
- `frontend` sebagai static site
- `svarakarsa-db` sebagai PostgreSQL

## 3. Isi secrets saat diminta
Gunakan nilai berbeda dari development:

```text
SECRET_KEY       = string acak panjang
ADMIN_USERNAME   = admin
ADMIN_PASSWORD   = password admin yang kuat
```

Jangan commit `.env` ke Git.

## 4. Setelah deploy
Endpoint backend:

`https://svarakarsa-api.onrender.com`

Frontend:

`https://svarakarsa-web.onrender.com`

Health check:

`https://svarakarsa-api.onrender.com/health`

Swagger:

`https://svarakarsa-api.onrender.com/docs`

## 5. Custom domain
Tambahkan domain pada static site di Render. Setelah domain berubah, update `CORS_ORIGINS` pada backend agar berisi URL frontend baru, lalu redeploy backend.

## 6. Upload gambar
Upload gambar memakai filesystem service backend. Untuk data dokumentasi yang harus bertahan melewati redeploy/instance replacement, gunakan persistent disk atau object storage/CDN. Field foto juga menerima URL gambar eksternal.

## 7. Deployment otomatis
Setelah repository terhubung, push ke branch yang dipakai Render akan memicu deployment baru.
