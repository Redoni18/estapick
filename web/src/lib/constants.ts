export const DEFAULT_CITY = 'Paris';

export const CITY_COORDINATES: Record<string, { center: [number, number]; zoom: number }> = {
  Amsterdam: { center: [52.3676, 4.9041], zoom: 12 },
  Athens: { center: [37.9838, 23.7275], zoom: 12 },
  Austin: { center: [30.2672, -97.7431], zoom: 12 },
  Barcelona: { center: [41.3874, 2.1686], zoom: 12 },
  Berlin: { center: [52.52, 13.405], zoom: 12 },
  Boston: { center: [42.3601, -71.0589], zoom: 12 },
  Brussels: { center: [50.8503, 4.3517], zoom: 12 },
  'Buenos Aires': { center: [-34.6037, -58.3816], zoom: 12 },
  Chicago: { center: [41.8781, -87.6298], zoom: 12 },
  Copenhagen: { center: [55.6761, 12.5683], zoom: 12 },
  Dubai: { center: [25.2048, 55.2708], zoom: 12 },
  Dublin: { center: [53.3498, -6.2603], zoom: 12 },
  'Hong Kong': { center: [22.3193, 114.1694], zoom: 12 },
  Istanbul: { center: [41.0082, 28.9784], zoom: 12 },
  Lisbon: { center: [38.7223, -9.1393], zoom: 12 },
  London: { center: [51.5074, -0.1278], zoom: 12 },
  'Los Angeles': { center: [34.0522, -118.2437], zoom: 11 },
  Madrid: { center: [40.4168, -3.7038], zoom: 12 },
  Melbourne: { center: [-37.8136, 144.9631], zoom: 12 },
  'Mexico City': { center: [19.4326, -99.1332], zoom: 12 },
  Miami: { center: [25.7617, -80.1918], zoom: 12 },
  Milan: { center: [45.4642, 9.19], zoom: 12 },
  Montreal: { center: [45.5017, -73.5673], zoom: 12 },
  Mumbai: { center: [19.076, 72.8777], zoom: 12 },
  'New York': { center: [40.7128, -74.006], zoom: 11 },
  Oslo: { center: [59.9139, 10.7522], zoom: 12 },
  Paris: { center: [48.8566, 2.3522], zoom: 12 },
  Prague: { center: [50.0755, 14.4378], zoom: 12 },
  Rome: { center: [41.9028, 12.4964], zoom: 12 },
  'San Francisco': { center: [37.7749, -122.4194], zoom: 12 },
  Seattle: { center: [47.6062, -122.3321], zoom: 12 },
  Seoul: { center: [37.5665, 126.978], zoom: 12 },
  Singapore: { center: [1.3521, 103.8198], zoom: 12 },
  Stockholm: { center: [59.3293, 18.0686], zoom: 12 },
  Sydney: { center: [-33.8688, 151.2093], zoom: 11 },
  Tokyo: { center: [35.6762, 139.6503], zoom: 12 },
  Toronto: { center: [43.6532, -79.3832], zoom: 12 },
  Vancouver: { center: [49.2827, -123.1207], zoom: 12 },
  Vienna: { center: [48.2082, 16.3738], zoom: 12 },
  Warsaw: { center: [52.2297, 21.0122], zoom: 12 },
  Zurich: { center: [47.3769, 8.5417], zoom: 12 },
};

export const CITY_NAMES = Object.keys(CITY_COORDINATES).sort((a, b) =>
  a.localeCompare(b),
);

// Squared distance in lat/lng degrees. Good enough for "which configured city
// is closest to this map center?" — we only need a relative ordering, not real
// great-circle distance, and avoiding sqrt + trig keeps it cheap to run on
// every map move.
function squaredDegreeDistance(
  a: [number, number],
  b: [number, number],
): number {
  const dLat = a[0] - b[0];
  const dLng = a[1] - b[1];
  return dLat * dLat + dLng * dLng;
}

/**
 * Returns the configured city whose center is geographically closest to the
 * given map center. Used to keep the city filter in sync with what the user is
 * actually looking at after panning/zooming the map.
 */
export function findNearestCity(center: [number, number]): string | undefined {
  let nearestCity: string | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const [city, { center: cityCenter }] of Object.entries(
    CITY_COORDINATES,
  )) {
    const distance = squaredDegreeDistance(center, cityCenter);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCity = city;
    }
  }

  return nearestCity;
}

export const BEDROOM_OPTIONS = ['all', '1', '2', '3', '4'] as const;
export type BedroomOption = (typeof BEDROOM_OPTIONS)[number];

export const LISTINGS_PAGE_SIZE = 8;

export const FETCH_DEBOUNCE_MS = 150;
