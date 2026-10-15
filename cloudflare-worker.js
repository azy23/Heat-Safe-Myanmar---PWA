// HeatSafe Myanmar — Cloudflare Worker proxy for OpenStreetMap Overpass
// Deploy as a Cloudflare Worker. This is a restricted proxy: it accepts only lat/lon
// and builds the Overpass query itself (it is not an open proxy).
const ALLOWED_ORIGINS = ['*']; // For production, replace * with your exact PWA origin, e.g. https://example.pages.dev
const OVERPASS_ENDPOINTS = [
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass-api.de/api/interpreter'
];
function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes('*') ? '*' : (ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]);
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const headers = cors(request.headers.get('Origin') || '*');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405, headers });
    const lat = Number(url.searchParams.get('lat'));
    const lon = Number(url.searchParams.get('lon'));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return Response.json({ error: 'Valid lat and lon are required' }, { status: 400, headers });
    }
    const q = `[out:json][timeout:20];(nwr(around:10000,${lat},${lon})["amenity"~"^(hospital|clinic|doctors|pharmacy|community_centre|library|place_of_worship|social_facility)$"];nwr(around:10000,${lat},${lon})["leisure"="park"];);out center tags;`;
    let lastStatus = 502;
    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'User-Agent': 'HeatSafeMyanmarPWA/1.0' },
          body: new URLSearchParams({ data: q }),
          signal: AbortSignal.timeout(24000)
        });
        if (!response.ok) { lastStatus = response.status; continue; }
        const body = await response.text();
        let parsed;
        try { parsed = JSON.parse(body); } catch { lastStatus = 502; continue; }
        if (!Array.isArray(parsed.elements)) { lastStatus = 502; continue; }
        return new Response(JSON.stringify(parsed), { status: 200, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=60' } });
      } catch { lastStatus = 502; }
    }
    return Response.json({ error: 'All Overpass endpoints failed', status: lastStatus }, { status: 502, headers });
  }
};
