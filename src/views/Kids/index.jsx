import React from 'react';
import { useAuth, doSignOut } from "@/auth/hooks/useauth"





function MainDashboardKids() {
  const { currentUser } = useAuth();



  return (
    <>
    <div className= "font-Poppins font-bold text-white text-4xl	font-Poppins mt-10	fontpop" >Hey !{ currentUser.displayName } </div>
    <div className= "font-Poppins  text-white text-xl	font-Poppins mt-3	fontpop mb-5" >All Courses offered by Diana ATA</div>
    



    </>
  )
}

export default MainDashboardKids