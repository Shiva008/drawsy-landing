import { siteConfig } from "@/config/site";

export type BillingPeriod = "monthly" | "yearly";

export type PricingPlan = {
  id: "free" | "pro" | "team" | "enterprise";
  name: string;
  subtitle: string;
  featured?: boolean;
  badge?: string;
  cta: string;
  ctaHref: string;
  ctaVariant: "primary" | "outline";
  footer?: string;
  features: Array<string | { previous: string; label: string }>;
  price: {
    monthly: string;
    yearly: string;
    suffix?: string;
    noteMonthly?: string;
    noteYearly?: string;
  };
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    subtitle: "Explore Drawsy",
    cta: "Start building free",
    ctaHref: siteConfig.appUrl,
    ctaVariant: "outline",
    footer: "No credit card required",
    features: [
      "Unlimited local canvas boards",
      "Local presentations and Kanban",
      "Sign in without moving local work",
      "Public sharing & export",
    ],
    price: {
      monthly: "$0",
      yearly: "$0",
      suffix: "forever",
    },
  },
  {
    id: "pro",
    name: "Pro",
    subtitle: "For individuals building more.",
    featured: true,
    cta: "Start Pro",
    ctaHref: "/billing/start?cadence=annual",
    ctaVariant: "primary",
    features: [
      "Everything in Free",
      { previous: "5 GB", label: "10 GB cloud media storage" },
      "Cloud sync for every canvas",
      "Presentation sync",
      "Kanban sync",
      "Invite people to Kanban boards",
      "Cloud comments",
    ],
    price: {
      // Display comes from /api/billing/catalog — never hardcode $ vs ₹ here.
      monthly: "",
      yearly: "",
      noteMonthly: "billed monthly",
      noteYearly: "billed yearly",
    },
  },
  {
    id: "team",
    name: "Team",
    subtitle: "For collaborative teams.",
    cta: "Contact us",
    ctaHref: `mailto:${siteConfig.email}`,
    ctaVariant: "outline",
    features: ["Everything in Pro", "Planned for a later release"],
    price: {
      monthly: "Coming soon",
      yearly: "Coming soon",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For organizations that need more control.",
    cta: "Contact sales",
    ctaHref: `mailto:${siteConfig.email}`,
    ctaVariant: "outline",
    features: [
      "Everything in Team",
      "SAML SSO / SCIM",
      "Advanced security & compliance",
      "Audit logs",
      "Data residency options",
      "Custom connectors",
      "Dedicated support",
      "Custom contracts",
    ],
    price: {
      monthly: "Custom",
      yearly: "Custom",
      noteMonthly: "Let's build the right plan for your team.",
      noteYearly: "Let's build the right plan for your team.",
    },
  },
];

export const pricingTrust = [
  {
    title: "No credit card required",
    description: "Start free and upgrade anytime.",
  },
  {
    title: "Cancel anytime",
    description: "No long-term commitment.",
  },
  {
    title: "Secure by design",
    description: "Your data stays yours.",
  },
  {
    title: "Built for teams",
    description: "Collaborate in real time.",
  },
] as const;

export const compareRows = [
  {
    feature: "Media storage",
    free: "This device",
    pro: "10 GB cloud",
    team: "Planned",
    enterprise: "Custom",
  },
  {
    feature: "Presentation sync",
    free: "—",
    pro: "✓",
    team: "Planned",
    enterprise: "Custom",
  },
  {
    feature: "Kanban sync",
    free: "—",
    pro: "✓",
    team: "Planned",
    enterprise: "Custom",
  },
  {
    feature: "Kanban invitations",
    free: "Local import",
    pro: "Live boards",
    team: "Planned",
    enterprise: "Custom",
  },
  {
    feature: "Cloud comments",
    free: "—",
    pro: "✓",
    team: "Planned",
    enterprise: "Custom",
  },
] as const;
