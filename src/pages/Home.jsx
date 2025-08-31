import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import homeBanner from "../assets/images/home_banner.png";
import { IoLocationSharp } from "react-icons/io5";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch admins from backend on searchQuery change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setAdmins([]);
      return;
    }

    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ Only filter by username (you can add currentSession later if needed)
        const filtered = res.data.filter((admin) =>
          admin.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        console.log("Filtered admins:", filtered);
        setAdmins(filtered);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      }
    };

    fetchAdmins();
  }, [searchQuery]);

  return (
    <div className="relative h-[100dvh] px-2 overflow-hidden bg-[radial-gradient(circle_at_bottom_right,_orange_1%,_white_60%)]">
      <div className="flex">   
        <h1 className="flex-1 text-4xl tracking-wide font-bold mt-1 md:mt-6 md:ml-3 md:text-6xl font-serif drop-shadow-[0_0_1px_rgb(249,115,22)]">Ziller</h1>
        {/* ✅ Desktop Buttons */}
        <div className="hidden flex-1 md:flex justify-center items-end">
          <div className="flex gap-x-20 justify-center items-center">
            <button
              className="px-4 py-2 rounded-md hover:bg-orange-600 hover:text-white text-lg font-semibold"
              onClick={() => navigate("/tickets")}
            >
              History
            </button>
            <button
              className="px-4 py-2 rounded-md  hover:bg-orange-600 hover:text-white text-lg font-semibold"
              onClick={() => navigate("/admin")}
            >
              Admin
            </button>
            <button
              className="px-4 py-2 rounded-md hover:bg-orange-600 hover:text-white text-lg font-semibold"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 Search bar + actions */}
      <div className="flex items-center justify-between md:justify-center gap-3 mt-4">
        {/* Search bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search the bus you travelling..."
          className="px-3 py-2 w-[85%] md:ml-10 md:h-12 text-lg font-semibold rounded-lg border border-black/70 outline-none focus:border-2 focus:border-gray-900 placeholder:text-lg placeholder:text-gray-500"
        />

        <IoLocationSharp className="hidden md:flex text-5xl text-orange-500 border-black"/>

        {/* ☰ Mobile Hamburger */}
        <div className="relative md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-3xl p-1 font-bold bg-transparent border-none cursor-pointer"
          >
            ☰
          </button>
        </div>
      </div>

      {/* 🔎 Image centered section */}
      <div className="flex flex-1 h-full w-full items-center justify-center">
        <div className="h-full w-full flex justify-center items-center text-5xl md:text-6xl px-2">
          <div className="hidden md:flex flex-col gap-y-6 font-bold">
            <p className="font-royal font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">No more</p>  
            <p className="font-royal font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">regret for</p> 
            <p className="font-royal font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">the change</p> 
          </div>
          <div className="md:hidden font-serif flex flex-col gap-y-3 flex-1 font-bold">
            <p className="font-royal text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">No more</p>
            <p className="font-royal text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">regret</p> 
            <p className="font-royal text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">for the </p> 
            <p className="font-royal text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">change</p> 
          </div>
          <div className="flex-1 md:hidden ">
            <img 
              src={homeBanner} 
              alt="banner" 
              className="h-full object-contain" 
            />
          </div>
          <img 
            src={homeBanner} 
            alt="banner" 
            className="h-full hidden md:block object-contain" 
          />
        </div>
      </div>

      {/* 🔎 Results */}
      {searchQuery && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[90%] md:w-[50%] bg-white rounded-lg shadow-md p-3 z-20">
          {admins.length > 0 ? (
            <ul className="list-none p-0">
              {admins.map((admin) => (
                <li
                  key={admin.id}  // ✅ use correct id
                  className="py-2 px-3 cursor-pointer hover:bg-gray-100 rounded-md font-semibold"
                  onClick={() =>
                    navigate(`/bus/${admin.id}`, {
                      state: { id: admin.id, name: admin.username },
                    })
                  }
                >
                  🚌 {admin.username}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No admins found</p>
          )}
        </div>
      )}

      {menuOpen && (
        <div 
          onClick={() => setMenuOpen(false)}
          className="absolute top-0 right-0 flex justify-end items-start h-full w-full bg-black/30 backdrop-blur-sm z-30"
        >
          <div onClick={(e) => e.stopPropagation()} className="flex flex-col font-bold bg-white py-4 gap-y-2 rounded-b-xl w-full justify-center items-center mx-2">
            <button
              className="w-full text-center border-b border-black rounded-lg text-base py-3 px-4 hover:bg-gray-100"
              onClick={() => {
                setMenuOpen(false);
                navigate("/tickets");
              }}
            >
              History
            </button>

            <button
              className="w-full text-center border-b border-black rounded-lg text-base py-3 px-3 hover:bg-gray-100"
              onClick={() => {
                setMenuOpen(false);
                navigate("/admin");
              }}
            >
              Admin
            </button>

            <button
              className="w-full text-center rounded-lg text-base py-3 px-3 hover:bg-gray-100"
              onClick={() => {
                setMenuOpen(false);
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
