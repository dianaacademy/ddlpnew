import MainDashboardKids from "@/views/Kids";
import {
  MdHome,
  MdFingerprint,
} from "react-icons/md";

const routes = [
  {
      name: "Home",
      layout: "/Kids",
      path: "default",
      icon: <MdHome />,
      component: <MainDashboardKids />,

  },

  
  
 
];
export default routes;
