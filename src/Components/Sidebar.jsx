import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Use NavLink for active styling
// Import icons
import {
  HiChartPie,
  HiTicket,
  HiUserCircle,
  HiChevronLeft,
  HiCalendar,
  HiLogout,
  HiOutlineShoppingCart,
  HiOutlineCollection,
  // --- 1. IMPORT NEW ICON ---
  HiOutlineIdentification 
} from "react-icons/hi"; 

// Helper component for NavLink items
const NavItem = ({ to, icon, text, isOpen }) => (
  <li>
    <NavLink
      to={to}
      // Add active styling using NavLink's isActive prop
      className={({ isActive }) =>
        `flex items-center py-3 px-5 transition-colors duration-200 rounded-md mx-2 my-1 ${ // Added rounding, margin
          isActive
            ? 'bg-blue-600 text-white shadow-inner' // Active state style
            : 'hover:bg-gray-700 hover:text-white'   // Hover state style
        }`
      }
      // Use 'end' prop for exact matching on parent routes like /dashboard
      end={to === '/dashboard'}
    >
      {/* Ensure icon is a valid React element before cloning */}
      {React.isValidElement(icon) ? React.cloneElement(icon, { size: "1.5rem" }) : null}
      {/* Conditionally render the text with smooth transition */}
       <span className={`ml-4 overflow-hidden transition-all duration-300 ${isOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
         {text}
       </span>
    </NavLink>
  </li>
);


function Sidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        navigate('/login'); // Redirect to login page
        // Optionally: You might want to also clear any global state (Redux, Context) here
    };

  return (
    <nav
      className={`h-screen bg-gray-900 text-gray-200 shadow-lg
                  flex flex-col // Make sidebar a flex column
                  ${isOpen ? 'w-64' : 'w-20'}
                  transition-all duration-300 relative`}
    >

      {/* Logo/Title Section */}
      <div className="p-5 flex items-center justify-between"> {/* Adjusted for toggle button */}
        <div className="flex items-center overflow-hidden">
             {/* Replace text with an icon or logo if you have one */}
             {/* <img src="/path/to/your/logo.svg" alt="Logo" className="h-8 mr-2" /> */}
             <span className={`text-2xl font-bold text-white whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
               Aetheria
             </span>
        </div>
         {/* Toggle Button - Moved near top for better UX */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-all"
        >
            <HiChevronLeft
            size="1.5rem"
            className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`}
            />
        </button>
      </div>

       {/* Subtitle (only shown when open) */}
       {isOpen && (
            <p className="text-sm text-gray-400 px-5 mb-5 -mt-2">Society Management</p>
       )}


      {/* Navigation Links List */}
      <ul className="flex-grow mt-4"> {/* Use flex-grow to push logout down */}
        <NavItem to="/dashboard" icon={<HiChartPie />} text="Home" isOpen={isOpen} />
        <NavItem to="/dashboard/voting" icon={<HiTicket />} text="Voting" isOpen={isOpen} />
        {/* --- Booking Links --- */}
        <NavItem to="/dashboard/booking" icon={<HiCalendar />} text="Book Amenity" isOpen={isOpen} />
        <NavItem to="/dashboard/my-bookings" icon={<HiCalendar />} text="My Bookings" isOpen={isOpen} />
        {/* --- 2. ADD GUEST PASS LINKS --- */}
        <NavItem to="/dashboard/request-guest-pass" icon={<HiOutlineIdentification />} text="Request Guest Pass" isOpen={isOpen} />
        <NavItem to="/dashboard/my-guest-passes" icon={<HiOutlineIdentification />} text="My Guest Passes" isOpen={isOpen} />
        {/* --- Marketplace Links --- */}
        <NavItem to="/dashboard/marketplace" icon={<HiOutlineShoppingCart />} text="Marketplace" isOpen={isOpen} />
        <NavItem to="/dashboard/my-listings" icon={<HiOutlineCollection />} text="My Listings" isOpen={isOpen} />
        {/* --- End Marketplace Links --- */}
        <NavItem to="/dashboard/profile" icon={<HiUserCircle />} text="Profile" isOpen={isOpen} />
      </ul>

      {/* Logout Button at the bottom */}
       <div className="mt-auto p-2"> {/* Container to push to bottom */}
         <button
           onClick={handleLogout}
           className="flex items-center w-full py-3 px-5 text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors duration-200 rounded-md mx-2 my-1"
         >
           <HiLogout size="1.5rem" />
           <span className={`ml-4 overflow-hidden transition-all duration-300 ${isOpen ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
             Logout
           </span>
         </button>
       </div>
    </nav>
  );
}

export default Sidebar;