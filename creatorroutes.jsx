import MainDashboard from "./src/views/creator";
import CourseAdd from "./src/views/admin/Courseadd";
import LAbbuilder from "./src/views/creator/Labbuilder/Labbuilder"
import Labfind from "./src/views/creator/Labfind";
import CourseTable from "@/views/admin/courses";
import ModuleBuild from "@/views/admin/Modulebuild";
import NewChapter from "@/views/admin/managechapter";
import CourseViewer from "@/views/admin/CourseViewer";
import CourseBuild from "@/views/admin/Coursebuild";
import EditChapter from "@/views/admin/Editchapter";

import {
  MdHome,
  MdFingerprint,

} from "react-icons/md";
import {
  Home,
  User,
  Package2,
  SquarePen,
} from "lucide-react"

const routes = [
  {
    name: "Dashboard",
    layout: "/creator",
    path: "default",
    icon: <MdHome />,
    component: <MainDashboard />,
  },

  {
    name: "courses",
    layout: "/creator",
    path: "courses",
    icon: <SquarePen />,
    component: <CourseTable />,
  },
  {
    name: "addcourse",
    layout: "/creator",
    path: "addcourse",
    icon: <MdFingerprint />,
    component: <CourseAdd />,
  },
  {
    // name: "courses",
    layout: "/creator",
    path: "courses/:slug",
    // icon: <BookType />,
    component: <CourseViewer />,
  },
  {
    // name: "courses",
    layout: "/creator",
    path: "courses/build/:slug",
    // icon: <BookType />,
    component: <CourseBuild />,
  },
  {
    // name: "courses",
    layout: "/creator",
    path: "courses/build/:slug/module/:moduleId",
    // icon: <BookType />,
    component: <ModuleBuild />,
  },
  {
    // name: "courses",
    layout: "/creator",
    path: "courses/build/:slug/module/:moduleId/chapter/new",
    // icon: <BookType />,
    component: <NewChapter />,
  },
  {
    // name: "courses",
    layout: "/creator",
    path: "courses/build/:slug/module/:moduleId/chapter/:chapterId/edit",
    // icon: <BookType />,
    component: <EditChapter />,
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
