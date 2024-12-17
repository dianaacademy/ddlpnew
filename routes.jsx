import MainDashboard from "./src/views/admin";

import UserTable from "./src/views/admin/userTable";
import CourseAdd from "./src/views/admin/Courseadd";
import CourseTable from "@/views/admin/courses";
import Coursebuild from "@/views/admin/Coursebuild";
import CourseViewer from "@/views/admin/CourseViewer";
import Instructor from "@/views/admin/instructor";
import { Biohazard, BookMarked } from "lucide-react";
import AssignCourse from "@/views/admin/AssignCourse";
import { MdAdd } from "react-icons/md";

import Allstudentlearningcourse from "@/views/admin/Allstudentlearningcourse";
import ModuleBuild from "@/views/admin/Modulebuild";
import NewChapter from "@/views/admin/managechapter";
import EditChapter from "@/views/admin/Editchapter";
import Document from "@/views/admin/Document";
import {
  Home,
  User,
  Package2,
  SquarePen,
} from "lucide-react"
import DocumentTabs from "@/views/admin/docs";
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
    name: "Docs",
    layout: "/admin",
    path: "docs",
    icon: <BookMarked />,
    component: <DocumentTabs />,
  },
  {
    name: "Assigncourse",
    layout: "/admin",
    path: "Assigncourse",
    icon: <MdAdd />,
    component: <AssignCourse />,
  },
  {
    name: "student",
    layout: "/admin",
    path: "studentslearning",
    icon: <MdAdd />,
    component: <Allstudentlearningcourse />,
  },
  {
    name: "add document",
    layout: "/admin",
    path: "Documents",
    icon: <SquarePen />,
    component: <Document />,
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/:slug",
    // icon: <BookType />,
    component: <CourseViewer />,
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/build/:slug",
    // icon: <BookType />,
    component: <Coursebuild />,
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/build/:slug/module/:moduleId",
    // icon: <BookType />,
    component: <ModuleBuild />,
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/build/:slug/module/:moduleId/chapter/new",
    // icon: <BookType />,
    component: <NewChapter />,
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/build/:slug/module/:moduleId/chapter/:chapterId/edit",
    // icon: <BookType />,
    component: <EditChapter />,
  },

];
export default routes;
