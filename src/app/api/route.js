// Server Route Handler — keeps the OpenRouteService key secret.
// Called by the client with a destination; returns driving distance + duration.
import { NextResponse } from "next/server";

// Colchester is the fixed origin for all quotes.
const ORIGIN = { lng: 0.892, lat: 51.896 };

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

  const { lng, lat } = body || {};
  if (typeof lng !== "number" || typeof lat !== "number") {
    return NextResponse.json({ error: "A destination (lng, lat) is required." }, { status: 400 });
  }

  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [ORIGIN.lng, ORIGIN.lat],
          [lng, lat],
        ],
        units: "km",
      }),
      // Always fetch fresh routes; never cache.
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: "Routing request failed.", detail: detail.slice(0, 300) },
        { status: res.status }
      );
    }

    const data = await res.json();
    const summary = data?.routes?.[0]?.summary;
    if (!summary) {
      return NextResponse.json({ error: "No route found." }, { status: 404 });
    }

    return NextResponse.json({
      distanceKm: Math.round(summary.distance * 10) / 10,
      durationMin: Math.round(summary.duration / 60),
    });
  } catch (err) {
    return NextResponse.json({ error: "Routing error.", detail: String(err) }, { status: 500 });
  }
}
