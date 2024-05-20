/* eslint-disable */
import { HiX } from "react-icons/hi";
import SidebarLinks from "./Links"
import logo from "../../../assets/logo.png";
import routes from "../../../../routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-darkBlue dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >

      <span
        className="relative text-red-400 top-4  block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <Card className="w-[290px] h-[750px]">
      <CardHeader>
        <CardTitle className=" flex">

        <img 
    width={24}
    height={24}
    className="flex" src={logo} alt="diana logo" />
            <p className="flex pl-1 pt-1">iana learning portal</p>
</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="grid w-full h-full items-center gap-4">
          <ul className="mb-auto pt-2">
        <SidebarLinks routes={routes} />
      </ul>
          </div>
      </CardContent>
    </Card>

    </div>
  );
};

export default Sidebar;
