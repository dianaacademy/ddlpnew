/* eslint-disable */
import { HiX } from "react-icons/hi";
import SidebarLinks from "./Links"
import logo from "../../../assets/logo.png";
import routes from "../../../../creatorroutes";
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
      className={`mt-6     ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <div>

      <span
        className="relative top-4   cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>
        <img 
    width={34}
    height={34}
    className="flex ml-2 pt-2" src={logo} alt="diana logo" />
      </div>

  
       <div className="pt-10">
       <SidebarLinks routes={routes} />


       </div>


    </div>
  );
};

export default Sidebar;
