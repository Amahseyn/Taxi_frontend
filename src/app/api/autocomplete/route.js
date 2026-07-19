import { NextResponse } from "next/server";

const CACHE_TTL_MS = 60_000;
const cache = new Map();

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 10_000;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(request) {
  const orsKey = process.env.OPENROUTE_SERVICE_API_KEY;

  if (!orsKey) {
    return NextResponse.json({ error: "No geocoding service configured." }, { status: 500 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { query } = body || {};
  if (typeof query !== "string" || query.trim().length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  const normalized = query.trim().toLowerCase();
  const cached = cache.get(normalized);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json({ suggestions: cached.suggestions });
  }

  // OpenRouteService Autocomplete — single source of truth for address lookup.
  const url =
    `https://api.openrouteservice.org/geocode/autocomplete` +
    `?api_key=${encodeURIComponent(orsKey)}` +
    `&text=${encodeURIComponent(query)}` +
    `&size=6` +
    `&boundary.country=GB`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: "Autocomplete request failed.", detail: detail.slice(0, 300) },
        { status: res.status }
      );
    }
    const data = await res.json();
    const seen = new Set();
    const suggestions = (data?.features || [])
      .map((f) => {
        const [lng, lat] = f.geometry?.coordinates || [];
        if (typeof lng !== "number" || typeof lat !== "number") return null;
        const p = f.properties || {};
        return {
          id: p.id || p.gid || `${lat},${lng}`,
          label: p.label || p.name || "",
          name: p.name || "",
          street: p.street || "",
          housenumber: p.housenumber || "",
          city: p.locality || p.localadmin || p.county || "",
          region: p.region || p.macroregion || "",
          postal: p.postalcode || "",
          lat,
          lng,
        };
      })
      .filter((s) => s && s.label && !seen.has(s.label) && seen.add(s.label));

    cache.set(normalized, { expires: Date.now() + CACHE_TTL_MS, suggestions });
    return NextResponse.json({ suggestions });
  } catch (err) {
    return NextResponse.json({ error: "Autocomplete error.", detail: String(err) }, { status: 500 });
  }
}
