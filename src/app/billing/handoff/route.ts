import { NextResponse } from "next/server";

import { billingBackend, billingSessionCookie } from "@/lib/billing/backend";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const cadence =
    url.searchParams.get("cadence") === "monthly" ? "monthly" : "annual";
  const returnTo =
    url.searchParams.get("returnTo") === "/billing"
      ? "/billing"
      : `/pricing?billing=ready&cadence=${cadence}`;
  if (!code) {
    return NextResponse.redirect(new URL("/pricing?billing=invalid", url));
  }
  const exchange = await billingBackend("/v1/billing/handoffs/exchange", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!exchange.ok) {
    return NextResponse.redirect(new URL("/pricing?billing=expired", url));
  }
  const session = (await exchange.json()) as {
    token: string;
    expiresAt: number;
  };
  const response = NextResponse.redirect(new URL(returnTo, url));
  response.cookies.set(billingSessionCookie, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(session.expiresAt),
  });
  return response;
}
