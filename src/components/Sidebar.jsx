import React from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";

// All 4 images from public/images/
const IMAGES = {
  shawarma: "/images/shawarma.png",
  biryani:  "/images/biryani.png",
  indian:   "/images/indian.png",
  single:   "/images/single.png",
};

function getImage(restaurant) {
  const cuisine = (restaurant.cuisine || "").toLowerCase().trim();
  const name    = (restaurant.name    || "").toLowerCase().trim();

  // Log so you can see exact values coming from the sheet
  console.log("cuisine:", cuisine, "| name:", name);

  if (cuisine.includes("turkish"))               return IMAGES.shawarma;
  if (cuisine.includes("arab"))                  return IMAGES.biryani;
  if (cuisine.includes("indian"))                return IMAGES.indian;
  if (cuisine.includes("pakistani"))             return IMAGES.single;

  // fallback by restaurant name
  if (name.includes("qazan"))                    return IMAGES.shawarma;
  if (name.includes("big bite") || name.includes("konala")) return IMAGES.biryani;
  if (name.includes("gujrat")   || name.includes("handi"))  return IMAGES.indian;

  return IMAGES.single; // default
}

function RestaurantCard({ restaurant, selected, onSelect }) {
  const isSelected  = selected?.id === restaurant.id;
  const isCertified = restaurant.halal_status === "Halal Certified";
  const imgSrc      = getImage(restaurant);

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
        isSelected ? "ring-2 ring-teal-500" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-60 bg-gray-100">
        <img
          src={imgSrc}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, show a colored placeholder
            e.target.style.display = "none";
            e.target.parentElement.style.background = "#d1fae5";
          }}
        />
        <span
          className={`absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isCertified ? "bg-green-700 text-white" : "bg-yellow-500 text-white"
          }`}
        >
          <FaCheckCircle size={10} />
          {restaurant.halal_status || "Halal Options"}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 text-base leading-tight">
            {restaurant.name}
          </h3>
          {restaurant.review && (
            <span className="flex items-center gap-1 text-sm font-semibold text-yellow-500 shrink-0 ml-2">
              <FaStar size={13} />
              {restaurant.review}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-0.5 truncate">{restaurant.address}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {restaurant.cuisine} · {restaurant.city}
        </p>

        {restaurant.open_until && (
          <p className="text-xs text-green-700 font-medium mt-1">
            Open until {restaurant.open_until}
          </p>
        )}

        <div className="flex gap-2 mt-2 flex-wrap">
          <span className="text-xs border border-gray-300 text-gray-600 rounded-full px-2 py-0.5">
            {(restaurant.cuisine || "General").toUpperCase()}
          </span>
          {restaurant.seating && (
            <span className="text-xs border border-gray-300 text-gray-600 rounded-full px-2 py-0.5">
              {restaurant.seating.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ restaurants, selected, onSelect, cuisines, activeCuisine, onCuisineChange, loading, error }) {
  return (
    <div className="w-full md:w-[400px] shrink-0 h-full flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden">

      {/* Header */}
      <div className="bg-[#f0f7f4] px-4 pt-4 pb-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-green-900">Top Halal Restaurants</h2>
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `${restaurants.length} locations found`}
        </p>

        {cuisines.length > 1 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => onCuisineChange(c)}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                  activeCuisine === c
                    ? "bg-green-800 text-white border-green-800"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-600 hover:text-green-700"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mt-3 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          ⚠ {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="w-full h-44 bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : restaurants.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">No restaurants found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          restaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              selected={selected}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;