import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
      },
      {
        userAgent: ["Applebot", "Bingbot", "Googlebot", "GPTBot"],
        allow: ["/"],
      },
    ],
    sitemap: "https://omniplex.ai/sitemap.xml",
  };
}
