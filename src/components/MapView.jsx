// ─────────────────────────────────────────────────────────────────────────────
// MapView.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdOutlineLocalDining } from "react-icons/md";
import { IoTime } from "react-icons/io5";
import { MdOutlineLocalPhone } from "react-icons/md";
import { FaCar } from "react-icons/fa6";
// ── Cuisine colours ───────────────────────────────────────────────────────────
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

// ── makePin ───────────────────────────────────────────────────────────────────
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

// ── FlyTo — flies map to selected restaurant ──────────────────────────────────
function FlyTo({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected?.latitude && selected?.longitude) {
      map.flyTo([selected.latitude, selected.longitude], 15, { duration: 1 });
    }
  }, [selected]);
  return null;
}

// ── FlyToUser — flies map to GPS position ────────────────────────────────────
function FlyToUser({ userPos }) {
  const map = useMap();
  useEffect(() => {
    if (userPos) map.flyTo(userPos, 14, { duration: 1 });
  }, [userPos]);
  return null;
}

function MapControls({ onLocate }) {
  const map = useMap();

  // Shared style for the + and − buttons
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

  return (
    // Absolute position in bottom-right, on top of the map (z-index via Leaflet)
    <div
      className="leaflet-bottom leaflet-right"
      style={{ marginBottom: "16px", marginRight: "16px" }}
    >
      <div
        className="leaflet-control"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >

        {/* ── White card: Zoom In (+) and Zoom Out (−) ── */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Zoom In */}
          <button
            onClick={() => map.zoomIn()}
            title="Zoom in"
            style={{
              ...zoomBtnStyle,
              borderBottom: "1px solid #e5e7eb", // thin divider between + and −
            }}
          >
            +
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => map.zoomOut()}
            title="Zoom out"
            style={zoomBtnStyle}
          >
            −
          </button>
        </div>

        {/* ── Dark green locate / crosshair button ── */}
        <button
          onClick={onLocate}
          title="Go to my location"
          style={{
            width: "48px",
            height: "48px",
            background: "#14532d",       // dark green — matches app brand colour
            border: "none",
            borderRadius: "14px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.22)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#14532d"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#14532d"}
        >
          {/*
            Crosshair / locate icon drawn with SVG lines and circles.
            - Outer ring
            - 4 tick lines pointing outward (N, S, E, W)
            - Filled dot in the centre
          */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {/* Outer circle */}
            <circle cx="12" cy="12" r="7" />
            {/* Centre dot */}
            <circle cx="12" cy="12" r="2" fill="white" stroke="none" />
            {/* North line */}
            <line x1="12" y1="2"  x2="12" y2="5"  />
            {/* South line */}
            <line x1="12" y1="19" x2="12" y2="22" />
            {/* West line */}
            <line x1="2"  y1="12" x2="5"  y2="12" />
            {/* East line */}
            <line x1="19" y1="12" x2="22" y2="12" />
          </svg>
        </button>

      </div>
    </div>
  );
}

// ── SelectedCard — floating detail card (top-right of the map) ───────────────
function SelectedCard({ restaurant, onClose }) {
  const isCertified = restaurant.halal_status === "Halal Certified";
  const color       = getCuisineColor(restaurant.cuisine);

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-gray-100 rounded-2xl shadow-2xl w-64 overflow-hidden">
      <div className="h-1.5 w-full" style={{ background: color }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="text-white h-full p-2 bg-green-950 rounded-md text-2xl"><MdOutlineLocalDining/></div>
          <h3 className="font-bold text-green-950 text-lg leading-snug">
            {restaurant.name}
          </h3>
         
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none shrink-0">
            ×
          </button>
           
        </div>

       <div className="flex flex-col gap-3 text-green-900 text-md">
  
  <div className="flex items-center gap-2">
    <IoTime />
     <p>{restaurant.hours}</p>
  </div>

  <div className="flex items-center gap-2">
    <MdOutlineLocalPhone />
    <p>{restaurant.phone}</p>
  </div>

  <div className="flex items-center gap-2">
    <FaCar />
    <p>{restaurant.address}</p>
  </div>

</div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`}
          target="_blank" rel="noopener noreferrer"
          className="w-full text-white text-xs font-semibold p-3 mt-2 rounded-xl flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
          style={{ background: color }}
        >
          ➤ Get Directions
        </a>
      </div>
    </div>
  );
}

// ── CuisineLegend ─────────────────────────────────────────────────────────────
function CuisineLegend() {
  return (
    <div className="absolute bottom-6 left-4 z-[1000] bg-white rounded-xl shadow px-3 py-2 space-y-1">
      {Object.entries(CUISINE_COLORS).map(([name, color]) => (
        <div key={name} className="flex items-center gap-2 text-xs text-gray-700">
          <span style={{ width:10, height:10, borderRadius:"50%", background:color, display:"inline-block" }} />
          {name}
        </div>
      ))}
    </div>
  );
}
export default function MapView({ restaurants, selected, onSelect, userPos, onLocate }) {
  return (
    <div className="relative w-full h-full">

      <MapContainer
        center={[64.5, 26.0]}
        zoom={5}
        zoomControl={false}   // disable default zoom — MapControls replaces it
        className="w-full h-full"
        style={{ filter: "grayscale(0.3) brightness(0.95)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo selected={selected} />
        <FlyToUser userPos={userPos} />

        {/* Custom +/− zoom and locate button — inside MapContainer so useMap() works */}
        <MapControls onLocate={onLocate} />

        {/* Restaurant pins */}
        {restaurants.map((restaurant) => {
          if (!restaurant.latitude || !restaurant.longitude) return null;
          return (
            <Marker
              key={restaurant.id}
              position={[restaurant.latitude, restaurant.longitude]}
              icon={makePin(restaurant.cuisine, selected?.id === restaurant.id)}
              eventHandlers={{ click: () => onSelect(restaurant) }}
            >
              <Popup>
                <strong>{restaurant.name}</strong><br />
                {restaurant.city}
                {restaurant.hours && <><br />🕐 {restaurant.hours}</>}
              </Popup>
            </Marker>
          );
        })}

        {/* User GPS blue dot */}
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

      {/* Floating selected restaurant card */}
      {selected && (
        <SelectedCard restaurant={selected} onClose={() => onSelect(null)} />
      )}

      {/* Colour legend */}
      <CuisineLegend />

    </div>
  );
}