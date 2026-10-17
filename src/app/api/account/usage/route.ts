import { assertSameOrigin, billingBackend } from "@/lib/billing/backend";

const proxyResponse = (response: Response) =>
  new Response(response.body, {
    status: response.status,
    headers: {
      "cache-control": "private, no-store",
      "content-type": "application/json",
    },
  });

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    idToken?: unknown;
  };
  if (typeof body.idToken !== "string" || body.idToken.length < 20) {
    return Response.json({ error: "authentication_required" }, { status: 401 });
  }
  return proxyResponse(
    await billingBackend("/v1/usage", {
      headers: { authorization: `Bearer ${body.idToken}` },
    }),
  );
}
