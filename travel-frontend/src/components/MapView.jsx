import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 28.6139, // default (Delhi)
  lng: 77.2090,
};

export default function MapView({ places = [] }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} zoom={5} center={center}>
      {places.map((place, i) => (
        <Marker
          key={i}
          position={{
            lat: place.lat || 28.6 + i * 0.1,
            lng: place.lng || 77.2 + i * 0.1,
          }}
        />
      ))}
    </GoogleMap>
  );
}