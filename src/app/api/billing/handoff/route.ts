import { NextResponse } from "next/server";
import { z } from "zod";

import { assertSameOrigin, authBackend } from "@/lib/auth/backend";
import {
  billingBackend,
  billingSessionCookie,
} from "@/lib/billing/backend";

const input = z.object({
  idToken: z.string().min(20).max(16_384),
  /** Where to send the browser after the billing cookie is set. */
  returnTo: z.enum(["billing", "pricing"]).optional(),
  cadence: z.enum(["monthly", "annual"]).optional(),
});

/**
 * Creates a billing handoff, exchanges it server-side, and sets the
 * httpOnly billing cookie — code never appears in the browser URL.
 */
export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = input.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const create = await authBackend("/v1/billing/handoffs", {
    method: "POST",
    headers: { authorization: `Bearer ${parsed.data.idToken}` },
  });
  if (!create.ok) {
    return Response.json(
      { error: create.status === 401 ? "session_expired" : "handoff_failed" },
      { status: create.status === 401 ? 401 : 502 },
    );
  }

  const created = (await create.json().catch(() => null)) as {
    code?: string;
  } | null;
  if (!created?.code) {
    return Response.json({ error: "handoff_failed" }, { status: 502 });
  }

  const exchange = await billingBackend("/v1/billing/handoffs/exchange", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code: created.code }),
  });
  if (!exchange.ok) {
    return Response.json({ error: "handoff_expired" }, { status: 401 });
  }

  const session = (await exchange.json().catch(() => null)) as {
    token?: string;
    expiresAt?: number;
  } | null;
  if (!session?.token || typeof session.expiresAt !== "number") {
    return Response.json({ error: "handoff_failed" }, { status: 502 });
  }

  const cadence = parsed.data.cadence === "monthly" ? "monthly" : "annual";
  const redirectTo =
    parsed.data.returnTo === "billing"
      ? "/billing"
      : `/pricing?billing=ready&cadence=${cadence}`;

  const response = NextResponse.json(
    { ok: true, redirectTo },
    { headers: { "cache-control": "no-store" } },
  );
  response.cookies.set(billingSessionCookie, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(session.expiresAt),
  });
  return response;
}
