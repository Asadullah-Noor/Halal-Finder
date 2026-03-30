import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdNearMe } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import DetailPanel from "./components/DetailPanel";
import { useRestaurants } from "./hooks/useRestaurants";

export default function App() {
  const [active, setActive]               = useState("Discover");
  const [search, setSearch]               = useState("");
  const [activeCuisine, setActiveCuisine] = useState("All");
  const [userPos, setUserPos]             = useState(null);
  const [locating, setLocating]           = useState(false);

  // Two separate selection states:
  // sidebarSelected → user clicked a Sidebar card  → SelectedCard floats on map
  // mapSelected     → user clicked a map pin        → DetailPanel replaces sidebar
  const [sidebarSelected, setSidebarSelected] = useState(null);
  const [mapSelected, setMapSelected]         = useState(null);

  const { restaurants, loading, error } = useRestaurants();

  const cuisines = ["All", ...new Set(restaurants.map((r) => r.cuisine).filter(Boolean))];

  const filtered = restaurants.filter((r) => {
    const matchesSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.city?.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = activeCuisine === "All" || r.cuisine === activeCuisine;
    return matchesSearch && matchesCuisine;
  });

  // Sidebar card clicked → floating SelectedCard on map, close DetailPanel
  function handleSidebarSelect(restaurant) {
    setSidebarSelected(restaurant);
    setMapSelected(null);
  }

  // Map pin clicked → full DetailPanel, close SelectedCard
  function handleMapSelect(restaurant) {
    setMapSelected(restaurant);
    setSidebarSelected(null);
  }

  function handleDetailClose() {
    setMapSelected(null);
  }

  function handleSelectedCardClose() {
    setSidebarSelected(null);
  }

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
        let closest = null;
        let minDist = Infinity;
        filtered.forEach((r) => {
          const dist = Math.hypot(r.latitude - lat, r.longitude - lng);
          if (dist < minDist) { minDist = dist; closest = r; }
        });
        if (closest) setSidebarSelected(closest);
        setLocating(false);
      },
      () => {
        alert("Could not get location. Please allow location access.");
        setLocating(false);
      }
    );
  }

  // The pin that is visually highlighted + triggers FlyTo
  const highlightedPin = mapSelected || sidebarSelected;

  // Show DetailPanel layout only when a map pin was clicked
  const isDetailView = !!mapSelected;

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* ── Navbar ── */}
      <header className="flex flex-wrap items-center gap-2 px-3 py-2 md:px-4 md:py-3 bg-[#e8f5ee] border-b border-green-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-base md:text-xl font-bold text-green-900">Verdental Halal</h1>
          <p className="text-[10px] md:text-xs text-green-700">Halal Finder · Finland</p>
        </div>

        <nav className="hidden md:flex gap-5 ms-30">
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

        <div className={`flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 flex-1 min-w-[120px] max-w-sm shadow-sm md:ms-20 ${isDetailView ? "hidden md:flex" : "flex"}`}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurant or city…"
            className="outline-none bg-transparent w-full text-sm text-gray-700 placeholder-gray-400"
          />
          <FaSearch className="text-gray-400 ml-2 shrink-0" size={13} />
        </div>

        <button
          onClick={handleNearMe}
          disabled={locating}
          className="flex items-center gap-1.5 bg-green-900 text-white text-sm px-3 py-2 rounded-2xl hover:bg-green-800 active:scale-95 transition-all disabled:opacity-60"
        >
          <MdNearMe size={16} />
          <span className="hidden sm:inline">{locating ? "Locating…" : "Near Me"}</span>
        </button>

        <CgProfile size={26} className="cursor-pointer text-green-900 hover:text-green-700 ml-auto" />
      </header>

      {/*
       * DEFAULT VIEW (mapSelected = null):
       *   [Sidebar | MapView]  ← MapView shows floating SelectedCard if sidebarSelected is set
       *
       * DETAIL VIEW (mapSelected is set):
       *   [MapView | DetailPanel]
       */}
      <main className="flex flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">

        {isDetailView ? (
          <>
            {/* Map — left */}
            <div className="w-full shrink-0 relative h-[400px] md:flex-1 md:h-full md:shrink md:overflow-hidden">
              <MapView
                restaurants={filtered}
                selected={highlightedPin}
                onSidebarSelect={handleSidebarSelect}
                onMapSelect={handleMapSelect}
                sidebarSelected={sidebarSelected}
                onSelectedCardClose={handleSelectedCardClose}
                userPos={userPos}
                onLocate={handleNearMe}
              />
            </div>

            {/* DetailPanel — right */}
            <div className="w-full shrink-0 md:w-[420px] md:h-full md:overflow-hidden">
              <DetailPanel
                restaurant={mapSelected}
                onClose={handleDetailClose}
              />
            </div>
          </>
        ) : (
          <>
            {/* Sidebar — left */}
            <div className="w-full shrink-0 md:w-[400px] md:h-full md:overflow-hidden">
              <Sidebar
                restaurants={filtered}
                selected={sidebarSelected}
                onSelect={handleSidebarSelect}
                cuisines={cuisines}
                activeCuisine={activeCuisine}
                onCuisineChange={setActiveCuisine}
                loading={loading}
                error={error}
                userPos={userPos}
              />
            </div>

            {/* Map — right, with floating SelectedCard when sidebarSelected */}
            <div className="w-full shrink-0 relative h-[400px] md:flex-1 md:h-full md:shrink md:overflow-hidden">
              <MapView
                restaurants={filtered}
                selected={highlightedPin}
                onSidebarSelect={handleSidebarSelect}
                onMapSelect={handleMapSelect}
                sidebarSelected={sidebarSelected}
                onSelectedCardClose={handleSelectedCardClose}
                userPos={userPos}
                onLocate={handleNearMe}
              />
            </div>
          </>
        )}

      </main>
    </div>
  );
}