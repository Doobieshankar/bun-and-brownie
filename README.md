# Bun & Brownie

Family bakery site for **Bun & Brownie**, Tumkur (Kotitopu).

- Stack: Next.js + Bun + Tailwind
- Live deploy: Netlify (free) ← connected to this GitHub repo

## Local development

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content to edit later

Business copy, menu prices, and links live in:

`src/lib/site.ts`

When you add a database later, that file is the first place to replace with API data.

## Deploy pipeline (GitHub → Netlify)

```
you edit code → git push origin main → Netlify builds → site updates
```

1. This repo is on GitHub under **Doobieshankar**
2. Netlify watches the `main` branch
3. Every push rebuilds the site automatically (free tier)

### First-time Netlify setup (one time)

1. Sign up at [https://app.netlify.com](https://app.netlify.com) with **GitHub** (same Doobieshankar account)
2. **Add new site** → **Import an existing project**
3. Pick **`Doobieshankar/bun-and-brownie`**
4. Build settings (usually auto-detected from `netlify.toml`):
   - Build command: `bun run build`
   - Publish directory: `.next`
5. Click **Deploy site**
6. Netlify gives a free URL like `https://something.netlify.app`  
   You can rename it under **Site configuration → Domain management**

### After that

```bash
git add .
git commit -m "your message"
git push
```

Wait 1–2 minutes → refresh the Netlify URL.

## Scripts

| Command        | What it does              |
|----------------|---------------------------|
| `bun run dev`  | Local site                |
| `bun run build`| Production build          |
| `bun run start`| Run production build locally |
