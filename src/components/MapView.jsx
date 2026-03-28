import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Different pin color per cuisine type
const COLORS = {
  Turkish:   "#1a5c35",
  Arabic:    "#0e6b8a",
  Indian:    "#c47a1e",
  Pakistani: "#7b3fa0",
  Default:   "#555555",
};

function getColor(cuisine) {
  return COLORS[cuisine] || COLORS.Default;
}

// Custom colored pin icon
function makePin(cuisine, isSelected) {
  const color = getColor(cuisine);
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:32px; height:32px;
        background:${isSelected ? "#fff" : color};
        border:3px solid ${color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width:10px; height:10px;
          background:${isSelected ? color : "#fff"};
          border-radius:50%;
          position:absolute;
          top:50%; left:50%;
          transform:translate(-50%,-50%);
        "></div>
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -35],
  });
}

// Fly to restaurant when selected
function FlyTo({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected && selected.latitude && selected.longitude) {
      map.flyTo([selected.latitude, selected.longitude], 15, { duration: 1 });
    }
  }, [selected]);
  return null;
}

// Fly to user location
function FlyToUser({ userPos }) {
  const map = useMap();
  useEffect(() => {
    if (userPos) {
      map.flyTo(userPos, 14, { duration: 1 });
    }
  }, [userPos]);
  return null;
}

// + and - zoom buttons
function ZoomButtons({ restaurants, selected }) {
  const map = useMap();

  function zoomIn() {
    const target = selected || restaurants[0];
    if (target && target.latitude) {
      map.flyTo([target.latitude, target.longitude], 16, { duration: 0.7 });
    } else {
      map.zoomIn();
    }
  }

  function zoomOut() {
    if (restaurants.length > 0) {
      const points = restaurants
        .filter((r) => r.latitude && r.longitude)
        .map((r) => [r.latitude, r.longitude]);
      if (points.length > 0) {
        map.flyToBounds(L.latLngBounds(points), { padding: [60, 60], duration: 0.8 });
      }
    } else {
      map.zoomOut();
    }
  }

  return (
    <div style={{ position: "absolute", bottom: 24, right: 16, zIndex: 1000 }}
      className="flex flex-col gap-1.5">
      <button onClick={zoomIn}
        className="w-10 h-10 bg-white rounded-xl shadow border border-gray-100 text-xl text-gray-700 hover:bg-gray-50 active:scale-95 flex items-center justify-center transition-all">
        +
      </button>
      <button onClick={zoomOut}
        className="w-10 h-10 bg-white rounded-xl shadow border border-gray-100 text-xl text-gray-700 hover:bg-gray-50 active:scale-95 flex items-center justify-center transition-all">
        −
      </button>
    </div>
  );
}

export default function MapView({ restaurants, selected, onSelect, userPos }) {
  return (
    <div className="relative w-full h-full">

      <MapContainer
        center={[64.5, 26.0]}
        zoom={5}
        zoomControl={false}
        className="w-full h-full"
        style={{ filter: "grayscale(0.7) brightness(0.9) contrast(1.05)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo selected={selected} />
        <FlyToUser userPos={userPos} />
        <ZoomButtons restaurants={restaurants} selected={selected} />

        {/* Restaurant pins */}
        {restaurants.map((r) =>
          r.latitude && r.longitude ? (
            <Marker
              key={r.id}
              position={[r.latitude, r.longitude]}
              icon={makePin(r.cuisine, selected?.id === r.id)}
              eventHandlers={{ click: () => onSelect(r) }}
            >
              <Popup>
                <strong>{r.name}</strong><br />{r.city}
              </Popup>
            </Marker>
          ) : null
        )}

        {/* Blue dot for user location */}
        {userPos && (
          <Marker
            position={userPos}
            icon={L.divIcon({
              className: "",
              html: `<div style="
                width:14px; height:14px;
                background:#3b82f6;
                border:3px solid white;
                border-radius:50%;
                box-shadow:0 0 0 4px rgba(59,130,246,0.3);
              "></div>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7],
            })}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Selected restaurant card */}
      {selected && (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-2xl shadow-2xl w-64 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: getColor(selected.cuisine) }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 2v7c0 1.1.9 2 2 2h1v11h2V11h1c1.1 0 2-.9 2-2V2h-2v5H7V2H5v5H4V2H3z"/>
                <path d="M16 2c-1.66 0-3 1.79-3 4v5h2v11h2V11h2V6c0-2.21-1.34-4-3-4z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected</p>
              <p className="text-sm font-bold text-gray-900 truncate">{selected.name}</p>
            </div>
            <button onClick={() => onSelect(null)}
              className="text-gray-400 hover:text-gray-600 text-lg shrink-0">×</button>
          </div>

          <div className="space-y-1.5 text-sm text-gray-600 mb-3">
            {selected.address && <p>📍 {selected.address}</p>}
            {selected.city && <p>🏙 {selected.city}</p>}
            {selected.cuisine && <p>🍽 {selected.cuisine}</p>}
            {selected.open_until && <p>🕐 Open until {selected.open_until}</p>}
            {selected.phone && <p>📞 {selected.phone}</p>}
          </div>

          <div className={`text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1 mb-3 ${
            selected.halal_status === "Halal Certified"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            ✓ {selected.halal_status || "Halal Options"}
          </div>

          <button
            className="w-full text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: getColor(selected.cuisine) }}
          >
            ➤ Get Directions
          </button>
        </div>
      )}

      {/* Color legend */}
      <div className="absolute bottom-6 left-4 z-[1000] bg-white rounded-xl shadow px-3 py-2 space-y-1">
        {Object.entries(COLORS).filter(([k]) => k !== "Default").map(([name, color]) => (
          <div key={name} className="flex items-center gap-2 text-xs text-gray-700">
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}