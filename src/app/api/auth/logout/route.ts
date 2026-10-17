import { NextResponse } from "next/server";
import { z } from "zod";

import { assertSameOrigin, authBackend } from "@/lib/auth/backend";
import { billingSessionCookie } from "@/lib/billing/backend";

const input = z.object({ idToken: z.string().min(20).max(16_384).optional() });

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  const parsed = input.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const response = parsed.data.idToken
    ? await authBackend("/v1/auth/sessions/current/revoke", {
        method: "POST",
        headers: { authorization: `Bearer ${parsed.data.idToken}` },
      })
    : new Response(null, { status: 204 });

  const nextResponse = new NextResponse(response.body, {
    status: response.status,
    headers: { "cache-control": "no-store" },
  });
  nextResponse.cookies.set(billingSessionCookie, "", {
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
  return nextResponse;
}
