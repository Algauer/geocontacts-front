"use client";

import { useCallback, useEffect, useRef } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import type { Contact } from "@/lib/contacts";

type ContactsMapProps = {
  contacts: Contact[];
  selectedContactId?: string | null;
  onSelectContact?: (contactId: string) => void;
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: -25.4284, lng: -49.2733 }; // Curitiba

export function ContactsMap({
  contacts,
  selectedContactId,
  onSelectContact,
}: ContactsMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const contactsWithCoords = contacts.filter(
    (c) => c.latitude !== null && c.longitude !== null
  );

  // Center map on selected contact
  useEffect(() => {
    if (!mapRef.current || !selectedContactId) return;

    const selected = contactsWithCoords.find(
      (c) => c.id === selectedContactId
    );
    if (selected) {
      mapRef.current.panTo({
        lat: selected.latitude!,
        lng: selected.longitude!,
      });
      mapRef.current.setZoom(16);
    }
  }, [selectedContactId, contactsWithCoords]);

  // Fit bounds to show all pins when contacts change (and no selection)
  useEffect(() => {
    if (!mapRef.current || contactsWithCoords.length === 0 || selectedContactId)
      return;

    if (contactsWithCoords.length === 1) {
      mapRef.current.panTo({
        lat: contactsWithCoords[0].latitude!,
        lng: contactsWithCoords[0].longitude!,
      });
      mapRef.current.setZoom(14);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    contactsWithCoords.forEach((c) => {
      bounds.extend({ lat: c.latitude!, lng: c.longitude! });
    });
    mapRef.current.fitBounds(bounds, 50);
  }, [contactsWithCoords.length, selectedContactId]);

  if (!isLoaded) {
    return (
      <div className="h-full bg-muted flex items-center justify-center rounded-lg">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={onLoad}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {contactsWithCoords.map((contact) => (
        <MarkerF
          key={contact.id}
          position={{ lat: contact.latitude!, lng: contact.longitude! }}
          title={contact.name}
          onClick={() => onSelectContact?.(contact.id)}
          icon={
            contact.id === selectedContactId
              ? {
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }
              : undefined
          }
        />
      ))}
    </GoogleMap>
  );
}
