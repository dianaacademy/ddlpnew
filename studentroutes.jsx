import MainDashboard from "./src/views/student";
import Course from "./src/components/course";
import Mylearning from "./src/views/student/Mylearning";
import Learning from "@/views/student/component/learning";
// import CourseViewPage from "@/views/student/course-viewer/Courseviewer";



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
    component: <Mylearning />,
  },
  {
    layout: "/student",
    path: "mylearning/learn/:slug",
    component: <Learning />,
  },
  
 
];
export default routes;
