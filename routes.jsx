import MainDashboard from "./src/views/admin";
import Course from "./src/components/course";
import UserTable from "./src/views/admin/userTable";
import QuizBuilder from "./src/views/admin/QuizForm";
import CourseAdd from "./src/views/admin/Courseadd";
import QuizList from "@/views/admin/components/Allquuizes";
import CourseTable from "@/views/admin/courses";
import Coursebuild from "@/views/admin/Coursebuild";
import CourseViewer from "@/views/admin/CourseViewer";
import Instructor from "@/views/admin/instructor";
import { Biohazard } from "lucide-react";
// import {  } from "lucide-react";
import {
  Home,
  User,
  Package2,
  Settings,
  BookType,
  SquarePen,
} from "lucide-react"
const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <Home />,
    component: <MainDashboard />,
  },
  {
    name: "users",
    layout: "/admin",
    path: "users",
    icon: <User />,
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
    name: "courses",
    layout: "/admin",
    path: "courses",
    icon: <SquarePen />,
    component: <CourseTable />,
  },
  {
    name: "instructors",
    layout: "/admin",
    path: "instructor",
    icon: <Biohazard />,
    component: <Instructor />,
  },
  {
    name: "courses",
    layout: "/admin",
    path: "courses/:slug",
    icon: <BookType />,
    component: <CourseViewer />,
  },
  {
    name: "courses",
    layout: "/admin",
    path: "courses/build/:slug",
    icon: <BookType />,
    component: <Coursebuild />,
  },

];
export default routes;
