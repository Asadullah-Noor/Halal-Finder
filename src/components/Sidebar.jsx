import React from "react";

// ── Cuisine → image mapping ───────────────────────────────────────────────────
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

// ── Distance helper ───────────────────────────────────────────────────────────
function getDistance(r, userPos) {
  if (!userPos || !r.latitude || !r.longitude) return null;
  const [lat, lng] = userPos;
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(r.latitude - lat);
  const dLng = toRad(r.longitude - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(r.latitude)) * Math.sin(dLng / 2) ** 2;
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return km < 1 ? `${Math.round(km * 1000)}m away` : `${km.toFixed(1)}km away`;
}

// ── Restaurant Card ───────────────────────────────────────────────────────────
function RestaurantCard({ restaurant, selected, onSelect, userPos }) {
  const isSelected = selected?.id === restaurant.id;
  const imageSrc   = getImage(restaurant);
  const distance   = getDistance(restaurant, userPos);

  const subParts = [
    restaurant.cuisine ? `Authentic ${restaurant.cuisine} Cuisine` : null,
    distance || restaurant.city || null,
  ].filter(Boolean);

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className={`
        shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer
        transition-all duration-200 hover:shadow-md hover:scale-[1.01]
        ${isSelected ? "ring-2 ring-teal-500" : ""}
      `}
    >
      {/* Image — fixed height, never flexes */}
      <div className="relative w-full bg-gray-100" style={{ height: "180px" }}>
        <img
          src={imageSrc}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.style.background = "#d1fae5";
          }}
        />
        {/* Halal badge */}
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold bg-green-800 text-white px-2.5 py-1 rounded-full shadow-md">
          ✓ {restaurant.halal_status || "Halal"}
        </span>
      </div>

      {/* Card body — natural height, never compressed */}
      <div className="px-3 pt-3 pb-3 space-y-2">

        {/* Name + Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-[15px] leading-snug">
            {restaurant.name}
          </h3>
            <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-green-950 bg-green-100 border border-green-200 rounded-full px-2 py-0.5">
              ★ 4.8
            </span>
    
        </div>

        {/* Cuisine · Distance */}
        {subParts.length > 0 && (
          <p className="text-xs text-gray-500 leading-relaxed">
            {subParts.join(" · ")}
          </p>
        )}

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {restaurant.cuisine && (
            <span className="text-[11px] font-semibold bg-green-100 text-gray-700 rounded px-2.5 py-0.5 uppercase tracking-wide">
              {restaurant.cuisine}
            </span>
          )}
          
        
        </div>

      </div>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="shrink-0 bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
      <div className="w-full bg-gray-200" style={{ height: "180px" }} />
      <div className="px-3 pt-3 pb-3 space-y-2">
        <div className="flex justify-between gap-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded-full w-10" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="text-center text-gray-400 py-12">
      <p className="text-3xl mb-2">🔍</p>
      <p className="font-medium">No restaurants found</p>
      <p className="text-sm mt-1">Try a different search or filter</p>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  restaurants,
  selected,
  onSelect,
  cuisines,
  activeCuisine,
  onCuisineChange,
  loading,
  error,
  userPos,
}) {
  return (
    <div className="w-full md:w-[400px] shrink-0 flex flex-col bg-gray-50 border-r border-gray-200
      md:h-full md:overflow-hidden">

      {/* Header — fixed, never scrolls */}
      <div className="flex-shrink-0 bg-[#f0f7f4] px-4 pt-4 pb-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-green-950">Top Halal Restaurants</h2>
        <p className="text-sm text-gray-500 mb-3">
          {loading ? "Loading..." : `${restaurants.length} locations found`}
        </p>

        {cuisines.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => onCuisineChange(c)}
                className={`
                  text-xs px-3 py-1 rounded-full border font-medium transition-all
                  ${activeCuisine === c
                    ? "bg-green-800 text-white border-green-800"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-600 hover:text-green-700"
                  }
                `}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="flex-shrink-0 mx-4 mt-3 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          ⚠ {error}
        </div>
      )}

      {/*
       * SCROLL CONTAINER
       * flex-1      → fills remaining height after header
       * min-h-0     → allows it to shrink so overflow-y-auto activates
       * overflow-y-auto → scroll when cards exceed the height
       *
       * Cards inside use shrink-0 so they NEVER compress —
       * they just stack up and the container scrolls.
       */}
      <div className="md:flex-1 md:min-h-0 md:overflow-y-auto p-4 flex flex-col gap-4">

        {loading && (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        )}

        {!loading && restaurants.length === 0 && <EmptyState />}

        {!loading && restaurants.length > 0 &&
          restaurants.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              selected={selected}
              onSelect={onSelect}
              userPos={userPos}
            />
          ))
        }

      </div>
    </div>
  );
}

export default Sidebar;