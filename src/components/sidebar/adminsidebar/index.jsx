/* eslint-disable */
import { HiX } from "react-icons/hi";
import SidebarLinks from "./Links"
import logo from "../../../assets/logo.png";
import routes from "../../../../routes";
import './index.css';
const Sidebar = ({ open, onClose }) => {


  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-3 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-black pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-darkBlue dark:text-white md:!z-50 lg:!z-50 xl:!z-5 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="relative text-red-400 top-4  block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[16px] mt-[22px] flex items-center`}>
        <div className="flex  h-0.5 font-poppins text-[16px] font-bold uppercase text-[#FFFFFF] dark:text-white">
   <div className="w-8 h-8  flex">
   <img 
    width={34}
    height={24}
    className="flex" src={logo} alt="diana logo" />
   </div>
        <p className="flex pl-1 pt-1 navbardd">iana learning portal</p>
        </div>
      </div>
      <div className="mt-[48px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-2 navbardd">
        <SidebarLinks routes={routes} />
      </ul>

      {/* Free Horizon Card */}


      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
