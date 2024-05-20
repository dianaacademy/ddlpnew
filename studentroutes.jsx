import MainDashboard from "./src/views/student";
import Course from "./src/components/course";
import HomeCard from "./src/views/student/Purchasecourse";
import CourseContent from "./src/views/student/Coursecontent";
import TabsPage from "./src/views/student/Tabs";



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
    name: "Purchase Courses",
    layout: "/student",
    path: "mycourses",
    icon: <MdFingerprint />,
    component: <HomeCard />,
  },
  {
    name: "Content",
    layout: "/student",
    path: "content",
    icon: <MdFingerprint />,
    component: <CourseContent />,
  },
  {
    name: "Tabs",
    layout: "/student",
    path: "tabs",
    icon: <MdFingerprint />,
    component: <TabsPage />,
  },
 
 
];
export default routes;
