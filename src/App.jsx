import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { MdNearMe } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';

export const RESTAURANTS = [
  { id: 1, name: "Qazan Restaurant", city: "Helsinki", latitude: 60.2119872, longitude: 25.0802481, address:"itakatu 1-7,00930 Helsinki"},
  { id: 2, name: "Big Bite Konala", city: "Espo", latitude: 60.2052812, longitude: 24.7929246, address:"Vanha HameenKylantie 9,00390 Helsinki"},
];
const App = () => {
  const [active, setActive] = useState("Discover");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = RESTAURANTS.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.city.toLowerCase().includes(query.toLowerCase())
  );
  const navItems = ["Discover", "Favorites", "Recent"];
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <header className="flex flex-wrap bg-teal-100 gap-4 p-4 items-center shrink-0">
        <div>  <h1 className="text-2xl font-bold text-green-950 whitespace-nowrap">
          Verdental Halal
        </h1>
        <p>Halal Finder Finland</p></div>
        <nav className="flex text-teal-700 font-mono gap-6 cursor-pointer flex-wrap">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`transition-all ${
                active === item
                  ? "font-bold underline underline-offset-4"
                  : "hover:text-teal-900"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 flex-1 min-w-[180px]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Halal Restaurant..."
            className="outline-none bg-transparent w-full text-sm"
          />
          <FaSearch className="text-gray-400 ml-2 shrink-0" />
        </div>
        <button className="bg-green-900 text-white rounded-2xl flex items-center gap-1 px-3 py-2 hover:bg-green-800 transition-colors">
          <MdNearMe />
          <span className="text-sm">Near me</span>
        </button>

        <CgProfile size={28} className="cursor-pointer text-green-900 hover:text-green-700 transition-colors" />
      </header>

      {/* Map + Sidebar split */}
      <main className="flex flex-1 overflow-hidden">
        <MapView
          restaurants={filtered}
          selected={selected}
          onSelect={setSelected}
        />
        <Sidebar
          restaurants={filtered}
          selected={selected}
          onSelect={setSelected}
        />
      </main>
    </div>
  );
};

export default App;