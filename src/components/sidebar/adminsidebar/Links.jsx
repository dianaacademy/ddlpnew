/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { DashIcon } from "@radix-ui/react-icons";
import './index.css'; // Make sure to import the CSS file

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
          <div className="background-container">  
          
          <div key={index} className="ml-4 mr-5 mb-2 tendam ">
            <Link 
              to={route.layout + "/" + route.path}
              className={`nav-link ${activeRoute(route.path) ? 'active' : ''}`}
            >
              <div className="pr-3 text-black flex hover:cursor-pointer ">
                <li className="my-[3px] text-md flex cursor-pointer items-center px-2 ">
                  <span className={`${
                    activeRoute(route.path) ? 'font-bold text-gray-100 dark:text-red-300' : 'font-medium text-blue-600 '
                  }`}>
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p className={`leading-1 flex ml-4 ${
                    activeRoute(route.path) ? 'font-bold text-gray-100 dark:text-white' : 'font-medium text-gray-700'
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
