import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix broken default marker icons in bundlers (Vite/webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
export default function MapView({ restaurants = [], onSelect }) {
  return (
    <div className="w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh]">
      <MapContainer
        center={[30, 70]}
        zoom={5}
        className="w-full h-full rounded-xl"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
            eventHandlers={{ click: () => onSelect(restaurant) }}
          >
            <Popup>
              <strong>{restaurant.name}</strong>
              <br />
              {restaurant.city}
             
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}