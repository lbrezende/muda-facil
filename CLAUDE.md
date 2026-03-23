# MudaFácil — Claude Code Context

This is a Next.js 14+ SaaS MVP for moving/relocation planning with interactive cargo visualization.

## Project Conventions

- **Framework:** Next.js App Router (NO src/ directory)
- **Language:** TypeScript strict mode
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **ORM:** Prisma 6 with PostgreSQL (Neon)
- **Auth:** Auth.js v5 (NextAuth) — Google OAuth + Email Magic Link
- **Payments:** Stripe subscriptions with trial support
- **Data fetching:** TanStack Query (client), Server Components (server)
- **Validation:** Zod schemas in `lib/validations.ts`
- **Email:** Resend

## Architecture Rules

1. **Route Groups:** `(public)` for unauthenticated pages, `(auth)` for protected pages
2. **API Routes:** Always validate auth with `auth()` from `lib/auth.ts`
3. **Subscription Logic:** All plan checks go through `lib/subscription.ts`
4. **Paywall:** Use `<PaywallGate>` component for feature gating
5. **3-Layer Auth Protection:** middleware → server component check → client component check

## Key Files

- `lib/auth.ts` — NextAuth config, JWT callbacks, user creation with trial
- `lib/subscription.ts` — Plan limits (mudancasAtivas, itensNoCanvas, cotacoesPorMudanca)
- `lib/stripe.ts` — Checkout sessions, customer portal
- `lib/validations.ts` — Zod schemas for all inputs
- `prisma/schema.prisma` — Database schema
- `middleware.ts` — Route protection

## Plan System

- **FREE:** 1 mudança ativa, 15 itens no canvas, 3 cotações por mudança, sem filtros avançados
- **TRIAL:** 14 days, unlimited access, starts on first signup
- **PRO:** Unlimited — R$ 29,90/mês
- **Upgrade during trial:** Users can upgrade immediately. Stripe checkout does NOT set `trial_period_days`, so payment is immediate.

## Product Entities

- **Item** — Catálogo de móveis/objetos com dimensões e peso
- **Caminhao** — Tipos de veículo (Fiorino, HR, 3/4, Baú) com capacidade
- **Transportadora** — Empresas de transporte com avaliações
- **Mudanca** — Mudança do usuário (origem, destino, itens, status)
- **Cotacao** — Cotação de uma transportadora para uma mudança
- **CargaLayout** — Layout do canvas com posição dos itens
- **CargaItem** — Item posicionado no canvas (x, y, rotação)

## Brand Colors

- Primary: #009B3A (verde primary)
- Background: #F8FAFC (cinza neutro claro)
- Dark: #1A1A1A (preto industrial)

## Storybook

- Run: `npm run storybook` (port 6006)
- Stories live alongside components: `components/**/*.stories.tsx`
- Preview imports `app/globals.css` for Tailwind styles

## Stripe SDK v20 Notes

- `current_period_end` was removed from Subscription object. Use `invoice.period_end` via `latest_invoice`.
- `invoice.subscription` moved to `invoice.parent.subscription_details.subscription`.
- API version: `2026-02-25.clover`.
- Stripe client uses lazy Proxy pattern in `lib/stripe.ts` to avoid build-time crashes when env vars are missing.

## Middleware Constraints

- Edge Function limit: < 1MB on Vercel free tier
- NEVER import `auth` from Auth.js in middleware (pulls Prisma+Resend+providers ~1.01MB)
- Middleware checks `authjs.session-token` cookie directly instead
