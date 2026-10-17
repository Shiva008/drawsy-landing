"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { proPricesFromCatalog } from "@/lib/billing/catalog";
import {
  isProEntitlement,
  useBillingEntitlement,
  viewingMatchesCadence,
  type BillingEntitlementState,
} from "@/lib/billing/useBillingEntitlement";
import {
  compareRows,
  pricingPlans,
  pricingTrust,
  type BillingPeriod,
  type PricingPlan,
} from "@/lib/pricing";

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="pricing-check"
    >
      <path
        d="M2.5 7.2 5.4 10l6.1-6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BillingToggle({
  billing,
  onChange,
}: {
  billing: BillingPeriod;
  onChange: (next: BillingPeriod) => void;
}) {
  return (
    <div className="pricing-toggle-wrap">
      <div className="pricing-toggle" role="group" aria-label="Billing period">
        <button
          type="button"
          onClick={() => onChange("monthly")}
          className={`pricing-toggle-btn${billing === "monthly" ? " is-active" : ""}`}
          aria-pressed={billing === "monthly"}
        >
          Pay monthly
        </button>
        <button
          type="button"
          onClick={() => onChange("yearly")}
          className={`pricing-toggle-btn${billing === "yearly" ? " is-active" : ""}`}
          aria-pressed={billing === "yearly"}
        >
          Pay yearly
        </button>
      </div>
      <p className="pricing-save-hint">
        {billing === "yearly"
          ? "Nice — yearly keeps about 20% in your pocket."
          : "Switch to yearly anytime and keep about 20%."}
      </p>
    </div>
  );
}

function proCta(entitlement: BillingEntitlementState, billing: BillingPeriod) {
  if (entitlement.status === "loading") {
    return {
      label: "Checking plan…",
      href: `/billing/start?cadence=${billing === "yearly" ? "annual" : "monthly"}`,
      variant: "primary" as const,
      busy: true,
      current: false,
    };
  }
  if (isProEntitlement(entitlement)) {
    const sameCadence = viewingMatchesCadence(entitlement, billing);
    const cadenceLabel =
      entitlement.cadence === "annual"
        ? "yearly"
        : entitlement.cadence === "monthly"
          ? "monthly"
          : null;
    const viewingYearly = billing === "yearly";
    const onMonthly = entitlement.cadence === "monthly";
    const onYearly = entitlement.cadence === "annual";

    // Same cadence you're on — Current / finish setup (never a second checkout).
    if (sameCadence) {
      if (entitlement.pending && !entitlement.active) {
        return {
          label: "Finish setup · Billing",
          href: "/billing",
          variant: "outline" as const,
          busy: false,
          current: true,
        };
      }
      return {
        label: entitlement.cancelAtCycleEnd
          ? "Manage billing"
          : "Current plan · Manage",
        href: "/billing",
        variant: "outline" as const,
        busy: false,
        current: true,
      };
    }

    // Monthly → viewing yearly: offer switch (like Notion/Linear), not "Current".
    // Landing has no change-plan API yet — route to billing with intent.
    if (onMonthly && viewingYearly) {
      return {
        label: "Switch to yearly",
        href: "/billing?intent=switch-yearly",
        variant: "primary" as const,
        busy: false,
        current: false,
      };
    }

    // Yearly → viewing monthly: no self-serve downgrade on pricing.
    if (onYearly && !viewingYearly) {
      return {
        label: "On yearly · Manage",
        href: "/billing",
        variant: "outline" as const,
        busy: false,
        current: false,
      };
    }

    return {
      label: cadenceLabel ? `On ${cadenceLabel} · Manage` : "Manage billing",
      href: "/billing",
      variant: "outline" as const,
      busy: false,
      current: false,
    };
  }
  return {
    label: "Start Pro",
    href: `/billing/start?cadence=${billing === "yearly" ? "annual" : "monthly"}`,
    variant: "primary" as const,
    busy: false,
    current: false,
  };
}

function PlanCard({
  plan,
  billing,
  proPrices,
  catalogReady,
  entitlement,
}: {
  plan: PricingPlan;
  billing: BillingPeriod;
  proPrices: Partial<Record<"monthly" | "annual", string>>;
  catalogReady: boolean;
  entitlement: BillingEntitlementState;
}) {
  const catalogPeriod = billing === "yearly" ? "annual" : "monthly";
  const price =
    plan.id === "pro"
      ? proPrices[catalogPeriod] || (catalogReady ? "—" : "…")
      : billing === "yearly"
        ? plan.price.yearly
        : plan.price.monthly;
  const note =
    billing === "yearly" ? plan.price.noteYearly : plan.price.noteMonthly;
  const isCustom = price === "Custom" || price === "Coming soon";
  const pro = plan.id === "pro" ? proCta(entitlement, billing) : null;
  const ctaHref = pro?.href ?? plan.ctaHref;
  const ctaLabel = pro?.label ?? plan.cta;
  const ctaVariant = pro?.variant ?? plan.ctaVariant;
  const ctaBusy = Boolean(pro?.busy);
  const showCurrent = Boolean(pro?.current);
  const external =
    ctaHref.startsWith("http") || ctaHref.startsWith("mailto:");

  const proSubtitle = (() => {
    if (plan.id !== "pro" || !isProEntitlement(entitlement)) return plan.subtitle;
    const cadenceLabel =
      entitlement.cadence === "annual"
        ? "yearly"
        : entitlement.cadence === "monthly"
          ? "monthly"
          : null;
    const sameCadence = viewingMatchesCadence(entitlement, billing);
    if (entitlement.pending && !entitlement.active) {
      if (sameCadence) {
        return cadenceLabel
          ? `Pro ${cadenceLabel} checkout is pending.`
          : "Pro checkout is pending.";
      }
      if (entitlement.cadence === "monthly" && billing === "yearly") {
        return "Save more on yearly — switch from billing.";
      }
      return cadenceLabel
        ? `You already started Pro ${cadenceLabel}.`
        : "You already started a Pro checkout.";
    }
    if (entitlement.cancelAtCycleEnd) {
      return "Your Pro plan — cancellation scheduled.";
    }
    if (showCurrent) {
      return cadenceLabel ? `Your active ${cadenceLabel} plan.` : "Your active plan.";
    }
    if (entitlement.cadence === "monthly" && billing === "yearly") {
      return "Upgrade to yearly and keep about 20%.";
    }
    if (entitlement.cadence === "annual" && billing === "monthly") {
      return "You’re on yearly Pro — manage from billing.";
    }
    return cadenceLabel
      ? `You’re on Pro ${cadenceLabel}.`
      : "You already have Pro.";
  })();

  const card = (
    <article
      className={`pricing-card${plan.featured ? " is-featured" : ""}${
        showCurrent ? " is-current" : ""
      }`}
    >
      <header className="pricing-card-top">
        <h3 className="pricing-card-name">{plan.name}</h3>
        <p className="pricing-card-subtitle">{proSubtitle}</p>
      </header>

      <div className="pricing-card-price-block">
        <div className="pricing-card-price-row">
          <span className="pricing-card-price">{price}</span>
          {!isCustom && plan.price.suffix ? (
            <span className="pricing-card-suffix">{plan.price.suffix}</span>
          ) : null}
        </div>
        {note ? <p className="pricing-card-note">{note}</p> : null}
      </div>

      <a
        href={ctaHref}
        aria-disabled={ctaBusy || undefined}
        className={
          ctaVariant === "primary"
            ? "pricing-card-cta is-primary"
            : "pricing-card-cta is-outline"
        }
        onClick={ctaBusy ? (event) => event.preventDefault() : undefined}
        {...(external && !ctaBusy
          ? {
              target: ctaHref.startsWith("http") ? "_blank" : undefined,
              rel: "noopener noreferrer",
            }
          : {})}
      >
        {ctaLabel}
      </a>

      <ul className="pricing-card-features">
        {plan.features.map((feature) => {
          const key = typeof feature === "string" ? feature : feature.label;
          return (
            <li key={key}>
              <CheckIcon />
              <span>
                {typeof feature === "string" ? (
                  feature
                ) : (
                  <>
                    <span className="pricing-feature-prev">
                      {feature.previous}
                    </span>
                    {feature.label}
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {plan.footer ? (
        <p className="pricing-card-footer">{plan.footer}</p>
      ) : null}
    </article>
  );

  if (!plan.featured) return card;

  /* Same rotating brand border as auth-card */
  return <div className="pricing-card-frame">{card}</div>;
}

function PricingViewInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<BillingPeriod>(() =>
    searchParams.get("cadence") === "monthly" ? "monthly" : "yearly",
  );
  const [proPrices, setProPrices] = useState<
    Partial<Record<"monthly" | "annual", string>>
  >({});
  const [catalogReady, setCatalogReady] = useState(false);
  const entitlement = useBillingEntitlement();
  const proAction = proCta(entitlement, billing);

  useEffect(() => {
    let active = true;
    void fetch("/api/billing/catalog", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          if (active) setCatalogReady(true);
          return;
        }
        const payload = (await response.json()) as {
          variants?: Array<{
            id?: string;
            plan?: string;
            currency?: string;
            period?: "monthly" | "annual";
            displayPrice?: string;
          }>;
        };
        if (!active) return;
        const { prices } = proPricesFromCatalog(payload.variants);
        setProPrices(prices);
        setCatalogReady(true);
      })
      .catch(() => {
        if (active) setCatalogReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const setBillingPeriod = (next: BillingPeriod) => {
    setBilling(next);
    if (searchParams.get("billing") !== "ready") return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("cadence", next === "monthly" ? "monthly" : "annual");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <section className="pricing-hero" data-reveal="soft">
        <p className="pricing-eyebrow">Simple pricing</p>
        <h1 className="pricing-title">Plans for every way you work</h1>
        <p className="pricing-lead">
          Start free and upgrade when you need more. Cancel anytime.
        </p>
        <BillingToggle billing={billing} onChange={setBillingPeriod} />
      </section>

      <section
        className="pricing-grid"
        aria-label="Plans"
        data-reveal
        data-reveal-stagger
      >
        {pricingPlans.map((plan) => (
          <div key={plan.id} data-reveal-child className="pricing-grid-cell">
            <PlanCard
              plan={plan}
              billing={billing}
              proPrices={proPrices}
              catalogReady={catalogReady}
              entitlement={entitlement}
            />
          </div>
        ))}
      </section>

      <section
        className="pricing-trust"
        aria-label="Why Drawsy"
        data-reveal
        data-reveal-stagger
      >
        {pricingTrust.map((item) => (
          <div key={item.title} className="pricing-trust-item" data-reveal-child>
            <p className="pricing-trust-title">{item.title}</p>
            <p className="pricing-trust-desc">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="pricing-compare" id="compare" data-reveal>
        <div className="pricing-compare-head">
          <h2 className="pricing-compare-title">Compare plans</h2>
          <p className="pricing-lead">
            What changes as you move from Free to Enterprise.
          </p>
        </div>

        <div className="pricing-table-wrap">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Feature</th>
                {pricingPlans.map((plan) => (
                  <th
                    key={plan.id}
                    className={plan.featured ? "is-featured" : undefined}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td>{row.free}</td>
                  <td>{row.pro}</td>
                  <td>{row.team}</td>
                  <td>{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pricing-compare-cta">
          <Link href={siteConfig.appUrl} className="pricing-card-cta is-outline">
            Start building free
          </Link>
          <Link
            href={proAction.href}
            className={
              proAction.variant === "primary"
                ? "pricing-card-cta is-primary"
                : "pricing-card-cta is-outline"
            }
            aria-disabled={proAction.busy || undefined}
            onClick={
              proAction.busy ? (event) => event.preventDefault() : undefined
            }
          >
            {proAction.label}
          </Link>
        </div>
      </section>
    </>
  );
}

export function PricingView() {
  return (
    <Suspense fallback={<p className="pricing-lead">Loading plans…</p>}>
      <PricingViewInner />
    </Suspense>
  );
}
