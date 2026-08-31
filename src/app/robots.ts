import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/features",
          "/use-cases",
          "/demo",
          "/evidence",
          "/contact",
          "/blog",
          "/blog/*",
          "/privacy",
          "/terms",
          "/login",
          "/register",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/cases",
          "/cases/*",
          "/crm",
          "/crm/*",
          "/leads",
          "/leads/*",
          "/sequence",
          "/sequence/*",
          "/templates",
          "/templates/*",
          "/profile",
          "/profile/*",
          "/onboarding",
          "/api/*",
          "/auth/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

