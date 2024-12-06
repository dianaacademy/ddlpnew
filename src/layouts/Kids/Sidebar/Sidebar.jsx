import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import quests from "../../../../public/Kids/Sidebar/quests.svg";
import learn from "../../../../public/Kids/Sidebar/learn.svg";
import leaderboard from "../../../../public/Kids/Sidebar/leaderboard.svg";
import logo from "../../../assets/logo.png";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-gray-100 py-6 px-4 md:w-[300px]">
      <div className="flex flex-col items-start">
      <div className={`mx-[16px]  flex items-center`}>
        <div className="flex text-[16px] font-bold uppercase text-[#FFFFFF] dark:text-white">
   <div className="w-8 h-8  flex">
   <img 
    width={34}
    height={24}
    className="flex" src={logo} alt="diana logo" />
   </div>
        <p className="flex  font-gabarito text-sky-800 pt-1 pl-2  text-xl	 font-bold">DDLP</p>
        </div>
      </div>
        
        <Link
            to="/Kids/learn"
            className={`mt-10 font-gabarito w-[250px] flex items-center border-2 mb-6 cursor-pointer px-3 py-2.5 rounded-lg font-bold ${
              location.pathname === '/Kids/learn'
                ? 'bg-sky-100 text-sky-600 border-sky-600'
                : 'border-gray-100 hover:bg-gray-200'
            }`}
          >
            <img src={learn} alt="Leaderboard" className="w-8 h-8 mr-4" />
            <span
              className={`${
                location.pathname === '/Kids/learn' ? 'text-sky-600' :   'text-gray-600'
              }`}
            >
              HOME
            </span>
          </Link>
          <Link
            to="/Kids/courses"
            className={`font-gabarito w-[250px] flex items-center border-2 mb-6 cursor-pointer px-3 py-2.5 rounded-lg font-bold ${
              location.pathname === '/Kids/courses'
                ? 'bg-sky-100 text-sky-600 border-sky-600'
                : 'border-gray-100 hover:bg-gray-200'
            }`}
          >
            <img src={quests} alt="Leaderboard" className="w-8 h-8 mr-4" />
            <span
              className={`${
                location.pathname === '/Kids/courses' ? 'text-sky-600' :  'text-gray-600'
              }`}
            >
              COURSES
            </span>
          </Link>
        <Link
            to="/Kids/leaderboard"
            className={`font-gabarito w-[250px] flex items-center border-2 mb-6 cursor-pointer px-3 py-2.5 rounded-lg font-bold ${
              location.pathname === '/Kids/leaderboard'
                ? 'bg-sky-100 text-sky-600 border-sky-600'
                : 'border-gray-100 hover:bg-gray-200'
            }`}
          >
            <img src={leaderboard} alt="Leaderboard" className="w-8 h-8 mr-4" />
            <span
              className={`${
                location.pathname === '/Kids/leaderboard' ? 'text-sky-600' :           'text-gray-600'
              }`}
            >
              LEADERBOARD
            </span>
          </Link>
        
          

        

        
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-gray-100 py-4 px-3 text-gray-600">
        <p className='font-gabarito px-3'>User Details</p>
        <Link
            to="/Kids/profile"
            className={`font-gabarito w-[250px] flex items-center border-2 mb-6 cursor-pointer px-3 py-2.5 rounded-lg font-bold ${
              location.pathname === '/Kids/profile'
                ? 'bg-sky-100 text-sky-600 border-sky-600'
                : 'border-gray-100 hover:bg-gray-200'
            }`}
          >
            <img src={leaderboard} alt="Leaderboard" className="w-8 h-8 mr-4" />
            <span
              className={`${
                location.pathname === '/Kids/profile' ? 'text-sky-600' :           'text-gray-600'
              }`}
            >
              PROFILE
            </span>
          </Link>
      </div>
    </div>
  );
};

export default Sidebar;