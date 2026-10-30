# Bun & Brownie

Family bakery site for **Bun & Brownie**, Tumkur (Kotitopu).

- Stack: Next.js + Bun + Tailwind
- Live deploy: [Vercel](https://bun-and-brownie.vercel.app) ← connected to this GitHub repo
- Content CMS: Neon Postgres + Vercel Blob (or Cloudinary) + `/admin` (see [DEPLOY-DB.md](./DEPLOY-DB.md))

## Local development

```bash
bun install
cp .env.example .env.local   # fill Neon + blob/Cloudinary + admin secrets
bun run db:apply
bun run db:seed
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Without `DATABASE_URL`, the site still runs using fallback copy in `src/lib/site.ts`.

## Deploy pipeline (GitHub → Vercel)

```
you edit code → git push origin main → Vercel builds → site updates
```

Add the env vars from `.env.example` in Vercel (details in `DEPLOY-DB.md`).

## Scripts

| Command           | What it does                         |
|-------------------|--------------------------------------|
| `bun run dev`     | Local site                           |
| `bun run build`   | Production build                     |
| `bun run start`   | Run production build locally         |
| `bun run db:apply` | Apply SQL schema to Neon            |
| `bun run db:push` | Push Drizzle schema to Neon          |
| `bun run db:seed` | Seed menu + combo from site fallbacks |
| `bun run db:studio` | Open Drizzle Studio                |
