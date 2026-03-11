# Cards Against Humanity Clone
### Frontend Internship Assignment — Weframetech Solutions

A pixel-perfect recreation of [cardsagainsthumanity.com](https://www.cardsagainsthumanity.com) built with a production-grade headless architecture.

---

## Live Links

| Service | URL |
|---|---|
| **Frontend** | `https://cah-frontend.vercel.app` |
| **Payload CMS Admin** | `https://cah-cms.vercel.app/admin` |
| **Medusa Backend** | `https://cah-medusa.onrender.com` |

---

## Architecture Overview

```
Browser
  │
  ▼
Next.js Frontend (Vercel)
  │  fetches content       │  fetches product/cart data
  ▼                        ▼
Payload CMS             Medusa.js Backend
(Vercel)                (Render)
  │                        │
  └──── Two-way Sync ───────┘
       via Webhooks
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| CMS | Payload CMS v2 |
| Commerce | Medusa.js v1 |
| Frontend Hosting | Vercel |
| CMS Hosting | Vercel |
| Backend Hosting | Render (Free Tier) |
| CMS Database | MongoDB Atlas (Free) |
| Backend Database | PostgreSQL (Render) |

---

## Pages Recreated

1. **Homepage** — `/` — Hero, shop grid, steal section, stuff carousel, FAQ accordion, email signup
2. **Product Page** — `/products/[slug]` — Product images, features, add to cart, related products

---

## Project Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free)
- PostgreSQL database (Render provides one free)

---

### 1. Frontend (Next.js)

```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your Payload and Medusa URLs
npm install
npm run dev
# → http://localhost:3000
```

**Environment Variables:**
```
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### 2. Payload CMS

```bash
cd payload-cms
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
# → http://localhost:3001/admin
```

**Environment Variables:**
```
PAYLOAD_SECRET=your-very-secret-key-here
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cah-cms
PAYLOAD_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
MEDUSA_URL=http://localhost:9000
MEDUSA_API_KEY=your-medusa-admin-api-key
```

**First time setup:**
1. Go to `http://localhost:3001/admin`
2. Create your admin user
3. Fill in the **Home Page** global with content
4. Fill in the **Footer** global
5. Create products in the **Products** collection

---

### 3. Medusa Backend

```bash
cd medusa-backend
cp .env.example .env
# Edit .env with your PostgreSQL URL
npm install
npm run build

# Run migrations
npx medusa migrations run

# Seed initial products and shipping options
npm run seed

# Start the server
npm run develop
# → http://localhost:9000
```

**Environment Variables:**
```
DATABASE_URL=postgres://user:password@host:5432/medusa-cah
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
BACKEND_URL=http://localhost:9000
STORE_CORS=http://localhost:3000
PAYLOAD_URL=http://localhost:3001
```

**Create admin user:**
```bash
npx medusa user --email admin@example.com --password yourpassword
```

---

## CMS Structure (Payload CMS)

### Collections

#### `products`
Stores all product data. Fields:
- `title` — Product name
- `slug` — URL identifier (e.g. `more-cah`)
- `images[]` — Array of product images (upload + alt text)
- `description` — Full product description
- `features[]` — Bullet point feature list
- `price` — Price in USD
- `medusaProductId` — Auto-populated after Medusa sync (read-only)
- `relatedProducts` — Relationship to other products

#### `media`
Handles all image uploads with auto-generated thumbnails.

### Globals

#### `home-page`
Controls every piece of content on the homepage:
- `hero` — Logo URL, tagline, quote, badge icons, description
- `shop` — Section heading and product cards array
- `steal` — Download section content
- `stuff` — "Stuff we've done" carousel items
- `email` — Email signup section
- `faqs[]` — FAQ accordion items

#### `footer`
Controls all footer content:
- Logo, shop links, info links, find-us links, social links, copyright

---

## Medusa Integration

### Commerce Features
- **Cart** — Created on first visit, persisted in `localStorage`
- **Add to Cart** — Adds a variant to the Medusa cart
- **Cart Drawer** — Slides in from the right, shows live cart state
- **Cart Page** — `/cart` — Full cart management with quantity controls
- **Login / Register** — `/login` — Medusa customer auth
- **Checkout** — `/checkout` — 4-step: Contact → Shipping → Payment → Confirm
- **Order Creation** — Calls Medusa `POST /store/carts/:id/complete`
- **Test Payment** — Uses Medusa's built-in `manual` payment provider (no real charge)

### Payment Flow
1. Customer fills in email and shipping address
2. Shipping options are fetched from Medusa
3. Payment session is created with `manual` provider
4. Cart is completed → order is created in Medusa

---

## CMS ↔ Medusa Two-Way Sync

### Payload → Medusa (on product save)

When a product is **created or updated** in Payload CMS, the `afterChange` hook in `src/collections/Products.ts` automatically calls the Medusa Admin API:

```
Payload afterChange hook
  → POST /admin/products (create) or POST /admin/products/:id (update)
  → Medusa stores the product
```

### Medusa → Payload (event subscriber)

When a product is **updated in Medusa** (e.g. from the Medusa admin dashboard), the event subscriber in `src/subscribers/payloadSync.ts` fires:

```
Medusa event: product.updated or product.created
  → Subscriber fetches full product from Medusa Admin API
  → POST /webhooks/medusa-sync on Payload
  → Payload finds product by medusaProductId and updates it
```

### Sync Architecture

```
┌─────────────┐   afterChange hook    ┌──────────────┐
│ Payload CMS │ ──────────────────► │  Medusa.js   │
│             │                       │              │
│             │ ◄────────────────── │              │
└─────────────┘  webhook subscriber  └──────────────┘
```

---

## Deployment

### Frontend → Vercel

```bash
# From repo root, connect to Vercel
cd frontend
npx vercel
```

Set these environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_PAYLOAD_URL`
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL`
- `NEXT_PUBLIC_SITE_URL`

### Payload CMS → Vercel

```bash
cd payload-cms
npx vercel
```

Set environment variables in Vercel:
- `PAYLOAD_SECRET`
- `MONGODB_URI` (use MongoDB Atlas)
- `PAYLOAD_URL`
- `FRONTEND_URL`
- `MEDUSA_URL`
- `MEDUSA_API_KEY`

### Medusa Backend → Render

1. Push `medusa-backend/` to a GitHub repo
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect the repo
4. Set **Build Command**: `npm install && npm run build && npx medusa migrations run`
5. Set **Start Command**: `npm run start`
6. Add a **PostgreSQL** database from Render dashboard (free tier)
7. Set all environment variables in Render dashboard

> **Note:** Render free tier sleeps after 15 minutes of inactivity. The first request after sleep may take ~30 seconds.

---

## Performance

Target: **95+ Lighthouse score**

Optimizations implemented:
- `next/image` for all images — automatic WebP conversion + lazy loading
- Server Components for all data-fetching (no client-side waterfalls)
- `priority` prop on above-fold images
- Proper `alt` text on all images
- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<footer>`, `<h1>`–`<h3>`)
- `<title>` and `<meta description>` on every page
- Open Graph tags for social sharing
- No render-blocking resources
- Revalidation set to 60s for CMS data (ISR)

Check your score: [pagespeed.web.dev](https://pagespeed.web.dev)

---

## Repository Structure

```
cah-project/
├── frontend/                   # Next.js App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── products/[slug]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── CartContext.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── AddToCartButton.tsx
│   │   │   ├── ProductCardFlip.tsx
│   │   │   ├── RelatedProducts.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   └── StuffCarousel.tsx
│   │   └── lib/
│   │       ├── payload.ts      # CMS API client + fallback data
│   │       └── medusa.ts       # Medusa API client + types
│   └── ...config files
│
├── payload-cms/                # Payload CMS
│   ├── src/
│   │   ├── collections/
│   │   │   ├── Products.ts     # Products + Medusa sync hook
│   │   │   └── Media.ts
│   │   ├── globals/
│   │   │   ├── HomePage.ts
│   │   │   └── Footer.ts
│   │   └── hooks/
│   │       └── medusaWebhook.ts # Receives sync from Medusa
│   ├── server.ts
│   └── payload.config.ts
│
└── medusa-backend/             # Medusa.js Commerce Engine
    ├── src/
    │   └── subscribers/
    │       └── payloadSync.ts  # Syncs changes back to Payload
    ├── data/
    │   └── seed.json           # Initial products + shipping
    └── medusa-config.ts
```

---

## Contact

Assignment submitted to: [https://forms.gle/q26MGbFjnna8oxNo8](https://forms.gle/q26MGbFjnna8oxNo8)

Company: [Weframetech Solutions Pvt Ltd](https://weframetech.com/)
