# Drawsy AI — Web (Auth Phase 01)

Frontend-only Next.js app for Drawsy AI authentication. Auth APIs are owned by the backend team.

## Features

- Email + password signup / login
- Google + Twitter OAuth (redirect to backend URLs)
- Forgot password / reset password
- Shared brand + SEO config
- Auth pages are `noindex, nofollow`

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Copy variable names from [`.env.example`](.env.example) into `.env.local` (local) or your host’s environment (production). **Do not commit `.env` files** — the repo only ships `.env.example`.

Marketing pages (`/`, `/companion`, `/pricing`, etc.) run without secrets; auth and billing API routes need `NEXT_PUBLIC_DRAWSY_FIREBASE_CONFIG` and `DRAWSY_BACKEND_URL`.

## Deploy (Vercel)

1. Import this repo in [Vercel](https://vercel.com/new).
2. Framework preset: **Next.js** (default).
3. Add the env vars from `.env.example` under **Project → Settings → Environment Variables** (you keep production values; collaborators use the same names).
4. Deploy. Teammates push to GitHub; Vercel rebuilds on each push to the connected branch.

## Routes

| Path | Description |
|------|-------------|
| `/` | Marketing placeholder |
| `/login` | Sign in |
| `/signup` | Create account |
| `/forgot-password` | Request reset link |
| `/reset-password?token=` | Set new password |

## Docs

See [docs/AUTH_SPEC.md](docs/AUTH_SPEC.md) for flows, API contract, and analytics event names.

Remap backend paths in `src/lib/auth/api.ts` if your API differs from the assumed `/auth/*` routes.
