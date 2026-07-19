// Server Route Handler — geocode a free-text address via OpenRouteService.
import { NextResponse } from "next/server";

export async function POST(request) {
  const key = process.env.OPENROUTE_SERVICE_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Routing service not configured." }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { query } = body || {};
  if (typeof query !== "string" || query.trim() === "") {
    return NextResponse.json({ error: "A query string is required." }, { status: 400 });
  }

  const url = `https://api.openrouteservice.org/geocode/search?api_key=${encodeURIComponent(key)}&text=${encodeURIComponent(query)}&size=1&boundary.country=GB`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Geocode request failed." }, { status: res.status });
    }
    const data = await res.json();
    const feature = data?.features?.[0];
    if (!feature) {
      return NextResponse.json({ error: "No matching location found." }, { status: 404 });
    }
    const [lng, lat] = feature.geometry.coordinates;
    const label = feature.properties?.label || query;
    return NextResponse.json({ lng, lat, label });
  } catch (err) {
    return NextResponse.json({ error: "Geocode error.", detail: String(err) }, { status: 500 });
  }
}
