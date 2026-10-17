import { z } from "zod";

import { assertSameOrigin, authBackend } from "@/lib/auth/backend";

const input = z.object({ idToken: z.string().min(20).max(16_384) });

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  const parsed = input.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const response = await authBackend("/v1/auth/sessions/bootstrap", {
    method: "POST",
    headers: { authorization: `Bearer ${parsed.data.idToken}` },
  });
  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
