import MainDashboard from "./src/views/student";
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
      layout: "/student",
      path: "default",
      icon: <MdHome />,
      component: <MainDashboard />,

  },
  {
    name: "ALL Courses",
    layout: "/student",
    path: "allcourses",
    icon: <MdFingerprint />,
    component: <Course />,
  },
  {
    name: "My courses",
    layout: "student",
    path: "ALL courses",
    icon: <MdFingerprint />,
    component: <Course />,
  },
];
export default routes;
