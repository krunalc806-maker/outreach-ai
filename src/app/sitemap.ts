import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString();

  const routes = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/features", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/use-cases", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/demo", priority: 0.85, changeFrequency: "weekly" as const },
    { url: "/evidence", priority: 0.85, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/blog/how-ai-automates-consumer-complaint-follow-ups", priority: 0.75, changeFrequency: "monthly" as const },
    { url: "/blog/ecommerce-ndr-refund-dispute-guide", priority: 0.75, changeFrequency: "monthly" as const },
    { url: "/blog/consumer-protection-act-2019-grievance-workflows", priority: 0.75, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

