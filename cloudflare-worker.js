// HeatSafe Myanmar — Geoapify Places proxy for Cloudflare Workers
// GEOAPIFY_API_KEY must be configured as a Worker Secret. Never put the key in app.js.
const ALLOWED_ORIGINS = ["*"]; // For production, replace * with your exact PWA origin.
function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes("*") ? "*" : (ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]);
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = cors(request.headers.get("Origin") || "*");
    const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), {
      status, headers: { ...headers, "Content-Type": "application/json; charset=utf-8", ...extra }
    });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);
    if (!env.GEOAPIFY_API_KEY) return json({ error: "Geoapify API key is not configured" }, 500);

    const lat = Number(url.searchParams.get("lat"));
    const lon = Number(url.searchParams.get("lon"));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return json({ error: "Valid lat and lon are required" }, 400);
    }

    // Query healthcare separately so parks/community/religious places cannot crowd hospitals and pharmacies out of the result limit.
    const base = { filter: `circle:${lon},${lat},10000`, bias: `proximity:${lon},${lat}`, limit: "100", lang: "en", apiKey: env.GEOAPIFY_API_KEY };
    const queryPlaces = async (categories) => {
      const params = new URLSearchParams({ ...base, categories });
      const upstream = await fetch(`https://api.geoapify.com/v2/places?${params.toString()}`, { headers: { Accept: "application/json" } });
      const body = await upstream.text();
      if (!upstream.ok) throw new Error(`Geoapify ${upstream.status}: ${body.slice(0, 300)}`);
      return JSON.parse(body).features || [];
    };

    try {
      const [healthFeatures, otherFeatures] = await Promise.all([
        queryPlaces("healthcare"),
        queryPlaces("activity.community_center,education.library,leisure.park,religion")
      ]);
      const features = [...healthFeatures, ...otherFeatures];
      const seen = new Set();
      const elements = features.map(feature => {
        const p = feature.properties || {};
        const coordinates = feature.geometry && feature.geometry.coordinates;
        if (!Array.isArray(coordinates) || !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) return null;
        const cats = Array.isArray(p.categories) ? p.categories : [];
        const tags = { name: p.name || p.address_line1 || "Unnamed place" };
        if (cats.some(c => c === "healthcare.hospital" || c.startsWith("healthcare.hospital."))) tags.amenity = "hospital";
        else if (cats.some(c => c === "healthcare.pharmacy" || c.startsWith("healthcare.pharmacy."))) tags.amenity = "pharmacy";
        else if (cats.some(c => c.startsWith("healthcare.clinic_or_praxis"))) tags.amenity = "clinic";
        else if (cats.some(c => c.startsWith("healthcare.dentist"))) tags.amenity = "doctors";
        else if (cats.some(c => c.startsWith("healthcare"))) tags.amenity = "clinic";
        else if (cats.includes("activity.community_center")) tags.amenity = "community_centre";
        else if (cats.includes("education.library")) tags.amenity = "library";
        else if (cats.some(c => c.startsWith("leisure.park"))) tags.leisure = "park";
        else if (cats.some(c => c.startsWith("religion"))) tags.amenity = "place_of_worship";
        const key = `${coordinates[1].toFixed(5)},${coordinates[0].toFixed(5)},${tags.amenity || tags.leisure || "other"}`;
        if (seen.has(key)) return null;
        seen.add(key);
        return { lat: coordinates[1], lon: coordinates[0], tags };
      }).filter(Boolean);
      return json({ elements }, 200, { "Cache-Control": "public, max-age=60" });
    } catch (error) {
      return json({ error: "Nearby data temporarily unavailable" }, 502);
    }
  }
};
