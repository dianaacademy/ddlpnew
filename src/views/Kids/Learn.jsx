import React from 'react';
import { useAuth } from "@/auth/hooks/useauth";
import StudyPath from './Learn/LearnStat';
import EnrolledCourses from './Learn/EnrolledCourses';

function LearnDash() {
  const { currentUser } = useAuth();

  return (
    <div className="w-full pl-[330px]">
      <div className="font-gabarito font-bold text-sky-600 text-4xl mt-10">
        Hey! {currentUser.displayName}
      </div>
      <div className="font-gabarito text text-xl mt-3 mb-5">
       Find Course in Which you have Enrolled
      </div>
      
      <EnrolledCourses/>
    </div>
  )
}

export default LearnDash