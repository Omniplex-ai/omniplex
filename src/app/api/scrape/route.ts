import type { NextRequest } from "next/server";

export const runtime = "edge";

async function scrapeText(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const text = extractBodyText(html);
    return text;
  } catch (error) {
    console.error(`Error fetching URL ${url}:`, error);
    return "";
  }
}

function extractBodyText(html: string): string {
  const bodyStartTag = "<body";
  const bodyEndTag = "</body>";
  const bodyStartIndex = html.indexOf(bodyStartTag);
  const bodyEndIndex = html.indexOf(bodyEndTag, bodyStartIndex);
  if (bodyStartIndex !== -1 && bodyEndIndex !== -1) {
    const bodyContent = html.slice(
      bodyStartIndex,
      bodyEndIndex + bodyEndTag.length
    );
    const bodyText = bodyContent
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return bodyText.slice(0, 5000);
  }
  return "";
}

const cache = new Map<string, string>();

export async function POST(req: NextRequest) {
  const urlParams = new URL(req.url).searchParams;
  const urls = urlParams.get("urls")?.split(",") ?? [];
  if (urls.length === 0) {
    return new Response(
      JSON.stringify({ error: "Please provide URLs to scrape" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const scrapingPromises = urls.map(async (url) => {
      if (cache.has(url)) {
        return cache.get(url);
      }
      const text = await scrapeText(url);
      cache.set(url, text);
      return text;
    });
    const results = await Promise.all(scrapingPromises);
    const formattedResponse = results
      .map((result, index) => `${urls[index]}\nWebsite data: ${result}`)
      .join("\n\n");
    return new Response(formattedResponse, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return new Response(
      JSON.stringify({ error: `Failed to scrape the pages: ${error}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
