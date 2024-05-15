/* eslint-disable */
import { HiX } from "react-icons/hi";
import SidebarLinks from "./Links";
import logo from "../../../assets/logo.png";
import routes from "../../../../creatorroutes";
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

      <div className={`mx-[36px] mt-[22px] flex items-center`}>
        <div className="flex  h-0.5 font-poppins text-[16px] font-bold uppercase text-[#FFFFFF] dark:text-white">
   <div className="w-8 h-8  flex">
   <img 
    width={18}
    height={18}
    className="flex" src={logo} alt="diana logo" />
   </div>
        <p className="flex pl-1 pt-2 ">iana sentinel</p>
        </div>
      </div>
      <div className="mt-[48px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
  
      <ul className="mb-auto  pt-1">
        <SidebarLinks routes={routes} />
      </ul>

      <div className="flex justify-center">
      </div>

    </div>
  );
};

export default Sidebar;
