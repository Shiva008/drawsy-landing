import { billingBackend } from "@/lib/billing/backend";
import { geoHeadersFromRequest } from "@/lib/billing/catalog";

export async function GET(request: Request) {
  const response = await billingBackend("/v1/billing/catalog", {
    headers: geoHeadersFromRequest(request),
  });
  if (!response.ok) {
    return Response.json(
      {
        error:
          response.status === 503
            ? "backend_unavailable"
            : "catalog_unavailable",
      },
      { status: response.status === 503 ? 503 : 502 },
    );
  }
  return new Response(response.body, {
    status: response.status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
