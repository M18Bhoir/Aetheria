import React from 'react';
// Import icons
import { 
  HiChartPie, 
  HiTicket, 
  HiBell, 
  HiUserCircle, 
  HiChevronLeft 
} from "react-icons/hi";

// The component now accepts props to control its state
function Sidebar({ isOpen, setIsOpen }) {
  return (
    // Sidebar Container:
    // Use a ternary operator to change the width based on 'isOpen'
    <nav 
      className={`h-screen bg-gray-900 text-gray-200 shadow-lg 
                  ${isOpen ? 'w-64' : 'w-20'} 
                  transition-all duration-300 relative`}
    >
      
      {/* Logo/Title Section */}
      <div className="p-5">
        <h1 className="text-3xl font-bold text-white">
          {/* Show 'A' when collapsed, 'Aetheria' when open */}
          {isOpen ? 'Aetheria' : 'A'}
        </h1>
        {/* Only show the subtitle if the sidebar is open */}
        {isOpen && (
          <p className="text-sm text-gray-400">Society Management</p>
        )}
      </div>

      {/* Navigation Links List */}
      <ul className="mt-10">
        {/* We add icons to each link */}
        <li>
          <a 
            href="/dashboard" 
            className="flex items-center py-3 px-5 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <HiChartPie size="1.5rem" />
            {/* Conditionally render the text */}
            <span className={`ml-4 ${!isOpen && 'hidden'}`}>Home</span>
          </a>
        </li>
        <li>
          <a 
            href="/dashboard/voting" 
            className="flex items-center py-3 px-5 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <HiTicket size="1.5rem" />
            <span className={`ml-4 ${!isOpen && 'hidden'}`}>Voting</span>
          </a>
        </li>
        <li>
          <a 
            href="/dashboard/notices" 
            className="flex items-center py-3 px-5 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <HiBell size="1.5rem" />
            <span className={`ml-4 ${!isOpen && 'hidden'}`}>Notices</span>
          </a>
        </li>
        <li>
          <a 
            href="/dashboard/profile" 
            className="flex items-center py-3 px-5 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <HiUserCircle size="1.5rem" />
            <span className={`ml-4 ${!isOpen && 'hidden'}`}>Profile</span>
          </a>
        </li>
      </ul>
      
      {/* Toggle Button at the bottom */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 p-2 
                   bg-gray-700 hover:bg-gray-600 rounded-full transition-all"
      >
        {/* Rotate the icon based on the state */}
        <HiChevronLeft 
          size="1.5rem" 
          className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`} 
        />
      </button>

    </nav>
  );
}

export default Sidebar;