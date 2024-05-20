import MainDashboard from "./src/views/admin";
import Course from "./src/components/course";
import UserTable from "./src/views/admin/userTable";
import QuizBuilder from "./src/views/admin/QuizForm";
import CourseAdd from "./src/views/admin/Courseadd";
import {
  MdHome,
  MdFingerprint,
  MdGolfCourse,

} from "react-icons/md";
import { MdBuildCircle } from "react-icons/md";
import { MdAdd } from "react-icons/md";
// import Alerts from "views/admin/alerts";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome />,
    component: <MainDashboard />,
  },
  {
    name: "courses",
    layout: "/admin",
    path: "course",
    icon: <MdFingerprint />,
    component: <Course />,
  },
  {
    name: "users",
    layout: "/admin",
    path: "users",
    icon: <MdGolfCourse />,
    component: <UserTable />,
  },
  {
    name: "quizbuilder",
    layout: "/admin",
    path: "quizbbuild",
    icon: <MdBuildCircle />,
    component: <QuizBuilder />,
  },
  {
    name: "addcourse",
    layout: "/admin",
    path: "addcourse",
    icon: <MdAdd />,
    component: <CourseAdd />,
  },
  {
    name: "alluser",
    layout: "/admin",
    path: "alluser",
    icon: <MdFingerprint />,
    component: <UserTable />,
  },




];
export default routes;
