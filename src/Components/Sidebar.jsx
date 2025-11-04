import React from 'react';
// 1. Use NavLink from react-router-dom
import { NavLink, useNavigate } from 'react-router-dom';

// 2. Import the lucide-react icons
import {
  Home,
  Vote,
  Calendar,
  CalendarCheck,
  Key, // For Guest Pass
  ShoppingCart,
  List,
  User,
  Menu,
  X,
  LogOut // <-- THIS WAS THE MISSING IMPORT
} from 'lucide-react'; 

// 3. NavItem component (identical logic to admin's)
const NavItem = ({ item, isOpen }) => (
  <li>
    <NavLink
      to={item.path}
      // 'end' prop is for the 'Home' link
      end={item.path === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center space-x-3 w-full p-3 rounded-lg transition-colors duration-200
        ${isOpen ? "px-4" : "justify-center"}
        ${isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      {item.icon}
      {isOpen && <span className="font-medium">{item.name}</span>}
    </NavLink>
  </li>
);

// 4. Main Sidebar component
function Sidebar({ isOpen, setIsOpen }) {
  
  // 5. Define the USER menu with the new lucide-react icons
  const menu = [
    { name: "Home", icon: <Home size={20} />, path: "/dashboard" },
    { name: "Voting", icon: <Vote size={20} />, path: "/dashboard/voting" },
    { name: "Book Amenity", icon: <Calendar size={20} />, path: "/dashboard/booking" },
    { name: "My Bookings", icon: <CalendarCheck size={20} />, path: "/dashboard/my-bookings" },
    { name: "Request Guest Pass", icon: <Key size={20} />, path: "/dashboard/request-guest-pass" },
    { name: "My Guest Passes", icon: <Key size={20} />, path: "/dashboard/my-guest-passes" },
    { name: "Marketplace", icon: <ShoppingCart size={20} />, path: "/dashboard/marketplace" },
    { name: "My Listings", icon: <List size={20} />, path: "/dashboard/my-listings" },
    { name: "Profile", icon: <User size={20} />, path: "/dashboard/profile" },
  ];

  return (
    <nav
      className={`h-screen bg-gray-900 text-gray-200 shadow-lg
                  flex flex-col 
                  ${isOpen ? 'w-64' : 'w-20'}
                  transition-all duration-300 relative`}
    >
      {/* 6. Header section with new toggle button (like admin) */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
        {isOpen && <div className="text-xl font-bold text-white">Aetheria</div>}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white"
        >
            {/* Use the Menu/X toggle */}
            {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 7. Navigation Links */}
      <nav className="flex-1 space-y-2 p-3 overflow-y-auto">
        {menu.map((item) => (
          <NavItem key={item.name} item={item} isOpen={isOpen} />
        ))}
      </nav>

      {/* 8. NO LOGOUT BUTTON
          This is correct, as your logout button is in the UserLayout's top bar.
          We add an invisible spacer at the bottom to match the admin's layout,
          which pushes the menu items up.
      */}
      <div className="p-3 border-t border-transparent" style={{ opacity: 0 }}>
         <div className="flex items-center space-x-3 w-full p-3">
            <LogOut size={20} />
            {isOpen && <span className="font-medium">Logout</span>}
         </div>
      </div>

    </nav>
  );
}

export default Sidebar;