import { NextRequest, NextResponse } from "next/server";

const BING_API_KEY = process.env.BING_API_KEY;
const BING_SEARCH_URL = "https://api.bing.microsoft.com/v7.0/search";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || typeof q !== "string") {
    return new NextResponse(
      JSON.stringify({
        message: 'Query parameter "q" is required and must be a string.',
      }),
      { status: 400 }
    );
  }

  if (!BING_API_KEY) {
    console.error(
      "Bing API key is undefined. Please check your .env.local file."
    );
    return new NextResponse(
      JSON.stringify({ message: "Bing API key is not configured." }),
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${BING_SEARCH_URL}?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        headers: new Headers({
          "Ocp-Apim-Subscription-Key": BING_API_KEY,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ message: "Success", data });
  } catch (error) {
    console.error("Bing API request error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
