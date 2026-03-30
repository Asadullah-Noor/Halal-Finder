import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdOutlineLocalDining } from "react-icons/md";
import { IoTime } from "react-icons/io5";
import { MdOutlineLocalPhone } from "react-icons/md";
import { FaCar } from "react-icons/fa6";

const CUISINE_COLORS = {
  Turkish:     "#14532d",
  Arabic:      "#14532d",
  Syrian:      "#14532d",
  Bangladeshi: "#14532d",
  Indian:      "#14532d",
  Pakistani:   "#14532d",
};

function getCuisineColor(cuisine) {
  return CUISINE_COLORS[cuisine] || "#14532d";
}

function makePin(cuisine, isSelected) {
  const color = getCuisineColor(cuisine);
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:28px; height:28px;
        background:${isSelected ? "#fff" : color};
        border:3px solid ${color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width:9px; height:9px;
          background:${isSelected ? color : "#fff"};
          border-radius:50%;
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
        "></div>
      </div>`,
    iconSize:    [28, 28],
    iconAnchor:  [14, 28],
    popupAnchor: [0, -32],
  });
}

function FlyTo({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected?.latitude && selected?.longitude) {
      map.flyTo([selected.latitude, selected.longitude], 15, { duration: 1 });
    }
  }, [selected]);
  return null;
}

function FlyToUser({ userPos }) {
  const map = useMap();
  useEffect(() => {
    if (userPos) map.flyTo(userPos, 14, { duration: 1 });
  }, [userPos]);
  return null;
}

function MapControls({ onLocate }) {
  const map = useMap();
  const isMobile = window.innerWidth < 768;

  const zoomBtnStyle = {
    width: "48px",
    height: "48px",
    background: "transparent",
    border: "none",
    fontSize: "24px",
    fontWeight: "300",
    color: "#2E7D32",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    transition: "background 0.15s",
  };

  const positionClass = isMobile
    ? "leaflet-top leaflet-left"
    : "leaflet-bottom leaflet-right";

  const positionStyle = isMobile
    ? { marginTop: "12px", marginLeft: "12px" }
    : { marginBottom: "16px", marginRight: "16px" };

  return (
    <div className={positionClass} style={positionStyle}>
      <div
        className="leaflet-control"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
      >
        <div style={{
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <button onClick={() => map.zoomIn()} title="Zoom in"
            style={{ ...zoomBtnStyle, borderBottom: "1px solid #e5e7eb" }}>+</button>
          <button onClick={() => map.zoomOut()} title="Zoom out"
            style={zoomBtnStyle}>−</button>
        </div>

        <button
          onClick={onLocate}
          title="Go to my location"
          style={{
            width: "48px", height: "48px",
            background: "#14532d", border: "none",
            borderRadius: "14px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.22)",
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="2" fill="white" stroke="none" />
            <line x1="12" y1="2"  x2="12" y2="5"  />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2"  y1="12" x2="5"  y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Floating SelectedCard ─────────────────────────────────────────────────────
// Shown only when a Sidebar card is clicked (sidebarSelected is set).
// Has a "View Details" button that triggers the full DetailPanel via onMapSelect.
function SelectedCard({ restaurant, onClose, onViewDetails }) {
  const color = getCuisineColor(restaurant.cuisine);
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-gray-100 rounded-2xl shadow-2xl w-64 overflow-hidden">
      <div className="h-1.5 w-full" style={{ background: color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="text-white h-full p-2 bg-green-950 rounded-md text-2xl">
            <MdOutlineLocalDining />
          </div>
          <h3 className="font-bold text-green-950 text-lg leading-snug flex-1">
            {restaurant.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none shrink-0"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3 text-green-900 text-md">
          {restaurant.hours && (
            <div className="flex items-center gap-2">
              <IoTime />
              <p>{restaurant.hours}</p>
            </div>
          )}
          {restaurant.phone && (
            <div className="flex items-center gap-2">
              <MdOutlineLocalPhone />
              <p>{restaurant.phone}</p>
            </div>
          )}
          {(restaurant.address || restaurant.city) && (
            <div className="flex items-center gap-2">
              <FaCar />
              <p>{restaurant.address || restaurant.city}</p>
            </div>
          )}
        </div>

        {/* View Details → opens full DetailPanel */}
        <button
          onClick={() => onViewDetails(restaurant)}
          className="w-full text-white text-xs font-semibold p-3 mt-3 rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
          style={{ background: color }}
        >
          View Full Details →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MapView({
  restaurants,
  selected,         // highlighted pin (either sidebarSelected or mapSelected)
  onSidebarSelect,  // NOT used inside MapView — kept for API consistency
  onMapSelect,      // called when a map pin is clicked → triggers DetailPanel
  sidebarSelected,  // controls whether SelectedCard is shown
  onSelectedCardClose,
  userPos,
  onLocate,
}) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[64.5, 26.0]}
        zoom={5}
        zoomControl={false}
        className="w-full h-full"
        style={{ filter: "grayscale(0.3) brightness(0.95)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo selected={selected} />
        <FlyToUser userPos={userPos} />
        <MapControls onLocate={onLocate} />

        {restaurants.map((restaurant) => {
          if (!restaurant.latitude || !restaurant.longitude) return null;
          return (
            <Marker
              key={restaurant.id}
              position={[restaurant.latitude, restaurant.longitude]}
              icon={makePin(restaurant.cuisine, selected?.id === restaurant.id)}
              eventHandlers={{
                // Pin click → full DetailPanel
                click: () => onMapSelect(restaurant),
              }}
            >
              <Popup>
                <strong>{restaurant.name}</strong><br />
                {restaurant.city}
                {restaurant.hours && <><br />🕐 {restaurant.hours}</>}
              </Popup>
            </Marker>
          );
        })}

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

      {/*
       * SelectedCard — shown only when a Sidebar card is clicked.
       * Dismissed by × button or by clicking "View Full Details"
       * which calls onMapSelect → switches to DetailPanel.
       */}
      {sidebarSelected && (
        <SelectedCard
          restaurant={sidebarSelected}
          onClose={onSelectedCardClose}
          onViewDetails={onMapSelect}
        />
      )}
    </div>
  );
}