import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedProperty = {
  title: string;
  description: string;
  price: number;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  images: string[];
};

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
];

const PROPERTY_TYPES = [
  'Apartment',
  'Studio',
  'Loft',
  'Penthouse',
  'Townhouse',
  'Duplex',
  'Condo',
  'Flat',
] as const;

const CITY_GENERATOR_CONFIG = {
  Paris: {
    centerLat: 48.8566,
    centerLng: 2.3522,
    latSpread: 0.08,
    lngSpread: 0.12,
    neighborhoods: [
      'Le Marais',
      'Montmartre',
      'Bastille',
      'Latin Quarter',
      'Belleville',
      'Canal Saint-Martin',
      'Passy',
      'Batignolles',
      'Nation',
      'République',
    ],
    priceBase: 420000,
    count: 34,
  },
  'San Francisco': {
    centerLat: 37.7749,
    centerLng: -122.4194,
    latSpread: 0.06,
    lngSpread: 0.08,
    neighborhoods: [
      'SOMA',
      'Noe Valley',
      'Castro',
      'Marina',
      'Mission',
      'Pacific Heights',
      'Hayes Valley',
      'Richmond',
      'Sunset',
      'Potrero Hill',
    ],
    priceBase: 980000,
    count: 34,
  },
  Tokyo: {
    centerLat: 35.6762,
    centerLng: 139.6503,
    latSpread: 0.07,
    lngSpread: 0.1,
    neighborhoods: [
      'Shibuya',
      'Shinjuku',
      'Roppongi',
      'Yanaka',
      'Akihabara',
      'Harajuku',
      'Nakameguro',
      'Ebisu',
      'Asakusa',
      'Meguro',
    ],
    priceBase: 620000,
    count: 34,
  },
} as const;

function pseudoRandom(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function offsetCoordinate(
  base: number,
  index: number,
  spread: number,
  salt: number,
): number {
  return base + (pseudoRandom(index, salt) - 0.5) * spread;
}

function pickImages(index: number): string[] {
  const first = IMAGE_POOL[index % IMAGE_POOL.length];
  const second = IMAGE_POOL[(index + 3) % IMAGE_POOL.length];
  const third = IMAGE_POOL[(index + 7) % IMAGE_POOL.length];
  return index % 3 === 0 ? [first, second, third] : [first, second];
}

function generateCityProperties(
  city: keyof typeof CITY_GENERATOR_CONFIG,
): SeedProperty[] {
  const config = CITY_GENERATOR_CONFIG[city];
  const properties: SeedProperty[] = [];

  for (let i = 0; i < config.count; i += 1) {
    const bedrooms = (i % 4) + 1;
    const bathrooms = Math.min(bedrooms + (i % 2), 3);
    const area = 32 + bedrooms * 22 + (i % 5) * 8;
    const priceMultiplier = 0.75 + pseudoRandom(i, 1) * 1.8;
    const neighborhood = config.neighborhoods[i % config.neighborhoods.length];
    const propertyType = PROPERTY_TYPES[i % PROPERTY_TYPES.length];

    properties.push({
      title: `${propertyType} in ${neighborhood} #${i + 1}`,
      description: `Well-located ${propertyType.toLowerCase()} in ${neighborhood}, ${city}. Bright living spaces, modern finishes, and excellent access to local shops, transit, and parks.`,
      price: Math.round(config.priceBase * priceMultiplier),
      city,
      bedrooms,
      bathrooms,
      area,
      latitude: offsetCoordinate(config.centerLat, i, config.latSpread, 2),
      longitude: offsetCoordinate(config.centerLng, i, config.lngSpread, 3),
      images: pickImages(i),
    });
  }

  return properties;
}

const mockProperties: SeedProperty[] = [
  // === PARIS (Coordinates: ~48.8566, 2.3522) ===
  {
    title: 'Charming Parisian Studio near Louvre',
    description: 'A cozy, typical Parisian studio located in the heart of the 1st arrondissement. Steps away from the Louvre Museum and Jardin des Tuileries. High ceilings, exposed beams, and a view over a quiet courtyard.',
    price: 320000,
    city: 'Paris',
    bedrooms: 1,
    bathrooms: 1,
    area: 28.5,
    latitude: 48.8606,
    longitude: 2.3376,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Elegant Duplex in Le Marais',
    description: 'Stunning duplex apartment in a historic 17th-century building. Featuring a bright double living room, open-plan kitchen, and a master suite. Meticulously renovated with premium materials.',
    price: 890000,
    city: 'Paris',
    bedrooms: 2,
    bathrooms: 2,
    area: 74,
    latitude: 48.8575,
    longitude: 2.3618,
    images: [
      'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Luxury Apartment with Eiffel Tower View',
    description: 'Exceptional 3-bedroom apartment on the prestigious Avenue de la Bourdonnais. Unobstructed, breathtaking views of the Eiffel Tower. Features grand reception rooms and marble bathrooms.',
    price: 2450000,
    city: 'Paris',
    bedrooms: 3,
    bathrooms: 3,
    area: 145,
    latitude: 48.8572,
    longitude: 2.2995,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Bohemian Loft in Saint-Germain-des-Prés',
    description: 'Chic artist loft with industrial vibes in Saint-Germain. Sky-lit living area, brick walls, and custom-made wooden fixtures. Perfect for creative minds seeking inspiration.',
    price: 1150000,
    city: 'Paris',
    bedrooms: 2,
    bathrooms: 1.5,
    area: 92,
    latitude: 48.8532,
    longitude: 2.3331,
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Modern Penthouse near Canal Saint-Martin',
    description: 'Stunning contemporary penthouse with a wraparound rooftop terrace. Panoramas over Paris rooftops. High-end smart home installations and direct elevator access.',
    price: 1650000,
    city: 'Paris',
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    latitude: 48.8718,
    longitude: 2.3639,
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Historic Apartment by Montmartre Steps',
    description: 'Quaint 1-bedroom apartment situated right on the steps leading up to the Sacré-Cœur. Packed with period features including original fireplaces and chevron parquet flooring.',
    price: 495000,
    city: 'Paris',
    bedrooms: 1,
    bathrooms: 1,
    area: 45.2,
    latitude: 48.8867,
    longitude: 2.3431,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // === SAN FRANCISCO (Coordinates: ~37.7749, -122.4194) ===
  {
    title: 'Victorian Painted Lady in Alamo Square',
    description: 'A beautifully preserved Queen Anne Victorian overlooking Alamo Square Park. High-end modern chef kitchen, grand staircases, stained glass windows, and a landscaped rear garden.',
    price: 2950000,
    city: 'San Francisco',
    bedrooms: 4,
    bathrooms: 3.5,
    area: 280,
    latitude: 37.7763,
    longitude: -122.4328,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Modern High-Rise Condo in SOMA',
    description: 'Floor-to-ceiling windows offer spectacular city and bay views in this sleek SOMA tower unit. Resort-like amenities including 24/7 concierge, lap pool, fitness center, and sky lounge.',
    price: 1250000,
    city: 'San Francisco',
    bedrooms: 2,
    bathrooms: 2,
    area: 105,
    latitude: 37.7845,
    longitude: -122.3985,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Charming Cottage in Noe Valley',
    description: 'A private and peaceful light-filled cottage hidden away on a tree-lined Noe Valley street. Open concept living, cathedral ceilings, and French doors opening to a sun-drenched deck.',
    price: 1850000,
    city: 'San Francisco',
    bedrooms: 3,
    bathrooms: 2,
    area: 158,
    latitude: 37.7515,
    longitude: -122.4312,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Sleek Mid-Century in Castro Hills',
    description: 'Perched high in the Castro hills, this mid-century architectural masterpiece features panoramic city skyline views, a floating fireplace, and automated glass walls.',
    price: 2600000,
    city: 'San Francisco',
    bedrooms: 3,
    bathrooms: 2.5,
    area: 210,
    latitude: 37.7612,
    longitude: -122.4415,
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Marina District Flats with Golden Gate View',
    description: 'Located half a block from Marina Green, this classic Edwardian flat combines vintage details with high-end modern amenities. Includes views of the Golden Gate Bridge.',
    price: 2100000,
    city: 'San Francisco',
    bedrooms: 3,
    bathrooms: 2,
    area: 172,
    latitude: 37.8038,
    longitude: -122.4368,
    images: [
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Stylish Loft near Mission Dolores',
    description: 'Brilliant conversion loft featuring massive timber beams, original brick walls, a custom steel floating staircase, and private patio. Located in the vibrant Mission District.',
    price: 950000,
    city: 'San Francisco',
    bedrooms: 1,
    bathrooms: 1.5,
    area: 90,
    latitude: 37.7601,
    longitude: -122.4248,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527030280862-64139fbe04ca?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // === TOKYO (Coordinates: ~35.6762, 139.6503) ===
  {
    title: 'Luxury Residence in Roppongi Hills',
    description: 'High-end designer residence in a landmark Roppongi tower. Superb views towards Tokyo Tower. Modern Japanese styling with custom hinoki woodwork and premium Gaggenau appliances.',
    price: 1800000, // Equivalent value in standard units ($/€) for consistency
    city: 'Tokyo',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    latitude: 35.6604,
    longitude: 139.7292,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Traditional Machiya-Style House in Yanaka',
    description: 'Renovated traditional townhouse in the historic Yanaka district. Retains classic sliding shoji screens, tatami rooms, and an indoor rock garden (Tsuboniwa) while adding modern heating and kitchen.',
    price: 920000,
    city: 'Tokyo',
    bedrooms: 3,
    bathrooms: 1.5,
    area: 108,
    latitude: 35.7258,
    longitude: 139.7681,
    images: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Minimalist Apartment in Shibuya',
    description: 'Ultra-modern minimalist apartment located just minutes away from Shibuya Crossing. Smart storage solutions, polished concrete floors, and floor-to-ceiling windows looking over the skyline.',
    price: 780000,
    city: 'Tokyo',
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    latitude: 35.6598,
    longitude: 139.7023,
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Spacious Family House in Jiyugaoka',
    description: 'A beautiful detached home in the trendy neighborhood of Jiyugaoka. Features a double-height ceiling in the living room, a private parking space, and a small front garden. Perfect for families.',
    price: 1650000,
    city: 'Tokyo',
    bedrooms: 4,
    bathrooms: 2.5,
    area: 185,
    latitude: 35.6074,
    longitude: 139.6686,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Modern Loft in Akihabara',
    description: 'High-concept industrial loft with exposed ducts and steel accents. Fully furnished with smart media integration and adjustable RGB lighting setups. In the center of Tokyo geek culture.',
    price: 680000,
    city: 'Tokyo',
    bedrooms: 1,
    bathrooms: 1,
    area: 68,
    latitude: 35.6997,
    longitude: 139.7715,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    title: 'Harajuku Penthouse with Rooftop Deck',
    description: 'Extravagant luxury penthouse with an expansive outdoor wood-decked patio. Enjoys 360 views over Yoyogi Park and Meiji Shrine. Exclusive location, premium quality throughout.',
    price: 3200000,
    city: 'Tokyo',
    bedrooms: 3,
    bathrooms: 3,
    area: 215,
    latitude: 35.6702,
    longitude: 139.7048,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

const generatedProperties = (
  Object.keys(CITY_GENERATOR_CONFIG) as Array<
    keyof typeof CITY_GENERATOR_CONFIG
  >
).flatMap((city) => generateCityProperties(city));

const allProperties = [...mockProperties, ...generatedProperties];

async function main() {
  console.log('Start seeding database...');

  // Clean up existing data to allow re-runs
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();

  for (const property of allProperties) {
    const { images, ...data } = property;
    await prisma.listing.create({
      data: {
        ...data,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    });
  }

  console.log(
    `Seeding completed successfully! Inserted ${allProperties.length} listings.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
