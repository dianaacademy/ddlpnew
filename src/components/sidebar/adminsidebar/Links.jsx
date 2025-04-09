import React from "react";
import { Link, useLocation } from "react-router-dom";
import { DashIcon } from "@radix-ui/react-icons";
import { PanelLeft, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function SidebarLinks(props) {
  let location = useLocation();
  const { routes, expanded, onToggleExpand } = props;

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes
      .filter((route) => !route.hidden) // Filter out routes with hidden: true
      .map((route, index) => {
        if (
          route.layout === "/admin" ||
          route.layout === "/instructor" ||
          route.layout === "/creator" ||
          route.layout === "/student"
        ) {
          return (
            <li key={index} className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={route.layout + "/" + route.path}
                      className={`flex items-center ${
                        expanded ? "justify-start pl-5" : "justify-center"
                      } h-14 ${expanded ? "w-full" : "w-14"}`}
                    >
                      <span
                        className={`${
                          activeRoute(route.path)
                            ? "font-bold text-black text-lg dark:text-red-300"
                            : "font-medium text-lg text-black"
                        }`}
                      >
                        {route.icon ? route.icon : <DashIcon />}
                      </span>
                      {expanded && (
                        <span
                          className={`ml-3 ${
                            activeRoute(route.path)
                              ? "font-bold text-black dark:text-red-300"
                              : "font-medium text-black"
                          }`}
                        >
                          {route.name}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">
                      <p
                        className={`${
                          activeRoute(route.path)
                            ? "font-bold text-black dark:text-white"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {route.name}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {activeRoute(route.path) && (
                <div className="absolute right-0 top-0 h-full w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              )}
            </li>
          );
        }
        return null;
      });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 flex flex-col border-r bg-background transition-all duration-300 ease-in-out ${
        expanded ? "w-64" : "w-14"
      }`}
    >
      {/* Header with logo and toggle button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <img src="/assets/logo.png" alt="Diana Logo" className="h-6 w-6" />
          {expanded && <span className="font-bold text-sm">Diana</span>}
        </div>
        <button
          onClick={onToggleExpand}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav className="flex flex-col items-center gap-2 px-2 sm:py-5 overflow-y-auto">
        <ul className="flex flex-col pt-6 gap-1 w-full">
          {createLinks(routes)}
        </ul>
      </nav>
      
      {/* Toggle button at the bottom */}
      <div className="mt-auto p-4 border-t">
        <button
          onClick={onToggleExpand}
          className="flex items-center justify-center p-2 w-full rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <PanelLeft size={20} />
          {expanded && <span className="ml-2 text-sm">Toggle Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}

export default SidebarLinks;