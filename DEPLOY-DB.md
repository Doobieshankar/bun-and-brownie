# Bun & Brownie — Neon + Vercel deploy

Neon Postgres for content, Vercel Blob or Cloudinary for images, Vercel for the Next.js site.

## 1) Neon

1. Create a project at https://console.neon.tech
2. Copy the **pooled** connection string
3. Locally: put it in `.env.local` as `DATABASE_URL`
4. Apply schema + seed:

```bash
# Preferred (works even if local DNS is flaky):
bun run db:apply

# Or, if drizzle-kit can reach Neon directly:
bun run db:push
bun run db:seed
```

## 2) Image uploads

Pick one:

### Vercel Blob (recommended)

1. In the Vercel project → Storage → create a **Blob** store
2. Connect it to the project (adds `BLOB_READ_WRITE_TOKEN`)

### Cloudinary (optional)

1. Create a free account at https://cloudinary.com
2. Copy Cloud name, API Key, API Secret into `.env.local` / Vercel env
3. Uploads from `/admin` go to folder `bun-and-brownie`

You can also paste an image URL in admin without uploading.

## 3) Admin password

Set in `.env.local` / Vercel:

- `ADMIN_PASSWORD` — what you type at `/admin/login`
- `ADMIN_SESSION_SECRET` — long random string for the signed cookie

## 4) Vercel env

In Vercel → Project → Settings → Environment Variables, add:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- Blob store connected in Vercel Storage **or** Cloudinary vars:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

Deploy. Open https://bun-and-brownie.vercel.app/admin/login.

## 5) What admins can edit

- **Popular menu** products: name, description, price, image, order, visibility
- **Featured combo**: eyebrow, headline, title, price, note, image, WhatsApp prefill text

Without `DATABASE_URL`, the public site still renders using the fallback values in `src/lib/site.ts`.
