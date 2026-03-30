import React from "react";
import { IoArrowBack, IoTimeOutline, IoLocationOutline } from "react-icons/io5";
import { MdOutlineLocalPhone } from "react-icons/md";
import { FaHeart, FaShareAlt, FaDirections } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

function getImage(restaurant) {
  const cuisine = (restaurant.cuisine || "").toLowerCase();
  if (cuisine.includes("turkish"))     return "/images/shawarma.png";
  if (cuisine.includes("arab"))        return "/images/biryani.png";
  if (cuisine.includes("syrian"))      return "/images/shawarma.png";
  if (cuisine.includes("bangladeshi")) return "/images/biryani.png";
  if (cuisine.includes("indian"))      return "/images/indian.png";
  if (cuisine.includes("pakistani"))   return "/images/single.png";
  return "/images/single.png";
}

// Parse hours string like "Mon-Thu 11:00-21:00, Fri 11:00-23:00, Sat-Sun 12:00-22:00"
// into structured rows. Falls back to showing raw string if unparseable.
function parseHours(hoursStr) {
  if (!hoursStr) return [];
  // Try to split by comma
  const parts = hoursStr.split(",").map((s) => s.trim());
  return parts.map((part) => {
    // Expect "Label HH:MM-HH:MM"
    const match = part.match(/^(.+?)\s+(\d{1,2}:\d{2}\s*[-–]\s*\d{1,2}:\d{2})$/);
    if (match) return { label: match[1], time: match[2] };
    return { label: part, time: "" };
  });
}

export default function DetailPanel({ restaurant, onClose }) {
  if (!restaurant) return null;

  const imageSrc  = getImage(restaurant);
  const hoursRows = parseHours(restaurant.hours);

  return (
    <div className="
      w-full md:w-[420px] shrink-0
      flex flex-col bg-white
      md:h-full md:overflow-y-auto
      border-l border-gray-100
      shadow-xl
    "
    style={{ scrollbarWidth: "thin" }}
    >
      {/* ── Hero Image ── */}
      <div className="relative w-full bg-gray-200" style={{ height: "260px", flexShrink: 0 }}>
        <img
          src={imageSrc}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.style.background = "#d1fae5";
          }}
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 50%)"
        }} />

        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-white text-green-900 rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all active:scale-95"
        >
          <IoArrowBack size={18} />
        </button>

        {/* Halal + Rating badges top-right */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          <span className="flex items-center gap-1 text-xs font-bold bg-green-800 text-white px-2.5 py-1 rounded-full shadow">
            <MdVerified size={12} />
            {restaurant.halal_status || "Verified Halal"}
          </span>
          {restaurant.rating && (
            <span className="flex items-center gap-1 text-xs font-bold bg-white text-green-800 px-2.5 py-1 rounded-full shadow">
              ★ {restaurant.rating}
              {restaurant.reviews && (
                <span className="text-gray-500 font-normal ml-0.5">({restaurant.reviews} reviews)</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-4 px-5 pt-5 pb-8">

        {/* Name + actions row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {restaurant.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
              {restaurant.cuisine && (
                <span className="flex items-center gap-1">
                  🍴 {restaurant.cuisine}
                  {restaurant.cuisine.toLowerCase().includes("eastern") ? "" : " Cuisine"}
                </span>
              )}
              {restaurant.price && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="font-medium text-gray-600">{restaurant.price}</span>
                </>
              )}
            </p>
          </div>

          {/* Favourite + Share */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="bg-green-800 text-white rounded-xl p-2.5 hover:bg-green-700 transition-all active:scale-95 shadow">
              <FaHeart size={15} />
            </button>
            <button className="bg-gray-100 text-gray-600 rounded-xl p-2.5 hover:bg-gray-200 transition-all active:scale-95">
              <FaShareAlt size={15} />
            </button>
          </div>
        </div>

        {/* Info grid: Location + Hours side by side */}
        <div className="grid grid-cols-2 gap-3">

          {/* Location card */}
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</p>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <IoLocationOutline size={16} className="text-green-700 shrink-0 mt-0.5" />
              <p className="leading-snug">
                {restaurant.address || restaurant.city || "Address not available"}
              </p>
            </div>
            {restaurant.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MdOutlineLocalPhone size={15} className="text-green-700 shrink-0" />
                <p>{restaurant.phone}</p>
              </div>
            )}
          </div>

          {/* Hours card */}
          <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Opening Hours</p>
            {hoursRows.length > 0 ? (
              <div className="flex flex-col gap-1">
                {hoursRows.map((row, i) => (
                  <div key={i} className="flex justify-between text-xs text-gray-700 gap-1">
                    <span className="text-gray-500 shrink-0">{row.label}</span>
                    <span className="font-medium text-right">{row.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <IoTimeOutline size={15} className="text-green-700 shrink-0 mt-0.5" />
                <p className="leading-snug">{restaurant.hours || "Hours not available"}</p>
              </div>
            )}
          </div>

        </div>

        {/* Review snippet */}
        {restaurant.review && (
          <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3">
            <p className="text-xs text-green-800 leading-relaxed italic">"{restaurant.review}"</p>
          </div>
        )}

        {/* Directions button */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            w-full flex items-center justify-center gap-2
            bg-green-900 hover:bg-green-800 active:scale-[0.98]
            text-white font-bold text-sm
            py-3.5 rounded-2xl shadow-md
            transition-all
          "
        >
          <FaDirections size={16} />
          Open in Maps
        </a>

      </div>
    </div>
  );
}