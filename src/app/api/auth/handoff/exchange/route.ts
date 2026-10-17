import { z } from "zod";

import { assertSameOrigin, authBackend } from "@/lib/auth/backend";

const input = z.object({ code: z.string().trim().min(20).max(512) });

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }

  const parsed = input.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const response = await authBackend("/v1/auth/handoffs/exchange", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
  });
  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
