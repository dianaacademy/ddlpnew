import React from 'react';
import './Style.css';
import AllCoursesComponent from './my-courses/Coursecomp';


function MainDashboard() {


  return (
    <>
    <div className= "font-Poppins font-bold text-white text-4xl	font-Poppins mt-10	fontpop" >Hey ! Kaushal </div>
    <div className= "font-Poppins  text-white text-xl	font-Poppins mt-3	fontpop mb-5" >Resume your Pending Courses </div>
<AllCoursesComponent/>
    </>
  )
}

export default MainDashboard