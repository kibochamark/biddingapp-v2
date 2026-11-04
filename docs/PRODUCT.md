# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are deal-hunting consumers chasing name-brand electronics (phones, laptops, audio, tablets, gaming, wearables) at a steep discount to retail. They come for the product and the price, not for the novelty of the bidding mechanic itself. Secondary roles: sellers/listers who list products for auction, and platform admins who moderate accounts, categories, products, and bids from an internal dashboard (`app/admin/*`).

## Product Purpose

BidMarket ("Your Trusted Bidding Marketplace") lets users win real retail electronics for a fraction of their value by placing low bids, rather than buying at list price. Success for a user is winning a desired product well under its retail value; success for the platform is trustworthy, transparent auctions that keep winners (and losers) confident the system is fair.

## Positioning

The core mechanism is a **Lowest Unique Bid (LUB)** auction, not a traditional ascending-price auction: each bid costs a non-refundable entry fee, and the winner is whoever placed the *lowest bid amount that no one else also placed*, when the auction's end date is reached. This is the product's defining, non-obvious mechanic (confirmed by the user; also documented in-app at `/how-it-works` and reflected in `lib/types.ts`'s `entryFee` / `retailValue` / `auctions[].prizeValue` fields) — competitors doing simple highest-bid-wins auctions cannot truthfully claim the same "win for pennies on the dollar" promise. Bid notifications are real-time via Redis-backed Server-Sent Events (see recent commits: SSE bid notifications, Redis publisher).

## Operating Context

- Browse → catalog with filters (category, condition, price, sort by ending soon/newest/highest bid/lowest price) → product detail page → place a bid (costs entry fee) or Buy Now where available.
- Real-time updates: live bid counts/notifications over SSE as an auction progresses; auctions move through `ACTIVE → ENDED/WINNER_DETERMINED`.
- Account flows: sign in/up (Kinde auth), profile with addresses, KYC identity verification (NOT_SUBMITTED/PENDING/APPROVED/REJECTED), "My Bids", "My Listings".
- Payments: Stripe and PayPal integration for entry fees / checkout.
- Admin dashboard (`app/admin`): manage accounts, bids, categories, products, and moderation actions — an internal Operate tool, not a marketing surface.
- Legal/support surfaces: `/how-it-works`, `/shipping-returns`, `(legal)/privacy`, `/terms`, `/cookies`.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router) + React 19, Tailwind CSS v4 with CSS custom properties in OKLCH, shadcn/ui-style components on Radix primitives, Redux Toolkit + React Query, Formik/Yup forms, Framer Motion, Sonner toasts.
- Product conditions: `NEW, MINT, EXCELLENT, GOOD, FAIR, LIKE_NEW, POOR`. Product status: `DRAFT, ACTIVE, CLOSED, WINNER_SELECTED, COMPLETED, CANCELLED`. Bid status: `PENDING, CONFIRMED, FAILED, REFUNDED, WON, LOST`.
- This is a live product with a real backend (not the mock-data prototype described in the legacy `PROJECT_SUMMARY.md` — auctions, bids, SSE notifications, and payments are wired up for real).
- Redesign scope (confirmed by user): the Nike-inspired direction applies across the **entire app**, including the admin dashboard, not just the customer-facing storefront.

## Brand Commitments

- Name: **BidMarket**. Existing primary brand color is an orange accent (`--primary: oklch(0.65 0.19 45)`, used as `oklch(0.68 0.19 45)` in dark mode) — originally BackMarket-inspired. The user has explicitly asked to **keep the existing brand colors** while adopting a Nike-inspired editorial/minimal direction; orange stays the brand's single accent color, used the way Nike's system reserves its one "color" (sparingly, for primary actions/emphasis) rather than as decorative wash.
- Existing semantic colors to preserve: `destructive` (errors/sale-style urgency, e.g. "Flash Sale" ending-soon badges), and Sonner toast semantic colors for success/error/warning/info.
- Current look (pre-redesign) leans on glassmorphism (`glass-card`, `glass-navbar` blur/translucency) and soft shadows/rounded-xl cards — this is the incumbent look being replaced by the flatter, higher-contrast Nike direction, not a commitment to preserve.

## Evidence on Hand

- Legacy `PROJECT_SUMMARY.md` describes an earlier mock-data-only prototype (10 sample products, no real API). Current `app/` and `lib/api/*` show this has since been replaced by real API integration — treat `PROJECT_SUMMARY.md` as historical, not current fact.
- `/how-it-works` page contains the canonical, user-facing explanation of the Lowest Unique Bid mechanic and a worked example — good source for copy tone/accuracy when touching that page.
- No testimonials, press, case studies, or real customer evidence on hand; do not fabricate any.

## Product Principles

1. The price/discount promise ("win for a fraction of retail value") is the product's core value proposition and must stay legible and prominent through any visual redesign.
2. The Lowest Unique Bid mechanic is genuinely non-obvious — surfaces that introduce or explain bidding (home, product detail, how-it-works) must keep it clear, not just stylish.
3. Trust signals (KYC verification, buyer protection, real-time transparency via SSE bid updates) matter because users are paying non-refundable entry fees before knowing if they've won — don't let editorial minimalism crowd out these cues.
4. Admin (`app/admin`) is an internal Operate surface: apply the new visual language's tokens/components for consistency, but prioritize density, scanability, and native table/form patterns over campaign-style expression there.

## Accessibility & Inclusion

No product-specific accessibility requirement was established beyond standard web a11y practice (existing code uses semantic HTML and ARIA where present).
