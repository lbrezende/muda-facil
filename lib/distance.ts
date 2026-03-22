/**
 * Distance calculation using free Nominatim geocoding + Haversine formula.
 * No API key needed. Falls back to null if geocoding fails.
 */

interface Coordinates {
  lat: number;
  lon: number;
}

async function geocode(address: string): Promise<Coordinates | null> {
  try {
    const encoded = encodeURIComponent(address + ", Brasil");
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "MudaFacil/1.0 (mudafacil.com.br)",
        },
      }
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
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
 * Uses Nominatim (free) + Haversine with a 1.3x road factor.
 * Returns distance in km or null if geocoding fails.
 */
export async function calculateDistance(
  origin: string,
  destination: string
): Promise<number | null> {
  const [originCoords, destCoords] = await Promise.all([
    geocode(origin),
    geocode(destination),
  ]);

  if (!originCoords || !destCoords) return null;

  const straightLine = haversineKm(originCoords, destCoords);
  // Road factor: roads are ~30% longer than straight line
  const roadDistance = Math.round(straightLine * 1.3);

  return roadDistance;
}
