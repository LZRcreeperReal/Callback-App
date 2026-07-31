# Callback

Async career feedback marketplace, MVP. People pay for a resume review or
mock interview critique; a free, automated "quick scan" (one per browser)
gives a taste for free and funnels into the paid tiers.

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Stripe Checkout.
No database yet — see "What's not built yet" below.

## What's included

- Landing page (`/`) — hero, how it works, pricing, FAQ
- Free demo (`/demo`) — paste resume text, get a handful of automated
  heuristic checks (word count, quantified bullets, generic phrasing, etc.),
  gated to one run per browser via a cookie, ends with a locked upsell
- Paid submit flow (`/submit`) → Stripe Checkout → `/success` or `/cancel`
- Stripe webhook endpoint (`/api/webhook`) stubbed to receive
  `checkout.session.completed` events

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in your Stripe keys — see below
npm run dev
```

Visit `http://localhost:3000`.

## Deploying to Vercel from GitHub

1. Push this project to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the repo. Vercel
   auto-detects Next.js — no config needed.
3. Before the first deploy (or right after, then redeploy), add the
   environment variables from the Stripe section below under
   **Project Settings → Environment Variables**.
4. Deploy. Your site will be live at `https://<project>.vercel.app`.

## Adding Stripe payments — step by step

The checkout flow is already wired up in the code
(`app/api/checkout/route.ts` creates a Stripe Checkout Session;
`app/submit` sends the customer there; `app/success` confirms it). You just
need your own Stripe account and keys.

### 1. Create a Stripe account
Sign up at [stripe.com](https://dashboard.stripe.com/register). You can
build and test everything before Stripe requires business details — that's
only needed to accept *live* (real) payments.

### 2. Get your test API keys
In the Stripe Dashboard, make sure you're in **Test mode** (toggle, top
right), then go to **Developers → API keys**. Copy the **Secret key**
(`sk_test_...`).

Add it to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
```

That's it for basic checkout — this project uses Stripe Checkout with
inline pricing, so you don't need to pre-create Products/Prices in the
Stripe dashboard. (If you'd rather manage prices in the Dashboard instead
of in `lib/services.ts`, that's a small refactor to swap `price_data` for a
`price` ID — happy to help with that if you want it later.)

### 3. Test a purchase locally
```bash
npm run dev
```
Go to `/submit`, fill the form, and you'll be redirected to a real Stripe
Checkout page. Use a [test card](https://docs.stripe.com/testing#cards):
- Card number: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits
- ZIP: any 5 digits

You should land on `/success` with a confirmation.

### 4. Set up the webhook (so you find out when someone pays)
The webhook is what tells your app "this order was actually paid for" —
separate from the customer's browser redirect, which can be closed or
interrupted.

**For local testing**, install the [Stripe CLI](https://docs.stripe.com/stripe-cli),
then run:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```
This prints a webhook signing secret (`whsec_...`) — add it to
`.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```
Leave that command running in a terminal while you test a purchase; you'll
see the event logged in both the Stripe CLI output and your `npm run dev`
terminal (look for `✅ Payment completed for session:`).

**For production (on Vercel):**
1. In the Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://<your-domain>/api/webhook`
3. Select the event `checkout.session.completed`.
4. Save, then copy the **Signing secret** shown for that endpoint.
5. In Vercel → Project Settings → Environment Variables, add:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
6. Redeploy so the new env var takes effect.

### 5. Go live
When you're ready to accept real payments:
1. In Stripe, finish account activation (business details, bank account) —
   the Dashboard walks you through this.
2. Toggle to **Live mode**, grab your live secret key
   (`sk_live_...`) from **Developers → API keys**.
3. Set up a *second* webhook endpoint in Live mode (same steps as above) —
   test and live webhooks are separate.
4. In Vercel, update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to the
   live values, and set `NEXT_PUBLIC_BASE_URL` to your real domain.
5. Redeploy.

## Setting up a real launch discount

The homepage announcement bar advertises a code (`LAUNCH10`) and checkout has
`allow_promotion_codes: true`, but no coupon exists until you create one:

1. Stripe Dashboard → **Product catalog → Coupons → New**.
2. Set the discount (e.g. $10 off or 20%), and a real expiration date if you
   want one that actually ends.
3. Create a **promotion code** for it (the human-readable code, e.g.
   `LAUNCH10`) — coupons and promotion codes are separate objects in Stripe;
   you need both.
4. Test it at `/submit` — there's a "have a code?" field on the Stripe
   Checkout page itself.

If you don't want a discount right now, delete `components/AnnouncementBar.tsx`
and remove `<AnnouncementBar />` from `app/page.tsx` — the checkout flow
works fine without it.

## Where to customize

- **Pricing & copy for each tier** → `lib/services.ts`
- **Landing page copy** → `app/page.tsx` (includes an FAQ array with claims
  like "every reviewer is vetted" — make sure those are actually true of
  your operation before real customers see them)
- **Colors / fonts** → `tailwind.config.js` and `app/layout.tsx`
- **Free scan logic** → `lib/demoScan.ts` (plain heuristic checks, no AI
  call, no external cost)

## What's not built yet

This is an MVP scaffold, not a finished business. Deliberately left out so
you can wire up whichever tools you prefer:

- **Resume file uploads** — the form currently asks for a Google
  Drive/Dropbox link instead of a file upload, to avoid requiring a
  storage service (like Vercel Blob or S3) just to get started.
- **A database** — paid orders currently only show up in your server logs
  (via the webhook) and in the Stripe Dashboard. Add Vercel Postgres,
  Supabase, or similar to track orders and reviewer assignments.
- **Email notifications** — the webhook has a clearly marked spot to add
  Resend, SendGrid, or Postmark to email the customer and/or an expert.
- **An expert/reviewer dashboard and auth** — right now there's no way for
  a reviewer to log in and see assigned requests; that's the next big
  piece once you have real reviewers.
- **A harder rate limit on the free scan** — the one-per-browser limit is a
  cookie, which is easy to clear. Fine for an MVP; if abuse becomes a real
  problem, pair it with a per-IP limit (e.g. Vercel KV/Upstash).
