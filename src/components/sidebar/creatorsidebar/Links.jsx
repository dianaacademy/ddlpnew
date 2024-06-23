/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { DashIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
export function SidebarLinks(props) {
  let location = useLocation();
  const { routes } = props;

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
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
                  <Link to={route.layout + "/" + route.path} className="flex items-center justify-center h-14 w-14">
                    <span
                      className={`${
                        activeRoute(route.path)
                          ? "font-bold text-black text-lg dark:text-red-300"
                          : "font-medium text-lg text-black"
                      }`}
                    >
                      {route.icon ? route.icon : <DashIcon />} 
                      {/* {route.name} */}
                    </span>
                  </Link>
                </TooltipTrigger>
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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-2 px-2  sm:py-5">
        <ul className="flex flex-col pt-6  gap-1">
          {createLinks(routes)}
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarLinks;
