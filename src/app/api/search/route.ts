// app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const apiKey = process.env.WEATHER_API_KEY;
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
