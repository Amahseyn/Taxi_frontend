import { NextResponse } from "next/server";

export async function POST(request) {
  const orsKey = process.env.OPENROUTE_SERVICE_API_KEY;

  if (!orsKey) {
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

  // OpenRouteService Geocoding — single source of truth for address lookup.
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${encodeURIComponent(orsKey)}&text=${encodeURIComponent(query)}&size=1&boundary.country=GB`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: "Geocode request failed.", detail: detail.slice(0, 300) },
        { status: res.status }
      );
    }
    const data = await res.json();
    const feature = data?.features?.[0];
    if (!feature) {
      return NextResponse.json({ error: "No matching location found." }, { status: 404 });
    }
    const [lng, lat] = feature.geometry.coordinates;
    const p = feature.properties || {};
    const label = p.label || query;
    const postal = p.postalcode || "";
    return NextResponse.json({
      lng,
      lat,
      label,
      postal,
      street: p.street || "",
      housenumber: p.housenumber || "",
      city: p.locality || p.localadmin || p.county || "",
      region: p.region || p.macroregion || "",
    });
  } catch (err) {
    return NextResponse.json({ error: "Geocode error.", detail: String(err) }, { status: 500 });
  }
}
