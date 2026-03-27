import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView({ restaurants = [], onSelect }) {
  return (
    <div className="w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh]">
      <MapContainer
        center={[30, 70]}
        zoom={5}
        className="w-full h-full rounded-xl"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {restaurants.map((r, i) => (
          <Marker
            key={i}
            position={[r.latitude, r.longitude]}
            eventHandlers={{
              click: () => onSelect(r),
            }}
          >
            <Popup>
              <strong>{r.name}</strong>
              <br />
              {r.city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}