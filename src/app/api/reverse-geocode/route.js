// Server Route Handler — reverse geocode coordinates to an address via OpenRouteService.
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

  const { lat, lng } = body || {};
  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json({ error: "Coordinates (lat, lng) are required." }, { status: 400 });
  }

  const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${encodeURIComponent(
    key
  )}&point.lon=${encodeURIComponent(lng)}&point.lat=${encodeURIComponent(lat)}&size=1&boundary.country=GB`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Reverse geocode request failed." }, { status: res.status });
    }
    const data = await res.json();
    const f = data?.features?.[0];
    const p = f?.properties || {};
    const [flng, flat] = f?.geometry?.coordinates || [lng, lat];
    return NextResponse.json({
      label: p.label || p.name || "",
      name: p.name || "",
      street: p.street || "",
      housenumber: p.housenumber || "",
      city: p.locality || p.localadmin || p.county || "",
      region: p.region || p.macroregion || "",
      postal: p.postalcode || "",
      lat: flat,
      lng: flng,
    });
  } catch (err) {
    return NextResponse.json({ error: "Reverse geocode error.", detail: String(err) }, { status: 500 });
  }
}
