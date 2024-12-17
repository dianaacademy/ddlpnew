import React from 'react';
import { useAuth } from "@/auth/hooks/useauth";

function MainDashboardKids() {
  const { currentUser } = useAuth();

  return (
    <div className="w-full pl-[330px]">
      <div className="font-Poppins font-bold text-black text-4xl mt-10">
        Hey! {currentUser.displayName}
      </div>
      <div className="font-Poppins text-black text-xl mt-3 mb-5">
        All Courses offered by Diana ATA
      </div>
      {/* Add more content here */}
    </div>
  )
}

export default MainDashboardKids