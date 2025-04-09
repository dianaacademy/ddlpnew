import { HiX } from "react-icons/hi";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";
import routes from "../../../../routes";
import { PanelLeft, ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ open, onClose, onExpandChange }) => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  // Handle toggle click
  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    // Notify parent component about the change
    if (onExpandChange) {
      onExpandChange(newExpanded);
    }
  };

  // Get sidebar width based on state
  const sidebarWidth = expanded ? "w-64" : "w-20";

  // Check if route is active
  const isActiveRoute = (path) => {
    return location.pathname.includes(path);
  };

  useEffect(() => {
    // Notify parent about initial expanded state
    if (onExpandChange) {
      onExpandChange(expanded);
    }
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out z-10 ${sidebarWidth} ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-[13px] border-b">
        <div className="flex items-center space-x-2">
          <img width={40} height={40} src={logo} alt="diana logo" />
          {expanded && <span className="font-bold text-lg"></span>}
        </div>
        
        <div className="flex items-center">
          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          
          {/* Close Button (Mobile only) */}
          <span className="cursor-pointer xl:hidden ml-2" onClick={onClose}>
            <HiX size={20} />
          </span>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="overflow-y-auto h-[calc(100vh-70px)] py-4">
        {/* Routes Display */}
        <div className="space-y-1 px-3">
          {routes.filter(route => !route.hidden).map((route, index) => {
            const isActive = isActiveRoute(route.layout + "/" + route.path);
            return (
              <Link
                key={index}
                to={route.layout + "/" + route.path}
                className={`flex items-center rounded-md p-2 cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-gray-200 dark:bg-gray-700" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 ${
                  isActive ? "text-dark dark:text-dark" : ""
                }`}>
                  {route.icon}
                </div>
                
                {expanded && (
                  <span className={`ml-3 font-medium text-sm ${
                    isActive ? "text-dark dark:text-dark" : ""
                  }`}>
                    {route.name}
                  </span>
                )}
                
                {isActive && (
                  <div className="absolute right-0 h-full w-1 rounded-lg  dark:bg-dark" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;