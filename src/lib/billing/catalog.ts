export type BillingCurrency = "USD" | "INR";
export type BillingCadence = "monthly" | "annual";

export type CatalogVariant = {
  id?: string;
  plan?: string;
  currency?: string;
  period?: BillingCadence | string;
  displayPrice?: string;
  amount?: number;
};

const VARIANT_ID =
  /^pro\.(USD|INR)\.(monthly|annual)$/;

export const geoHeadersFromRequest = (request: Request): HeadersInit => {
  const headers: Record<string, string> = {};
  for (const key of [
    "cf-ipcountry",
    "x-vercel-ip-country",
    "accept-language",
    "x-forwarded-for",
    "x-real-ip",
  ]) {
    const value = request.headers.get(key);
    if (value) headers[key] = value;
  }
  return headers;
};

export const currencyFromVariantId = (
  id: string,
): BillingCurrency | null => {
  const match = VARIANT_ID.exec(id);
  return match ? (match[1] as BillingCurrency) : null;
};

export const resolvePreferredCurrency = (
  request: Request,
): BillingCurrency | null => {
  const country = (
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    ""
  ).toUpperCase();
  if (country === "IN") return "INR";
  if (country && country !== "XX" && country !== "T1") return "USD";

  const lang = request.headers.get("accept-language")?.toLowerCase() ?? "";
  if (lang.includes("en-in") || lang.startsWith("hi")) return "INR";
  return null;
};

/** Stable Pro variant for a cadence — never flip between INR/USD on refresh. */
export const pickProVariant = (
  variants: CatalogVariant[] | undefined,
  cadence: BillingCadence,
  preferredCurrency?: BillingCurrency | null,
) => {
  const candidates = (variants ?? []).filter(
    (variant) =>
      variant.plan === "pro" &&
      variant.period === cadence &&
      typeof variant.id === "string" &&
      VARIANT_ID.test(variant.id),
  );
  if (candidates.length === 0) return null;

  if (preferredCurrency) {
    const preferred = candidates.find(
      (variant) =>
        variant.currency === preferredCurrency ||
        currencyFromVariantId(variant.id!) === preferredCurrency,
    );
    if (preferred) return preferred;
  }

  const currencies = new Set(
    candidates.map(
      (variant) =>
        variant.currency || currencyFromVariantId(variant.id!) || "",
    ),
  );
  if (currencies.size === 1) return candidates[0];

  // Stable preference when catalog returns both: INR then USD.
  return (
    candidates.find(
      (variant) =>
        variant.currency === "INR" ||
        currencyFromVariantId(variant.id!) === "INR",
    ) ?? candidates[0]
  );
};

export const proPricesFromCatalog = (
  variants: CatalogVariant[] | undefined,
  preferredCurrency?: BillingCurrency | null,
) => {
  const prices: Partial<Record<BillingCadence, string>> = {};
  let currency: BillingCurrency | null = null;

  for (const cadence of ["monthly", "annual"] as const) {
    const variant = pickProVariant(variants, cadence, preferredCurrency);
    if (!variant?.displayPrice || !variant.id) continue;
    prices[cadence] = variant.displayPrice;
    currency =
      (variant.currency as BillingCurrency | undefined) ||
      currencyFromVariantId(variant.id) ||
      currency;
  }

  return { prices, currency };
};
