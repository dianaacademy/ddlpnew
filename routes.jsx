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
import CreatePostPage from "@/views/admin/CreatePost";
import AssignCourseUP from "@/views/admin/UpAssign";
import BooksPage from "@/views/admin/LibraryAll";
import { TbCertificate } from "react-icons/tb";



import {
  Home,
  User,
  Package2,
  SquarePen,
  Rss,
  CircleFadingPlus,
  Library ,
  BookPlus ,
  Blocks,
} from "lucide-react"

import DocumentTabs from "@/views/admin/docs";
import CertificateManagement from "@/views/admin/certBasic";
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
    name: "addpost",
    layout: "/admin",
    path: "addpost",
    icon: <Rss />,
    component: <CreatePostPage />,
    
  },
  {
    name: "addstudents",
    layout: "/admin",
    path: "addstudents",
    icon: <CircleFadingPlus />,
    
    component: <AssignCourseUP />,
    
  },
  {
    name: "certmanager",
    layout: "/admin",
    path: "certmanager",
    icon: <TbCertificate />,
    component: <CertificateManagement/>,
    
  },
  {
    name: "library",
    layout: "/admin",
    path: "library",
    icon: <BookPlus />,
    component: <BooksPage />,
  },
  {
    name: "addcourse",
    layout: "/admin",
    path: "addcourse",
    icon: <Package2 />,
    component: <CourseAdd />,
  },

  {
    name: "Build Course",
    layout: "/admin",
    path: "courses",
    icon: <Blocks />,
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
  // {
  //   name: "Assigncourse",
  //   layout: "/admin",
  //   path: "Assigncourse",
  //   icon: <MdAdd />,
  //   component: <AssignCourse />,
  // },
  // {
  //   name: "student",
  //   layout: "/admin",
  //   path: "studentslearning",
  //   icon: <MdAdd />,
  //   component: <Allstudentlearningcourse />,
  // },
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
    hidden: true, 
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/build/:slug",
    // icon: <BookType />,
    component: <Coursebuild />,
    hidden: true, 
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/build/:slug/module/:moduleId",
    // icon: <BookType />,
    component: <ModuleBuild />,
    hidden: true, 
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/build/:slug/module/:moduleId/chapter/new",
    // icon: <BookType />,
    component: <NewChapter />,
    hidden: true, 
  },
  {
    // name: "courses",
    layout: "/admin",
    path: "courses/build/:slug/module/:moduleId/chapter/:chapterId/edit",
    // icon: <BookType />,
    component: <EditChapter />,
    hidden: true, 
  },

];
export default routes;
