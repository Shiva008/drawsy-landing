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

Fill in `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://your-api.example.com
NEXT_PUBLIC_GOOGLE_AUTH_URL=https://your-api.example.com/auth/google
NEXT_PUBLIC_TWITTER_AUTH_URL=https://your-api.example.com/auth/twitter
```

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
