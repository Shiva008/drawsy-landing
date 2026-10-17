import { cookies } from "next/headers";

import {
  assertSameOrigin,
  assertSameOriginIfPresent,
  billingBackend,
  billingSessionCookie,
} from "@/lib/billing/backend";
import {
  geoHeadersFromRequest,
  pickProVariant,
  resolvePreferredCurrency,
  type BillingCadence,
} from "@/lib/billing/catalog";

const session = async () =>
  (await cookies()).get(billingSessionCookie)?.value;

const proxyResponse = (response: Response) =>
  new Response(response.body, {
    status: response.status,
    headers: { "content-type": "application/json" },
  });

export async function GET(request: Request) {
  if (!assertSameOriginIfPresent(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  const token = await session();
  if (!token) {
    return Response.json({ error: "billing_session_required" }, { status: 401 });
  }
  return proxyResponse(
    await billingBackend("/v1/billing/subscription", {
      headers: { authorization: `Billing ${token}` },
    }),
  );
}

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  const token = await session();
  if (!token) {
    return Response.json({ error: "billing_session_required" }, { status: 401 });
  }
  const input = (await request.json().catch(() => ({}))) as {
    cadence?: string;
  };
  const cadence: BillingCadence =
    input.cadence === "monthly" ? "monthly" : "annual";

  const catalogResponse = await billingBackend("/v1/billing/catalog", {
    headers: geoHeadersFromRequest(request),
  });
  if (!catalogResponse.ok) return proxyResponse(catalogResponse);

  const catalog = (await catalogResponse.json()) as {
    variants?: Array<{
      id?: string;
      plan?: string;
      period?: string;
      currency?: string;
      displayPrice?: string;
    }>;
  };

  const variant = pickProVariant(
    catalog.variants,
    cadence,
    resolvePreferredCurrency(request),
  );
  if (!variant?.id) {
    return Response.json(
      {
        error: {
          code: "billing_variant_unavailable",
          message: "The selected plan is unavailable.",
        },
      },
      { status: 400 },
    );
  }

  return proxyResponse(
    await billingBackend("/v1/billing/subscriptions", {
      method: "POST",
      headers: {
        authorization: `Billing ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ variantId: variant.id }),
    }),
  );
}

export async function DELETE(request: Request) {
  if (!assertSameOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  const token = await session();
  if (!token) {
    return Response.json({ error: "billing_session_required" }, { status: 401 });
  }
  return proxyResponse(
    await billingBackend("/v1/billing/subscription/cancel", {
      method: "POST",
      headers: { authorization: `Billing ${token}` },
    }),
  );
}
