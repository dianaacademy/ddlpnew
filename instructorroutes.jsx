import MainDashboard from "./src/views/instructor";
import Course from "./src/components/course";
import {
  MdHome,
  MdFingerprint,
  MdPerson,
  MdLocationOn,
  MdMap,
  MdMessage,
  MdNotifications,
  MdHistory,
  MdSettings,
  MdAssignment,
  MdAccountCircle,
  MdHelp,
} from "react-icons/md";
// import Alerts from "views/admin/alerts";

const routes = [
  {
      name: "Dashboard",
      layout: "/instructor",
      path: "default",
      icon: <MdHome />,
      component: <MainDashboard />,

  },
  {
    name: "ALL Courses",
    layout: "/instructor",
    path: "ALL courses",
    icon: <MdFingerprint />,
    component: <Course />,
  },
];
export default routes;
