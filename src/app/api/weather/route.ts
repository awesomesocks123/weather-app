import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city || typeof city !== "string") {
    return new Response(JSON.stringify({ error: "Invalid city" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);
    const rawText = await response.text();
    console.log('Weather API status:', response.status);
    console.log('Weather API raw response:', rawText);
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (jsonErr) {
      console.error('Failed to parse weather API response as JSON:', jsonErr);
      return new Response(JSON.stringify({ error: 'Invalid response from weather provider', raw: rawText }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch weather data" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
