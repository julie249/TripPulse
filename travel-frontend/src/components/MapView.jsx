import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [28.6139, 77.209];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ places = [] }) {
  const validPlaces = useMemo(() => {
    return places
      .map((place) => ({
        ...place,
        lat: Number(place.lat),
        lng: Number(place.lng),
      }))
      .filter(
        (place) =>
          place.name &&
          !Number.isNaN(place.lat) &&
          !Number.isNaN(place.lng) &&
          place.lat >= -90 &&
          place.lat <= 90 &&
          place.lng >= -180 &&
          place.lng <= 180
      );
  }, [places]);

  const center =
    validPlaces.length > 0
      ? [validPlaces[0].lat, validPlaces[0].lng]
      : defaultCenter;

  const routePositions = validPlaces.map((place) => [place.lat, place.lng]);

  if (validPlaces.length === 0) {
    return (
      <div className="h-[350px] rounded-2xl bg-white/10 flex items-center justify-center text-center p-6">
        <p className="text-gray-200">
          No valid map locations available for this trip.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[350px] rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routePositions.length > 1 && (
          <Polyline positions={routePositions} />
        )}

        {validPlaces.map((place, index) => (
          <Marker
            key={`${place.name}-${index}`}
            position={[place.lat, place.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div>
                <strong>
                  {index + 1}. {place.name}
                </strong>
                <br />
                AI recommended stop
                <br />
                <a
                  href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}