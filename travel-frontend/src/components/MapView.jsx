import React, { useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "350px",
};

export default function MapView({ places = [] }) {
  const [selected, setSelected] = React.useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // 📍 Dynamic center (first place)
  const center = useMemo(() => {
    if (places.length > 0) {
      return {
        lat: places[0].lat,
        lng: places[0].lng,
      };
    }
    return { lat: 28.6139, lng: 77.209 };
  }, [places]);

  if (!isLoaded) {
    return (
      <div className="text-white text-center py-10">
        🗺️ Loading Map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={6}
      center={center}
    >
      {places.map((place, i) => (
        <Marker
          key={i}
          position={{
            lat: place.lat,
            lng: place.lng,
          }}
          onClick={() => setSelected(place)}
          label={{
            text: `${i + 1}`,
            color: "white",
          }}
        />
      ))}

      {selected && (
        <InfoWindow
          position={{
            lat: selected.lat,
            lng: selected.lng,
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="text-black">
            <h3 className="font-bold">{selected.name}</h3>
            <p>📍 Explore this place</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}