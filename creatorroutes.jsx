import MainDashboard from "./src/views/creator";
import Course from "./src/components/course";
import QuizBuilder from "./src/views/admin/QuizForm";
import CourseAdd from "./src/views/admin/Courseadd";
import LAbbuilder from "./src/views/creator/Labbuilder/Labbuilder"
import Labfind from "./src/views/creator/Labfind";
// import Boards from "./views/admin/usermanagement";
// import Reports from  "./views/admin/reports"
// import Employe from "./views/admin/employes";
// import SalarySlipGenerator from "./views/admin/Tools";
// import Teams from "./views/teams";
// import Task from "./views/tasks";
// import AttendanceReport from "./views/admin/reports/components/AttendanceReport";
// import Dianacoonect from "./views/admin/dianaconnect/dianaconnect";
import {
  MdHome,
  MdFingerprint,

} from "react-icons/md";
// import Alerts from "views/admin/alerts";

const routes = [
  {
    name: "Dashboard",
    layout: "/creator",
    path: "default",
    icon: <MdHome />,
    component: <MainDashboard />,
  },
  {
    name: "allcourses",
    layout: "/creator",
    path: "alcourse",
    icon: <MdFingerprint />,
    component: <Course />,
  },
  {
    name: "quizbuilder",
    layout: "/creator",
    path: "quizbbuild",
    icon: <MdFingerprint />,
    component: <QuizBuilder />,
  },
  {
    name: "addcourse",
    layout: "/creator",
    path: "addcourse",
    icon: <MdFingerprint />,
    component: <CourseAdd />,
  },
  {
    name: "addcourse",
    layout: "/creator",
    path: "addcourse",
    icon: <MdFingerprint />,
    component: <CourseAdd />,
  }, 
   {
    name: "buildlab",
    layout: "/creator",
    path: "buillab",
    icon: <MdFingerprint />,
    component: <LAbbuilder />,
  },
  {
    name: "labfing",
    layout: "/creator",
    path: "labfind",
    icon: <MdFingerprint />,
    component: <Labfind />,
  },



];
export default routes;
