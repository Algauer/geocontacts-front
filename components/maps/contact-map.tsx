"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

type ContactMapProps = {
  latitude: number;
  longitude: number;
  name?: string;
  className?: string;
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export function ContactMap({
  latitude,
  longitude,
  className = "h-48 rounded-lg overflow-hidden",
}: ContactMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const center = { lat: latitude, lng: longitude };

  if (!isLoaded) {
    return (
      <div
        className={`${className} bg-muted flex items-center justify-center`}
      >
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={16}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
}
