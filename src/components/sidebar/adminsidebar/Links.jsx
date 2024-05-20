/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";// chakra imports
import { DashIcon } from "@radix-ui/react-icons";

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/instructor"||
        route.layout === "/creator"  ||
        route.layout === "/student"
      ) {
        return (
          <div className="ml-4">
          <Link key={index} to={route.layout + "/" + route.path}>
            <div className=" mb-3 text-black flex scroll-m-20 text-2xl font-extrabold  hover:cursor-pointer">              
              <li
                className="my-[3px] text-md  flex  cursor-pointer items-center px-2"
                key={index}
              >
                <span
                  className={`${
                    activeRoute(route.path) === true
                      ? "font-bold text-black dark:text-red-300"
                      : "font-medium text-black"
                  }`}
                >
                  {route.icon ? route.icon : <DashIcon/>}{" "}
                </span>
                <p
                  className={`leading-1 flex ml-4  ${
                    activeRoute(route.path) === true
                      ? "font-bold text-black dark:red-white"
                      : "font-medium text-gray-700"
                  }`}
                >
                  {route.name}
                </p>
              </li>
              {activeRoute(route.path) ? (
                <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>
          </Link>
          </div>
        );
      }
    });
  };
  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;
