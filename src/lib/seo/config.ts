export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://outreach-ai.vercel.app";
}

export const SEO_DEFAULTS = {
  siteName: "OutreachAI",
  title: "OutreachAI — Autonomous AI Agent for Consumer Dispute Resolution",
  description:
    "Autonomous AI agent engineered for Indian consumer disputes, logistics NDR overrides, and verified payment resolutions across Delhivery, Pine Labs, and CPA (2019) rails.",
  keywords: [
    "AI consumer grievance automation",
    "consumer complaint automation",
    "consumer dispute resolution AI",
    "e-commerce refund dispute",
    "Delhivery NDR tracking and override",
    "Pine Labs refund dispute automation",
    "Consumer Protection Act 2019 complaint agent",
    "autonomous customer grievance agent",
    "India consumer protection AI",
    "AI agent for complaint resolution",
  ],
  locale: "en_IN",
};

export function constructMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  keywords,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
} = {}) {
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title ? `${title} | OutreachAI` : SEO_DEFAULTS.title;
  const metaDesc = description || SEO_DEFAULTS.description;
  const metaKeywords = keywords || SEO_DEFAULTS.keywords;

  return {
    title: fullTitle,
    description: metaDesc,
    keywords: metaKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      title: fullTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: SEO_DEFAULTS.siteName,
      locale: SEO_DEFAULTS.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDesc,
    },
  };
}

export function generateOrganizationSchema() {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OutreachAI",
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    description: SEO_DEFAULTS.description,
    founder: {
      "@type": "Person",
      name: "Krunal Chavda",
      sameAs: [
        "https://github.com/krunalc806-maker/outreach-ai",
        "https://www.linkedin.com/in/krunal-chavda-54274138a",
      ],
    },
    sameAs: [
      "https://github.com/krunalc806-maker/outreach-ai",
      "https://www.linkedin.com/in/krunal-chavda-54274138a",
    ],
  };
}

export function generateWebsiteSchema() {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OutreachAI",
    url: baseUrl,
    description: SEO_DEFAULTS.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/cases?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? item.url : `/${item.url}`}`,
    })),
  };
}

