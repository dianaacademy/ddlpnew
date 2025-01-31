/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { DashIcon } from "@radix-ui/react-icons";
import '../adminsidebar/index.css';

export function SidebarLinks(props) {
  let location = useLocation();
  const { routes } = props;

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    // Filter and limit routes based on layout
    const filteredRoutes = routes.filter(route => {
      if (route.layout === "/student") {
        return true; // Keep student routes
      } else if (
        route.layout === "/admin" ||
        route.layout === "/instructor" ||
        route.layout === "/creator"
      ) {
        return true; // Keep other roles' routes
      }
      return false;
    });

    // If it's a student route, only take first two links
    const finalRoutes = location.pathname.includes("/student")
      ? filteredRoutes.slice(0, 2)
      : filteredRoutes;

    return finalRoutes.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/instructor" ||
        route.layout === "/creator" ||
        route.layout === "/student"
      ) {
        return (
          <div className="background-container" key={index}>  
            <div className="">
              <Link 
                to={route.layout + "/" + route.path}
                className={`nav-link ${activeRoute(route.path) ? 'active' : ''}`}
              >
                <div className="text-black flex hover:cursor-pointer">
                  <li className="text-md flex cursor-pointer items-center px-2">
                    <span className={`${
                      activeRoute(route.path) 
                        ? 'text-white dark:text-red-300 pr-3 text-base' 
                        : 'font-large text-blue-300 pr-3 text-base'
                    }`}>
                      {route.icon ? route.icon : <DashIcon />}{" "}
                    </span>
                    <p className={`leading-1 flex ml-1 m-0 ${
                      activeRoute(route.path)
                        ? 'text-gray-100 dark:text-white'
                        : 'font-small text-gray-400'
                    }`}>
                      {route.name}
                    </p>
                  </li>
                  {activeRoute(route.path) ? (
                    <div className="" />
                  ) : null}
                </div>
              </Link>
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;