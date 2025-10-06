# Troubleshooting Guide

## Error 404 di Vercel

### 1. Cek Status Deployment
- Buka https://vercel.com/dashboard
- Pilih project `porto-astro`
- Lihat di tab "Deployments"
- Pastikan status deployment = "Ready" (bukan "Building" atau "Error")

### 2. Cek Build Logs
Jika deployment gagal:
- Klik deployment yang error
- Klik tab "Build Logs"
- Cari error message di log

**Common errors:**
- `Missing environment variables` → Tambahkan env vars di Vercel
- `Build failed` → Cek syntax error di code
- `Module not found` → Run `pnpm install` di local untuk cek dependencies

### 3. Cek URL yang Benar
Vercel memberikan URL otomatis:
```
https://[project-name]-[hash].vercel.app
```

**Contoh:**
- ✅ `https://porto-astro.vercel.app`
- ✅ `https://porto-astro-git-main-alwiam.vercel.app`
- ❌ `https://porto-astro.com` (custom domain belum setup)

### 4. Force Redeploy
Jika masih error:
```bash
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### 5. Environment Variables
Pastikan semua 5 variables sudah ditambahkan:
- `GROQ_API_KEY`
- `PUBLIC_EMAILJS_SERVICE_ID`
- `PUBLIC_EMAILJS_TEMPLATE_ID`
- `PUBLIC_EMAILJS_PUBLIC_KEY`
- `PUBLIC_GA_MEASUREMENT_ID`

**Cara cek:**
1. Buka Vercel dashboard
2. Pilih project → Settings → Environment Variables
3. Harus ada 5 variables

### 6. Vercel Configuration
Pastikan settings benar:
- Framework Preset: **Astro**
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`
- Node Version: 18.x atau 20.x

## Error di Local Development

### Blog Error "Cannot read properties of undefined"
✅ **FIXED** - Sudah diperbaiki di commit terbaru

Jika masih error:
```bash
git pull origin main
pnpm install
pnpm dev
```

### Dark Mode Navigation Links Tidak Terlihat
✅ **FIXED** - Sudah diperbaiki di commit terbaru

### Icon 404 Error
Warning `[404] /icons/icon-144x144.png` adalah normal.
Ini karena PWA icons belum dibuat (optional).

Untuk fix (opsional):
1. Buat icon 512x512px
2. Generate semua size dengan https://realfavicongenerator.net/
3. Upload ke `public/icons/`

## Vercel Deployment Checklist

- [ ] Repository sudah di-push ke GitHub
- [ ] Import project dari GitHub ke Vercel
- [ ] Framework preset = Astro
- [ ] Environment variables (5 variables) sudah ditambahkan
- [ ] Deployment status = Ready
- [ ] Buka URL Vercel untuk test
- [ ] Test fitur:
  - [ ] Dark mode toggle
  - [ ] Contact form
  - [ ] Chatbot
  - [ ] Blog posts
  - [ ] Navigation links

## Kontak Error 404 di URL Spesifik

Jika error terjadi di URL tertentu (misal `/blog/post-name`):

1. **Cek di local dulu:**
   ```bash
   pnpm dev
   # Buka http://localhost:4321/blog/post-name
   ```

2. **Jika work di local tapi error di Vercel:**
   - Kemungkinan masalah SSR/SSG
   - Cek Vercel build logs
   - Pastikan `output: 'server'` ada di astro.config.mjs

3. **Error ID format `sin1::jjqz8-...`:**
   - Ini adalah Vercel error ID
   - Copy error ID
   - Contact Vercel support jika perlu
   - Atau cek logs di Vercel dashboard dengan filter error ID

## Quick Fix Commands

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Astro cache
rm -rf .astro dist
pnpm build

# Test local build
pnpm build
pnpm preview
```

## Masih Error?

1. Cek repository GitHub: https://github.com/AlwiAM/porto-astro
2. Cek commit terakhir apakah sudah include fixes
3. Share screenshot error dari Vercel build logs
4. Share URL lengkap yang error
