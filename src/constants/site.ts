export const SUPPORT_EMAIL = "krunalc806@gmail.com";

export const SITE = {
  name: "OutreachAI",
  tagline: "Autonomous AI Agent for Consumer Resolution",
  description:
    "OutreachAI investigates disputes, coordinates across logistics & payment rails, and autonomously secures verified resolutions for Indian consumers.",
  url: "https://outreachai.ai",
  email: SUPPORT_EMAIL,
  supportEmail: SUPPORT_EMAIL,
  logo: "/logo.svg",
};

export const NAV_LINKS = [
  {
    label: "How It Works",
    href: "#how-it-works",
  },
  {
    label: "Rails & Infrastructure",
    href: "#features",
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
    label: "FAQ",
    href: "#faq",
  },
];

export const SOCIAL_LINKS = {
  github: "https://github.com/krunalc806-maker/outreach-ai",
  linkedin: "https://www.linkedin.com",
  twitter: "https://x.com",
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
