import React from 'react';
import { FaStar, FaCheckCircle } from "react-icons/fa";

const RESTAURANTS = [
  { id: 1, name: "Qazan Restaurant", city: "Helsinki", cuisine: "Turkish", latitude: 60.2119872, longitude: 25.0802481, address: "Itakatu 1-7, 00930 Helsinki", img: "single shwarma.png", halal_status: "Halal Certified", review: "4.8", seating: "Dining", distance: "1.2km" },
  { id: 2, name: "Big Bite Konala", city: "Espoo", cuisine: "Arabic", latitude: 60.2052812, longitude: 24.7929246, address: "Vanha Hämeenkyläntie 9, 00390 Helsinki", img: "biryani.png", halal_status: "Halal Certified", review: "4.5", seating: "Family", distance: "2.4km" },
  { id: 3, name: "Gujrati Handi", city: "Espoo", cuisine: "Indian", latitude: 60.2052802, longitude: 24.7919246, address: "Vanha Hämeenkyläntie 9, 00390 Helsinki", img: "indian.png", halal_status: "Halal Friendly", review: "4.3", seating: "Friendly", distance: "3.1km" },
];

const RestaurantCard = ({ restaurant, selected, onSelect }) => {
  const isCertified = restaurant.halal_status === "Halal Certified";

  return (
    <div
      onClick={() => onSelect?.(restaurant)}
      className={`bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
        selected?.id === restaurant.id ? "ring-2 ring-teal-500" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-full h-44">
        <img
          src={restaurant.img}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {/* Halal badge */}
        <span
          className={`absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isCertified
              ? "bg-green-600 text-white"
              : "bg-yellow-400 text-white"
          }`}
        >
          <FaCheckCircle size={10} />
          {restaurant.halal_status}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Name + Rating */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 text-base leading-tight">
            {restaurant.name}
          </h3>
          <span className="flex items-center gap-1 text-sm font-semibold text-yellow-500 shrink-0 ml-2">
            <FaStar size={13} />
            {restaurant.review}
          </span>
        </div>

        {/* Cuisine + Distance */}
        <p className="text-sm text-gray-500 mt-0.5">
          {restaurant.cuisine} · {restaurant.distance} away
        </p>

        {/* Tags */}
        <div className="flex gap-2 mt-2">
  <span className="text-xs border border-gray-300 text-gray-600 rounded-full px-2 py-0.5">
    {(restaurant.cuisine ?? "General").toUpperCase()}
  </span>
  <span className="text-xs border border-gray-300 text-gray-600 rounded-full px-2 py-0.5">
    {(restaurant.seating ?? "Dine-in").toUpperCase()}
  </span>
</div>
      </div>
    </div>
  );
};

const Sidebar = ({ restaurants = RESTAURANTS, selected, onSelect }) => {
  return (
    <div className="w-1/2 h-full overflow-y-auto bg-gray-50 border-l border-gray-200">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 z-10 px-4 pt-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Nearby Restaurants</h2>
        <p className="text-sm text-gray-500">{restaurants.length} locations found</p>
      </div>

      {/* Cards */}
      <div className="p-4 flex flex-col gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            selected={selected}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;