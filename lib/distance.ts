/**
 * Distance calculation using free Nominatim geocoding + Haversine formula.
 * No API key needed. Falls back to city-level estimation if geocoding fails.
 *
 * Nominatim usage policy: max 1 request per second, with User-Agent.
 */

interface Coordinates {
  lat: number;
  lon: number;
}

// ─── Common Brazilian city coordinates (fallback) ─────────

const CITY_COORDS: Record<string, Coordinates> = {
  "sao paulo": { lat: -23.5505, lon: -46.6333 },
  "sp": { lat: -23.5505, lon: -46.6333 },
  "rio de janeiro": { lat: -22.9068, lon: -43.1729 },
  "rj": { lat: -22.9068, lon: -43.1729 },
  "curitiba": { lat: -25.4284, lon: -49.2733 },
  "pr": { lat: -25.4284, lon: -49.2733 },
  "belo horizonte": { lat: -19.9191, lon: -43.9386 },
  "mg": { lat: -19.9191, lon: -43.9386 },
  "brasilia": { lat: -15.7975, lon: -47.8919 },
  "df": { lat: -15.7975, lon: -47.8919 },
  "salvador": { lat: -12.9714, lon: -38.5124 },
  "ba": { lat: -12.9714, lon: -38.5124 },
  "fortaleza": { lat: -3.7172, lon: -38.5433 },
  "ce": { lat: -3.7172, lon: -38.5433 },
  "recife": { lat: -8.0476, lon: -34.8770 },
  "pe": { lat: -8.0476, lon: -34.8770 },
  "porto alegre": { lat: -30.0346, lon: -51.2177 },
  "rs": { lat: -30.0346, lon: -51.2177 },
  "goiania": { lat: -16.6869, lon: -49.2648 },
  "go": { lat: -16.6869, lon: -49.2648 },
  "manaus": { lat: -3.1190, lon: -60.0217 },
  "am": { lat: -3.1190, lon: -60.0217 },
  "campinas": { lat: -22.9099, lon: -47.0626 },
  "santos": { lat: -23.9608, lon: -46.3336 },
  "florianopolis": { lat: -27.5954, lon: -48.5480 },
  "sc": { lat: -27.5954, lon: -48.5480 },
  "vitoria": { lat: -20.3155, lon: -40.3128 },
  "es": { lat: -20.3155, lon: -40.3128 },
  "londrina": { lat: -23.3103, lon: -51.1628 },
  "maringa": { lat: -23.4273, lon: -51.9375 },
  "batel": { lat: -25.4370, lon: -49.2880 },
  "centro": { lat: -25.4290, lon: -49.2710 },
  "consolacao": { lat: -23.5520, lon: -46.6590 },
  "bela vista": { lat: -23.5630, lon: -46.6450 },
  "paulista": { lat: -23.5630, lon: -46.6540 },
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Try to extract city name from address for fallback lookup
 */
function extractCityFromAddress(address: string): Coordinates | null {
  const lower = address.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Try each city name against the address
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    const normalizedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.includes(normalizedCity)) {
      return coords;
    }
  }

  // Try state abbreviations at the end (e.g., "..., SP", "..., PR")
  const stateMatch = lower.match(/,\s*([a-z]{2})\s*$/);
  if (stateMatch) {
    const state = stateMatch[1];
    if (CITY_COORDS[state]) return CITY_COORDS[state];
  }

  return null;
}

/**
 * Try neighborhood-level matching for same-city moves
 */
function extractNeighborhoodCoords(address: string): Coordinates | null {
  const lower = address.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  for (const [name, coords] of Object.entries(CITY_COORDS)) {
    const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.includes(normalizedName)) {
      return coords;
    }
  }

  return null;
}

async function geocodeWithRetry(
  address: string,
  retries = 2
): Promise<Coordinates | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const encoded = encodeURIComponent(address + ", Brasil");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "MudaFacil/1.0 (https://muda-facil-one.vercel.app)",
            "Accept": "application/json",
          },
        }
      );

      if (res.status === 429) {
        // Rate limited — wait and retry
        console.warn(`Nominatim 429 on attempt ${attempt + 1}, waiting...`);
        await sleep(2000 * (attempt + 1));
        continue;
      }

      if (!res.ok) return null;

      const data = await res.json();
      if (!data || data.length === 0) return null;

      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } catch {
      if (attempt < retries) {
        await sleep(1500);
        continue;
      }
      return null;
    }
  }
  return null;
}

function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Calculates driving distance between two Brazilian addresses.
 *
 * Strategy:
 * 1. Try Nominatim geocoding (with retry + rate limit respect)
 * 2. Fall back to city-level coordinates if Nominatim fails
 * 3. Apply 1.3x road factor to straight-line distance
 *
 * Returns distance in km or null if all methods fail.
 */
export async function calculateDistance(
  origin: string,
  destination: string
): Promise<number | null> {
  // Strategy 1: Nominatim (sequential, respecting 1 req/sec policy)
  let originCoords = await geocodeWithRetry(origin);

  // Wait 1.1s between requests (Nominatim policy)
  await sleep(1100);

  let destCoords = await geocodeWithRetry(destination);

  // Strategy 2: Fallback to city/neighborhood coordinates
  if (!originCoords) {
    originCoords = extractNeighborhoodCoords(origin) || extractCityFromAddress(origin);
  }
  if (!destCoords) {
    destCoords = extractNeighborhoodCoords(destination) || extractCityFromAddress(destination);
  }

  if (!originCoords || !destCoords) return null;

  const straightLine = haversineKm(originCoords, destCoords);

  // For very short distances (same neighborhood), use a higher road factor
  const roadFactor = straightLine < 2 ? 1.5 : 1.3;
  const roadDistance = Math.round(straightLine * roadFactor);

  // Minimum 1 km for same-city moves
  return Math.max(1, roadDistance);
}
