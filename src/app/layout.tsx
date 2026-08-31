import type { Metadata, Viewport } from "next";
import "./globals.css";
import { constructMetadata, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo/config";

export const viewport: Viewport = {
  themeColor: "#08090d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();
  const webSchema = generateWebsiteSchema();

  return (
    <html lang="en" className="h-full antialiased bg-[#08090d] text-zinc-100">
      <head>
        <meta name="google-site-verification" content="PSzHgsTOpFGz9UGZd2wB9P6LWCLkiWu-Z_vHjYwuV3Q" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col selection:bg-[#8b5cf6]/30 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
