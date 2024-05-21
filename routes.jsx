import MainDashboard from "./src/views/admin";
import Course from "./src/components/course";
import UserTable from "./src/views/admin/userTable";
import QuizBuilder from "./src/views/admin/QuizForm";
import CourseAdd from "./src/views/admin/Courseadd";
import {
  Home,
  Package2,
  Settings,
  BookType,
  SquarePen,
} from "lucide-react"


// import Alerts from "views/admin/alerts";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <Home />,
    component: <MainDashboard />,
  },
  {
    name: "courses",
    layout: "/admin",
    path: "course",
    icon: <BookType />,
    component: <Course />,
  },
  {
    name: "users",
    layout: "/admin",
    path: "users",
    icon: <Settings />,
    component: <UserTable />,
  },
  {
    name: "quizbuilder",
    layout: "/admin",
    path: "quizbbuild",
    icon: <SquarePen />,
    component: <QuizBuilder />,
  },
  {
    name: "addcourse",
    layout: "/admin",
    path: "addcourse",
    icon: <Package2 />,
    component: <CourseAdd />,
  },
  {
    name: "alluser",
    layout: "/admin",
    path: "alluser",
    icon: <Package2 />,
    component: <UserTable />,
  },




];
export default routes;
