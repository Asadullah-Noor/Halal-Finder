import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdNearMe } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import { useRestaurants } from "./hooks/useRestaurant";
export default function App() {
  const [active, setActive] = useState("Discover");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);

  const { restaurants, loading, error } = useRestaurants();

  // Get unique cuisines for filter buttons
  const cuisines = ["All", ...new Set(restaurants.map((r) => r.cuisine).filter(Boolean))];

  // Filter by search text and cuisine
  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.city?.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(search.toLowerCase());

    const matchesCuisine = activeCuisine === "All" || r.cuisine === activeCuisine;

    return matchesSearch && matchesCuisine;
  });

  // Near Me button
  function handleNearMe() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserPos([lat, lng]);

        // Find the closest restaurant
        let closest = null;
        let minDist = Infinity;
        filtered.forEach((r) => {
          const dist = Math.hypot(r.latitude - lat, r.longitude - lng);
          if (dist < minDist) {
            minDist = dist;
            closest = r;
          }
        });
        if (closest) setSelected(closest);
        setLocating(false);
      },
      () => {
        alert("Could not get location. Please allow location access.");
        setLocating(false);
      }
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* Navbar */}
      <header className="flex flex-wrap items-center gap-3 px-4 py-3 bg-[#e8f5ee] border-b border-green-200 shadow-sm shrink-0">
        
        {/* Brand */}
        <div>
          <h1 className="text-xl font-bold text-green-900"> Verdental Halal</h1>
          <p className="text-xs text-green-700">Halal Finder · Finland</p>
        </div>

        {/* Nav links */}
        <nav className="flex gap-5 ms-30">
          {["Discover", "Favorites", "Recent"].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`text-sm font-medium transition-all ${
                active === item
                  ? "font-bold text-green-900 underline underline-offset-4"
                  : "text-teal-700 hover:text-teal-900"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Search bar */}
        <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 ms-20 flex-1 min-w-[180px] max-w-sm shadow-sm text-end">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurant or city…"
            className="outline-none bg-transparent w-full text-sm text-gray-700 placeholder-gray-400"
          />
          <FaSearch className="text-gray-400 ml-2 shrink-0" size={13} />
        </div>

        {/* Near Me */}
        <button
          onClick={handleNearMe}
          disabled={locating}
          className="flex items-center gap-1.5 bg-green-900 text-white text-sm px-3 py-2 rounded-2xl hover:bg-green-800 active:scale-95 transition-all disabled:opacity-60"
        >
          <MdNearMe size={16} />
          {locating ? "Locating…" : "Near Me"}
        </button>

        {/* Profile icon */}
        <CgProfile size={28} className="cursor-pointer text-green-900 hover:text-green-700 ml-auto" />
      </header>

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden">
        <Sidebar
          restaurants={filtered}
          selected={selected}
          onSelect={setSelected}
          cuisines={cuisines}
          activeCuisine={activeCuisine}
          onCuisineChange={setActiveCuisine}
          loading={loading}
          error={error}
        />
        <div className="flex-1 h-full relative">
          <MapView
            restaurants={filtered}
            selected={selected}
            onSelect={setSelected}
            userPos={userPos}
          />
        </div>
      </main>

    </div>
  );
}