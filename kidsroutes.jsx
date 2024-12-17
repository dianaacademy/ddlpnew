import MainDashboardKids from "@/views/Kids";
import LearnDash from "@/views/Kids/Learn";
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
  {
      name: "Home",
      layout: "/Kids",
      path: "learn",
      icon: <MdHome />,
      component: <LearnDash />,

  },

  
  
 
];
export default routes;
