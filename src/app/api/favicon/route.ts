import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return new NextResponse(JSON.stringify({ error: "URL must be a string" }), {
      status: 400,
    });
  }

  try {
    const faviconUrl = new URL("/favicon.ico", url);
    const imageResponse = await fetch(faviconUrl.href);
    const buffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get("content-type") || "image/x-icon";

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch favicon" }),
      { status: 500 }
    );
  }
}
