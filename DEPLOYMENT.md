# Deployment Guide

## 🚀 Platform Deployment

Portfolio ini sudah siap deploy ke berbagai platform. Pilih salah satu:

---

## 1. Vercel (Recommended) ⚡

### Why Vercel?
- ✅ Zero config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier generous
- ✅ Perfect for Astro SSR

### Deploy Steps:

#### Option A: GitHub (Recommended)
```bash
# 1. Push to GitHub
git remote add origin https://github.com/yourusername/portfolio.git
git branch -M main
git push -u origin main

# 2. Go to vercel.com
# 3. Import from GitHub
# 4. Select repository
# 5. Configure:
```

**Vercel Configuration:**
- Framework Preset: `Astro`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

**Environment Variables:**
```
GROQ_API_KEY=your_groq_api_key_here
PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id
```

See `VERCEL_ENV.md` or `.env` for actual values.

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables via dashboard or:
vercel env add GROQ_API_KEY
# Then paste your key value

# Repeat for all variables

# Deploy to production
vercel --prod
```

---

## 2. Netlify 🌐

### Deploy Steps:

#### Option A: GitHub
```bash
# 1. Push to GitHub (same as above)

# 2. Go to netlify.com
# 3. New site from Git
# 4. Select repository
# 5. Configure:
```

**Netlify Configuration:**
- Build command: `pnpm build`
- Publish directory: `dist`
- Node version: `20`

**Environment Variables:**
Add in Site Settings → Environment Variables (see `VERCEL_ENV.md` or `.env` for values):
```
GROQ_API_KEY=your_groq_api_key_here
PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id
```

Create `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Option B: Netlify CLI
```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## 3. Railway 🚂

### Deploy Steps:

```bash
# 1. Go to railway.app
# 2. New Project → Deploy from GitHub
# 3. Select repository
# 4. Configure:
```

**Railway Configuration:**
- Start Command: `node ./dist/server/entry.mjs`
- Build Command: `pnpm build`

**Environment Variables (see `VERCEL_ENV.md` or `.env` for values):**
```
GROQ_API_KEY=your_groq_api_key_here
PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id
PORT=3000
```

---

## 4. Cloudflare Pages ☁️

```bash
# Install Wrangler
npm i -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy dist
```

**Or via dashboard:**
1. Go to Cloudflare Pages
2. Connect GitHub
3. Build: `pnpm build`
4. Output: `dist`

---

## 📋 Pre-Deployment Checklist

### 1. Update Site URL
Edit `astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://yourdomain.com', // Change this!
  // ...
})
```

### 2. Test Build Locally
```bash
pnpm build
pnpm preview
```

### 3. Verify Environment Variables
Check `.env` has all required vars:
- ✅ GROQ_API_KEY (already set)
- ✅ PUBLIC_EMAILJS_* (already set)
- ✅ PUBLIC_GA_MEASUREMENT_ID (already set)

### 4. Test All Features
- [ ] Contact form sends email
- [ ] Chatbot responds
- [ ] Dark mode toggles
- [ ] Blog posts load
- [ ] Navigation works

### 5. Check SEO
```bash
# Generate sitemap (auto on build)
pnpm build

# Check dist/sitemap-index.xml exists
ls dist/sitemap*.xml
```

---

## 🔧 Platform-Specific Notes

### Vercel
- **Pros**: Fastest, best DX, auto preview deploys
- **Cons**: Function cold starts (minor)
- **Best for**: Production portfolios

### Netlify
- **Pros**: Great forms, split testing, edge functions
- **Cons**: Slightly slower builds
- **Best for**: Complex needs, forms

### Railway
- **Pros**: Persistent server, database support
- **Cons**: Paid after free tier ($5/mo)
- **Best for**: Full-stack apps

### Cloudflare Pages
- **Pros**: Global edge network, super fast
- **Cons**: Adapter config needed
- **Best for**: High traffic sites

---

## 🌐 Custom Domain Setup

### Vercel:
1. Dashboard → Settings → Domains
2. Add domain: `adammaulana.dev`
3. Follow DNS instructions
4. Wait for SSL (auto)

### Netlify:
1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS records
4. SSL auto-provisioned

---

## 🔐 Environment Variables Security

**Never commit `.env` to GitHub!**

Already in `.gitignore`:
```
.env
.env.local
```

**For team members:**
1. Share `.env.example`
2. They copy to `.env`
3. Add their own keys

---

## 📊 Monitoring & Analytics

### Google Analytics Setup:
Already configured! Just verify in GA dashboard.

### Vercel Analytics (Optional):
```bash
pnpm add @vercel/analytics
```

Add to `Layout.astro`:
```astro
---
import { Analytics } from '@vercel/analytics/astro';
---
<Analytics />
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Check Node version
node -v  # Should be 18+

# Clear cache
rm -rf node_modules .astro dist
pnpm install
pnpm build
```

### API Routes 404
Make sure adapter is set to `node` in `astro.config.mjs`

### Environment Variables Not Working
- Public vars must start with `PUBLIC_`
- Server vars (like GROQ_API_KEY) don't need `PUBLIC_`
- Restart dev server after changing .env

### Images Not Loading
Check `astro.config.mjs`:
```js
image: {
  domains: ['images.unsplash.com'],
}
```

---

## 🎯 Post-Deployment

### 1. Test Everything
- Contact form
- Chatbot
- All links
- Mobile view
- Dark mode

### 2. Update README
Add deployment URL:
```md
🌐 **Live**: https://yourdomain.vercel.app
```

### 3. Share!
- LinkedIn
- Twitter
- GitHub profile
- Resume

---

## 📝 Quick Deploy Commands

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Railway
git push railway main

# Cloudflare
wrangler pages deploy dist
```

---

**Recommended: Vercel** untuk kemudahan dan kecepatan! 🚀
