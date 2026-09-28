# Tony Does Design — Web

**tonydoesdesign.com** — brand identity portfolio + digital product shop.

Built with Next.js 14 (App Router), TypeScript, and custom CSS. Deployed on Vercel.

---

## Stack

- **Framework** Next.js 14 (App Router)
- **Language** TypeScript
- **Styles** Custom CSS (globals.css) — no Tailwind
- **Fonts** Google Fonts via `next/font` (Syne, DM Sans, DM Serif Display)
- **Payments** Stripe Payment Links
- **File hosting** Supabase Storage (PDFs)
- **Deployment** Vercel

---

## Getting started

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/tonydoesdesign-web
cd tonydoesdesign-web
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values in .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_STRIPE_WORKBOOK_URL` | Stripe payment link for the workbook |
| `NEXT_PUBLIC_WORKBOOK_PDF_URL` | Supabase Storage public URL for the PDF |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |

Copy `.env.example` → `.env.local` and fill in values. **Never commit `.env.local`.**

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, about, services, process, contact |
| `/shop` | Digital products — workbooks, templates, resources |
| `/download` | Post-purchase download confirmation (Stripe redirect target) |

---

## Stripe → download redirect setup

1. Go to **Stripe Dashboard → Payment Links**
2. Find the workbook link → **⋯ → Edit**
3. Scroll to **"After payment"** → select **"Redirect to website"**
4. Enter: `https://tonydoesdesign.com/download`
5. Save

---

## Hosting the PDF (Supabase Storage)

1. Supabase Dashboard → **Storage** → create bucket `products` (set to **Public**)
2. Upload `where-is-the-gap-workbook.pdf`
3. Click the file → **Copy URL**
4. Add URL to `.env.local` as `NEXT_PUBLIC_WORKBOOK_PDF_URL`
5. Add the same value in **Vercel → Settings → Environment Variables**

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect the GitHub repo in the Vercel dashboard for automatic deploys on push to `main`.

---

## Adding new products

1. Add a new card to `app/shop/page.tsx`
2. Create a new env variable for the Stripe URL
3. Add a new Stripe payment link → set its redirect to `/download?product=NEW_PRODUCT`
4. Update `app/download/page.tsx` to handle the query param and show the right PDF

---

## Brand tokens

All design tokens live in `lib/tokens.ts` and `app/globals.css (:root)`.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0C0C0B` | Primary text, dark fills |
| `--blaze` | `#FF4500` | Accent, CTAs |
| `--bone` | `#F4F1EA` | Backgrounds, light text |
| `--stone` | `#7A7A72` | Secondary text |
