import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "../../../kidsroutes";

import Sidebar from "./Sidebar/Sidebar";
import { useAuth } from "@/auth/hooks/useauth";

export default function Kids(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  React.useEffect(() => {
    // Adjust sidebar visibility based on screen size
    const handleResize = () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

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

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/Kids") {
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-lightPrimary dark:!bg-darkBlue">
        <main className="w-full min-h-full p-4">
          <Routes>
            {getRoutes(routes)}
            <Route
              path="/"
              element={<Navigate to="/Kids/default" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}