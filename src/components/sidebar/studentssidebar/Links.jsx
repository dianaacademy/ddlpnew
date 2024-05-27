/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";// chakra imports
import { DashIcon } from "@radix-ui/react-icons";
import '../adminsidebar/index.css';


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
          
          <div key={index} className="">
            <Link 
              to={route.layout + "/" + route.path}
              className={`nav-link ${activeRoute(route.path) ? 'active' : ''}`}
            >
              <div className=" text-black flex hover:cursor-pointer ">
                <li className=" text-md flex cursor-pointer items-center px-2 ">
                  <span className={`${
                    activeRoute(route.path) ? ' text-white  dark:text-red-300' : 'font-small text-blue-300 '
                  }`}>
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p className={`leading-1 flex ml-4 ${
                    activeRoute(route.path) ? ' text-gray-100 dark:text-white' : 'font-small text-gray-400'
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