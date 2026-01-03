import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaWallet,
  FaHistory,
  FaUser,
  FaImage,
  FaBars,
  FaCog,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function MainDashBord() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  /* ===== BOTTOM NAV CONFIG ===== */
  const bottomNavItems = [
    { to: "/dashbord/my-team", label: "My Team", icon: <FaUsers size={20} /> },
    { to: "/dashbord/wallet", label: "Wallet", icon: <FaWallet size={20} /> },
    {
      to: "/dashbord",
      label: "Dashboard",
      icon: <MdDashboard  size={24}/>,
    },
    {
      to: "/dashbord/history",
      label: "History",
      icon: <FaHistory size={20} />,
    },
    { to: "/dashbord/profile", label: "Profile", icon: <FaUser size={20} /> },
  ];

  const menuItems = [
    {
      to: "/dashbord/nft-history",
      label: "NFT History",
      icon: <FaImage size={20} />,
    },
    {
      to: "/dashbord/reports",
      label: "Reports",
      icon: <FaChartBar size={20} />,
    },
    { to: "/dashbord/settings", label: "Settings", icon: <FaCog size={20} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto relative">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMenu(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaBars size={18} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#0f7a4a] text-white flex items-center justify-center font-bold text-sm">
          A
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto pb-20">
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {/* ===== BOTTOM NAVIGATION ===== */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm sm:max-w-md md:max-w-lg bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex items-center justify-between">
          {bottomNavItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-3 transition-all duration-300 ${
                  index === 2
                    ? isActive
                      ? "bg-[#0f7a4a] text-white rounded-full -mt-4 shadow-lg"
                      : "bg-gray-400 text-white rounded-full  -mt-4 shadow-lg"
                    : isActive
                    ? "text-[#0f7a4a] "
                    : "text-gray-500 hover:text-[#0f7a4a]"
                }`
              }
            >
              {item.icon}
              {index !== 2 && (
                <span className="text-xs mt-1">{item.label}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ===== HAMBURGER MENU ===== */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 flex">
          <div className="w-80 bg-white h-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Menu</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-[#0f7a4a]/10 text-[#0f7a4a] font-bold"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="text-[#0f7a4a]">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}

              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/login");
                }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 text-red-600 w-full"
              >
                <FaSignOutAlt size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setShowMenu(false)}></div>
        </div>
      )}
    </div>
  );
}
