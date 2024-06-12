import React from 'react';
import './Style.css';
import AllCoursesComponent from './my-courses/Coursecomp';
import { useAuth, doSignOut } from "@/auth/hooks/useauth"




function MainDashboard() {
  const { currentUser } = useAuth();



  return (
    <>
    <div className= "font-Poppins font-bold text-white text-4xl	font-Poppins mt-10	fontpop" >Hey !{ currentUser.displayName } </div>
    <div className= "font-Poppins  text-white text-xl	font-Poppins mt-3	fontpop mb-5" >All Courses offered by Diana ATA</div>
<AllCoursesComponent/>


    </>
  )
}

export default MainDashboard