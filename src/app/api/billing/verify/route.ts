import { cookies } from "next/headers";

import {
  assertSameOrigin,
  billingBackend,
  billingSessionCookie,
} from "@/lib/billing/backend";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  const token = (await cookies()).get(billingSessionCookie)?.value;
  if (!token) {
    return Response.json({ error: "billing_session_required" }, { status: 401 });
  }
  const response = await billingBackend("/v1/billing/checkout/verify", {
    method: "POST",
    headers: {
      authorization: `Billing ${token}`,
      "content-type": "application/json",
    },
    body: await request.text(),
  });
  return new Response(response.body, {
    status: response.status,
    headers: { "content-type": "application/json" },
  });
}
