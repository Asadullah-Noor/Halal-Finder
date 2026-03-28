import React from "react";

// ── Cuisine → image mapping ───────────────────────────────────────────────────
function getImage(restaurant) {
  const cuisine = (restaurant.cuisine || "").toLowerCase();

  if (cuisine.includes("turkish"))     return "/images/shawarma.png";
  if (cuisine.includes("arab"))        return "/images/biryani.png";
  if (cuisine.includes("syrian"))      return "/images/shawarma.png";  // Qazan is Syrian
  if (cuisine.includes("bangladeshi")) return "/images/biryani.png";   // Big Bite is Bangladeshi
  if (cuisine.includes("indian"))      return "/images/indian.png";
  if (cuisine.includes("pakistani"))   return "/images/single.png";

  return "/images/single.png"; // default fallback
}

function RestaurantCard({ restaurant, selected, onSelect }) {
  const isSelected  = selected?.id === restaurant.id;
  const isCertified = restaurant.halal_status === "Halal Certified";
  const imageSrc    = getImage(restaurant);

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className={`
        bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer
        transition-all duration-200 hover:shadow-md hover:scale-[1.01]
        ${isSelected ? "ring-2 ring-teal-500" : ""}
      `}
    >
      {/* ── Food image ── */}
      <div className="relative w-full h-30   bg-gray-100">
        <img
          src={imageSrc}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.style.background = "#d1fae5";
          }}
        />

        {/* Halal badge — top right corner of the image */}
        <span
          className={`
            absolute top-3 right-3 text-xs  px-2 py-1 rounded-full
            ${isCertified ? "bg-green-900 text-gray-200" : "bg-green-900 text-gray-200"}
          `}
        >
          ✓ {restaurant.halal_status || "Halal"}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="p-3 space-y-1.5">

        {/* Restaurant name */}
        <h3 className="font-bold text-gray-900 text-base leading-tight">
          {restaurant.name}
        </h3>

         {/* Address — from "address" column */}
        {restaurant.address && (
          <p className="text-xs text-gray-400 truncate">
             {restaurant.address}
          </p>
        )}

        

        {/* Tag pill for cuisine type */}
        <div className="flex-1 flex items-center gap-2">
  <span className="text-xs border border-gray-300 bg-green-200 text-gray-600 rounded-full px-2 py-0.5">
    {(restaurant.cuisine || "General").toUpperCase()}
  </span>

  <span className="text-xs bg-gray-200 rounded-sm px-2 py-0.5">
    Family Dining
  </span>
</div>

      </div>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
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
function Sidebar({
  restaurants,
  selected,
  onSelect,
  cuisines,
  activeCuisine,
  onCuisineChange,
  loading,
  error,
}) {
  return (
    <div className="w-full md:w-[400px] shrink-0 h-full flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden">
      {/* ── Header ── */}
      <div className="bg-[#f0f7f4] px-4 pt-4 pb-3 border-b border-gray-200">

        <h2 className="text-lg font-bold text-green-950">Top Halal Restaurants</h2>

        <p className="text-sm text-gray-500 mb-3">
          {loading ? "Loading..." : `${restaurants.length} locations found`}
        </p>

        {/* Cuisine filter buttons */}
        {cuisines.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {cuisines.map((cuisineName) => (
              <button
                key={cuisineName}
                onClick={() => onCuisineChange(cuisineName)}
                className={`
                  text-xs px-3 py-1 rounded-full border font-medium transition-all
                  ${activeCuisine === cuisineName
                    ? "bg-green-800 text-white border-green-800"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-600 hover:text-green-700"
                  }
                `}
              >
                {cuisineName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mt-3 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          ⚠ {error}
        </div>
      )}

      {/* Scrollable card list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {/* CASE 1: Still loading */}
        {loading && (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        )}

        {/* CASE 2: Loaded but nothing matches */}
        {!loading && restaurants.length === 0 && <EmptyState />}

        {/* CASE 3: Show the cards */}
        {!loading && restaurants.length > 0 &&
          restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              selected={selected}
              onSelect={onSelect}
            />
          ))
        }

      </div>
    </div>
  );
}

export default Sidebar;