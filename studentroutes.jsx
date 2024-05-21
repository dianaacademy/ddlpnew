import MainDashboard from "./src/views/student";
import Course from "./src/components/course";
import HomeCard from "./src/views/student/Purchasecourse";



import {
  MdHome,
  MdFingerprint,
} from "react-icons/md";
// import Alerts from "views/admin/alerts";

const routes = [
  {
      name: "Home",
      layout: "/student",
      path: "default",
      icon: <MdHome />,
      component: <MainDashboard />,

  },
  {
    name: "discover",
    layout: "/student",
    path: "discover",
    icon: <MdFingerprint />,
    component: <Course />,
  },
  {
    name: "My learning",
    layout: "/student",
    path: "mylearning",
    icon: <MdFingerprint />,
    component: <HomeCard />,
  },
 
];
export default routes;
