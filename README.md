# Callback

Automated resume-check product. No human reviewers, no AI — plain rule-based
pattern matching that points at the exact sentence behind every finding.
People get 1 free check, can earn bonus free checks by sharing, and can buy
Basic / Advanced / Super checks that unlock more categories of findings.
Everything is tracked with cookies — no login, no database (see the
"Cookie-only architecture" section below for what that trades away).

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Stripe Checkout.

## What's included

- **Landing page** (`/`) — explains the tiers, pricing, FAQ (including an
  honest "Is this AI?" answer — it isn't, on purpose)
- **`/check`** — where people actually paste a resume and run a check.
  Shows a tier picker (only tiers you have credit for are runnable),
  results with real highlighted snippets from the pasted text, locked
  findings with a "Show" button that routes to `/buy`, a share-to-earn
  button, and the cookie-storage warning
- **`/buy`** — pick Basic / Advanced / Super, enter an email, pay via
  Stripe Checkout
- **`/success`** — verifies the Stripe session, then claims the purchased
  credit into a cookie via `/api/checks/claim`
- **The check engine** (`lib/checkEngine.ts`) — 12 checks across the 4
  tiers, each one returning the literal matched text (not just a category
  label), so the UI can quote the user's own resume back at them

## API routes

- `POST /api/checks/run` — spends 1 credit for the given tier, runs every
  check, and strips anything above that tier from the response server-side
  (not just hidden with CSS — a locked finding's `detail`/`snippets` never
  reach the browser at all)
- `POST /api/checks/share` — grants a bonus free check, capped at 3. This
  is honest about what it does: it does **not** verify that a share
  actually happened (nothing reliably can, short of OAuth-posting on
  someone's behalf, which is its own can of worms). Triggering the share
  sheet / copying the link is treated as the real action, and the reward
  is given for that — the UI says so plainly rather than pretending to
  check something it isn't checking.
- `POST /api/checks/claim` — re-verifies a Stripe session (`payment_status
  === 'paid'`) before granting the purchased tier's credit; guards against
  double-claiming the same session on refresh
- `GET /api/account` — current balance for all 4 tiers
- `POST /api/checkout` — creates the Stripe Checkout Session (price looked
  up server-side from `lib/tiers.ts`, never trusted from the client)
- `POST /api/webhook` — see the note in that file about why it can't grant
  credit itself (webhooks have no access to the customer's cookies) —
  right now it just logs paid sessions as an independent record

## Local setup

```bash
npm install
cp env.example .env.local   # then fill in your Stripe keys — see below
mv gitignore .gitignore
npm run dev
```

Visit `http://localhost:3000`. (The `gitignore` / `env.example` files in
this zip are named without a leading dot on purpose — dotfiles get
silently skipped by a lot of drag-and-drop upload tools. Rename `gitignore`
back to `.gitignore` once the project is somewhere with normal file access,
e.g. right after `git init`.)

## Deploying to Vercel from GitHub

1. `git init && git add . && git commit -m "Initial commit"`
2. Rename `gitignore` → `.gitignore` first (see above)
3. Push to a new GitHub repo, then import it at
   [vercel.com/new](https://vercel.com/new) — Vercel auto-detects Next.js
4. Add the environment variables from the Stripe section below under
   **Project Settings → Environment Variables**
5. Deploy

## Adding Stripe payments

1. Sign up at [stripe.com](https://dashboard.stripe.com/register), stay in
   **Test mode**
2. **Developers → API keys** → copy the **Secret key** (`sk_test_...`) into
   `STRIPE_SECRET_KEY` in `.env.local`
3. Run `npm run dev`, go to `/buy`, pay with a
   [test card](https://docs.stripe.com/testing#cards): `4242 4242 4242 4242`,
   any future expiry, any CVC/ZIP
4. For the webhook (optional but recommended — see what it's for above):
   install the [Stripe CLI](https://docs.stripe.com/stripe-cli), run
   `stripe listen --forward-to localhost:3000/api/webhook`, and put the
   printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`
5. In production, repeat the webhook setup in the Stripe Dashboard
   (**Developers → Webhooks → Add endpoint**, URL
   `https://<your-domain>/api/webhook`, event `checkout.session.completed`),
   and add both keys to Vercel's environment variables

### Setting up the real LAUNCH10 discount

The coupon shown above the pricing cards only works once you create it:
**Stripe Dashboard → Product catalog → Coupons → New**, then create a
matching **promotion code** (e.g. `LAUNCH10`) for it — coupons and
promotion codes are separate objects in Stripe, you need both. Checkout
already has `allow_promotion_codes: true` wired up to accept it.

## Cookie-only architecture — what it is and isn't good for

You asked whether Stripe alone (no backend) can handle tracking how many
paid checks someone has. Short answer: **Stripe can verify a payment
happened, but it can't remember a running balance for you** — that part
has to live somewhere, and here it lives in cookies. Worth understanding
exactly what that does and doesn't protect against:

**What this setup actually does:**
- Every credit grant goes through real verification first — `/api/checks/claim`
  calls Stripe to confirm a session was actually paid before writing any
  cookie, and `/api/checks/run` decrements a credit server-side before
  running the check (never trusts a client-supplied "I have credit" flag)
- Locked findings are stripped from the API response entirely, not just
  hidden in the UI, so viewing page source doesn't leak paid content

**What it doesn't protect against:**
- Cookies are edited via the browser's DevTools (Application → Cookies)
  just as easily as they're cleared. Nothing stops someone reasonably
  technical from setting `callback_credit_super` to `999` by hand. A
  warning about lost data (which is on `/check`) doesn't prevent this —
  it only covers the "I lost my own purchase" case, not "someone gave
  themselves free credit."
- No cross-device or cross-browser access — a purchase is only visible in
  the exact browser it was made in
- A webhook literally cannot fix this on its own: Stripe's webhook calls
  come from Stripe's servers, which have no access to set cookies in your
  customer's browser. The only place credit can be granted in a
  cookie-only system is a request that originates from the customer's own
  browser — which is why `/success` (not the webhook) is what claims the
  credit.

**If/when this matters** (real volume, or you'd rather not have a
determined user editing their own balance for free), the fix is a small
piece of server-side storage keyed by an anonymous ID cookie instead of
storing the *balance itself* in a cookie. You don't need a traditional
always-on server for this — options that work fine alongside Vercel's
serverless functions:
- **Upstash Redis** — REST-based, generous free tier, just two env vars
  and a couple of `fetch` calls
- **Vercel KV** — same idea, built into the Vercel dashboard
- **Vercel Postgres / Supabase** — better fit if you also want to log
  full order history, not just a number

Happy to wire one of these up in a follow-up — this file's already large,
so I left it as a clearly-flagged next step rather than guessing which one
you'd want.

## Where to customize

- **Tiers, pricing, features** → `lib/tiers.ts`
- **The checks themselves** (add/remove/reweight what's detected) →
  `lib/checkEngine.ts`
- **Landing page copy** → `app/page.tsx`
- **Colors / fonts** → `tailwind.config.js` and `app/layout.tsx`

## What's not built yet

- **Server-side credit storage** (see above) — cookies work but are
  editable/losable; upgrade path is documented above
- **Email receipts** — the webhook has a marked spot to add one
- **Admin visibility into what people are actually running checks against**
  — right now nothing is logged or stored past the response
