# Drawsy AI Authentication Specification

> Source of truth aligned with production frontend `D:\DrawsyAI\drawsyai`.
> Auth is **Firebase client SDK + same-origin BFF → Drawsy backend**.

## 1. Authentication methods

- Email + password (Firebase)
- Google OAuth (Firebase popup)
- Twitter / X OAuth (Firebase popup)

## 2. Architecture

```text
Browser Firebase Auth (Google popup | X popup | email/password)
  → Firebase ID token
  → POST /api/auth/bootstrap  { idToken }
  → BFF → POST {DRAWSY_BACKEND_URL}/v1/auth/sessions/bootstrap
       Authorization: Bearer <idToken>
  → { customToken }
  → signInWithCustomToken()  → claims include drawsySessionId
  → (optional) POST /api/auth/handoff → opaque handoffCode
  → redirect Canvas with ?drawsy_auth_handoff=<code>
```

Identity lives in **Firebase client persistence**, not an HttpOnly login cookie.

## 3. Verification

- Email verification required for password provider before session bootstrap
- Signup always lands in verify UI first (`sendEmailVerification`)
- Phone OTP: deferred

## 4. Signup flow

```text
/signup
  ├── Email: email + password + confirm → createUserWithEmailAndPassword
  │         → sendEmailVerification → verify panel
  ├── Google / X → popup → ensureDrawsySession → canvas handoff
  └── After verified login success → canvas (+ drawsy_auth_handoff)
```

## 5. Login flow

```text
/login
  ├── Email + password → signInWithEmailAndPassword → bootstrap / verify
  ├── Google / X popups
  └── Forgot password → /forgot-password
```

## 6. Forgot / reset password

1. `/forgot-password` → Firebase `sendPasswordResetEmail`
2. Neutral success copy (no email enumeration)
3. User completes reset via **Firebase email action link** (not an in-app token form)
4. `/reset-password` explains that and links back to login

## 7. BFF endpoints (same-origin)

| Action            | Method | Path                         | Body              | Upstream                                      |
|-------------------|--------|------------------------------|-------------------|-----------------------------------------------|
| Bootstrap session | POST   | `/api/auth/bootstrap`        | `{ idToken }`     | `/v1/auth/sessions/bootstrap`                 |
| Create handoff    | POST   | `/api/auth/handoff`          | `{ idToken }`     | `/v1/auth/handoffs` → `{ handoffCode }`       |
| Exchange handoff  | POST   | `/api/auth/handoff/exchange` | `{ code }`        | `/v1/auth/handoffs/exchange`                  |
| Logout / revoke   | POST   | `/api/auth/logout`           | `{ idToken? }`    | `/v1/auth/sessions/current/revoke` (optional) |

All BFF routes require `Origin` to match the request origin.

## 8. Redirects

- Default after auth: Canvas (`https://drawsyai.com`, local `http://localhost:3001`)
- Safe `?returnTo=` if origin is Landing or Canvas
- Legacy `*.drawsyai.tech` rewritten to `drawsyai.com`
- Canvas destinations receive `drawsy_auth_handoff` when a handoff code exists

## 9. Password rules

- Minimum length **6** (Firebase)
- Signup requires confirm password match

## 10. Environment variables

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_DRAWSY_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
DRAWSY_BACKEND_URL=https://api.drawsyai.com
```

- `DRAWSY_BACKEND_URL` is **server-only**
- Never put Admin / OAuth client secrets in `NEXT_PUBLIC_*`

## 11. Account / billing

| Route | Purpose |
|-------|---------|
| `/profile` | Account session, usage, logout |
| `/billing` | Manage Pro subscription |
| `/pricing` | Plan cards + compare table + Razorpay Pro checkout |
| `/billing/start` | Redirect into checkout |
| `/billing/handoff` | Exchange billing code → set `drawsy_billing_session` |
| `/auth/session-bridge` | Canvas ↔ Landing iframe handoff |

BFF: `/api/account/usage`, `/api/billing/{catalog,handoff,subscription,verify}`.

## 12. Key frontend files

| Role              | Path                                      |
|-------------------|-------------------------------------------|
| Firebase init     | `src/lib/auth/firebase.ts`                |
| Sign-in helpers   | `src/lib/auth/google.ts`                  |
| Logout helper     | `src/lib/auth/logout.ts`                  |
| Account events    | `src/lib/auth/accountEvents.ts`           |
| BFF helper        | `src/lib/auth/backend.ts`                 |
| Canvas handoff    | `src/lib/auth/canvasHandoff.ts`           |
| Redirect helpers  | `src/lib/auth/redirect.ts`                |
| Login / signup UI | `src/components/auth/LoginView.tsx`, `SignupView.tsx` |
| Account UI        | `src/components/account/*`                |
| Auth BFF          | `src/app/api/auth/*/route.ts`             |
| Account / billing BFF | `src/app/api/account/*`, `src/app/api/billing/*` |
