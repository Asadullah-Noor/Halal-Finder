import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { MdNearMe } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import MapView from './components/MapView';
const App = () => {
  const [active, setActive] = useState("Discover")

  return (
    <div>
      <div className='flex flex-wrap bg-teal-100 gap-4 p-5 items-center'>
        <h1 className='text-4xl font-bold text-green-950'>Verdental Halal</h1>

        <div className='flex text-teal-700 font-mono gap-6 cursor-pointer flex-wrap'>
          <p
            className={active === "Discover" ? "font-bold underline" : ""}
            onClick={() => setActive("Discover")}
          >Discover</p>
          <p
            className={active === "Favorites" ? "font-bold underline" : ""}
            onClick={() => setActive("Favorites")}
          >Favorites</p>
          <p
            className={active === "Recent" ? "font-bold underline" : ""}
            onClick={() => setActive("Recent")}
          >Recent</p>
        </div>

        <div className="flex items-center bg-gray-100 rounded-2xl px-3 py-2 flex-1 min-w-[180px]">
          <input type="text" placeholder='Search Halal Restaurant.....' className='outline-none bg-transparent w-full' />
          <FaSearch className="text-black ml-2 cursor-pointer" />
        </div>

        <div className='bg-green-900 text-white rounded-2xl flex items-center cursor-pointer p-1'>
          <MdNearMe className="ml-2 cursor-pointer me-2" />
          <p>Near me</p>
        </div>

        <CgProfile size={28} className="cursor-pointer text-green-900" />
      </div>
      <div className='grid-cols-2'>
        <MapView/>
      </div>
    </div>
  )
}

export default App