import { LocationMap } from './LocationMap';

interface LocationPanelProps {
  latitude: number;
  longitude: number;
  title: string;
  price: number;
  city: string;
  bedrooms: number;
  area: number;
  image?: string;
}

export function LocationPanel({
  latitude,
  longitude,
  title,
  price,
  city,
  bedrooms,
  area,
  image,
}: LocationPanelProps) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col h-[380px]">
      <h3 className="text-xs uppercase tracking-wider font-bold text-muted mb-3 px-1">
        Property Location
      </h3>
      <div className="relative isolate z-0 flex-1 w-full">
        <LocationMap
          latitude={latitude}
          longitude={longitude}
          title={title}
          price={price}
          city={city}
          bedrooms={bedrooms}
          area={area}
          image={image}
        />
      </div>
    </div>
  );
}
