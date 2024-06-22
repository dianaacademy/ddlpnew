import MainDashboard from "./src/views/student";
import Mylearning from "./src/views/student/Mylearning";
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
      // component: <MainDashboard />,
      component: <Mylearning />,

  },
  {
    name: "discover",
    layout: "/student",
    path: "discover",
    icon: <MdFingerprint />,
    // component: <Course />,
    component: <MainDashboard />,
  },
  // {
  //   name: "My learning",
  //   layout: "/student",
  //   path: "mylearning",
  //   icon: <MdFingerprint />,
  //   component: <Mylearning />,
  // },

  // {
  //   name: " ",
  //   layout: "/student",
  //   path: "mylearning/learn/:slug",
  //   component: <Learning />,
  //   className: "hidden sst",
   
  // },
  
  
 
];
export default routes;
