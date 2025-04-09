import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/sidebar/adminsidebar";
import routes from "../../../routes";
import './index.css';

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);
  
  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const handleSidebarExpand = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };
  
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full">
      <Sidebar 
        open={open} 
        onClose={() => setOpen(false)} 
        expanded={expanded}
        onExpandChange={handleSidebarExpand}
      />
      
      {/* Navbar & Main Content */}
      <div className={`h-full w-full bg-lightPrimary dark:!bg-darkBlue transition-all duration-300 ${expanded ? "pl-64" : "pl-14"}`}>
        {/* Main Content */}
        <main className="h-full flex-none transition-all xl:ml-[25px]">
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Diana learning"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh]">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}