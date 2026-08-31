export const SUPPORT_EMAIL = "krunalc806@gmail.com";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://outreach-ai.vercel.app";
}

export const SITE = {
  name: "OutreachAI",
  tagline: "Autonomous AI Agent for Consumer Dispute Resolution",
  description:
    "OutreachAI investigates disputes, coordinates across logistics & payment rails, and autonomously secures verified resolutions for Indian consumers.",
  url: getSiteUrl(),
  email: SUPPORT_EMAIL,
  supportEmail: SUPPORT_EMAIL,
  logo: "/logo.svg",
};

export const NAV_LINKS = [
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Use Cases",
    href: "/use-cases",
  },
  {
    label: "3-Min Demo",
    href: "/demo",
  },
  {
    label: "Evidence",
    href: "/evidence",
  },
  {
    label: "Guides",
    href: "/blog",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const SOCIAL_LINKS = {
  github: "https://github.com/krunalc806-maker/outreach-ai",
  linkedin: "https://www.linkedin.com/in/krunal-chavda-54274138a",
};

export const PRICING = [
  {
    id: "free",
    name: "Consumer Free",
    price: "₹0",
    description: "Full dispute resolution & NDR tracking for individual consumers.",
    features: [
      "Autonomous problem investigation",
      "Delhivery Logistics AWB tracking & NDR overrides",
      "Pine Labs refund audit & authorization",
      "Statutory CPA (2019) legal notices",
      "Standard email & helpline support",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Bharat Pro",
    price: "₹49",
    description: "Priority Nodal desk filing with instant bank settlement rail.",
    features: [
      "All Consumer Free features",
      "Gnani Voice AI regional call dispatcher",
      "Instant Pine Labs bank settlement tokens",
      "Direct NCDRC & NCH statutory dockets",
      "Priority resolution within 4 hours",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Merchant Desk",
    price: "Custom",
    description: "For brands wanting automated NDR resolution and dispute settlement.",
    features: [
      "Automated NDR resolution suite",
      "Direct ERP & CRM integration",
      "Nodal grievance workflow automation",
      "Dedicated account manager",
      "SLA compliance dashboard",
    ],
    highlighted: false,
  },
];
