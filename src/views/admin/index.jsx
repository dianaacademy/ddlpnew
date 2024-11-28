import { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkeletonCard } from "./components/skeltoncard";
import {  collection, getDocs, } from 'firebase/firestore';
import { db } from "@/firebase.config"
function MainDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [instructorCount, setInstructorCount] = useState(0);
  const [Studentcount, setstudentCount] = useState(0);
  const [creator, SetCreator] = useState(0);



  useEffect(() => {
    const fetchData = async () => {
      const database = getDatabase();

      const usersRef = ref(database, 'users');
      const usersSnapshot = await get(usersRef);
      const usersData = usersSnapshot.val();
      if (usersData) {
        setTotalUsers(Object.keys(usersData).length);
        const instructorData = Object.values(usersData).filter(user => user.role === 'instructor');
        const Studentdata = Object.values(usersData).filter(user => user.role === 'Student');
        const creatordata = Object.values(usersData).filter(user => user.role === 'Creator');

        setInstructorCount(instructorData.length);
        setstudentCount(Studentdata.length);
        SetCreator(creatordata.length);

        
        
      }

      const coursesRef = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesRef);
      setTotalCourses(coursesSnapshot.size);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <>
          <SkeletonCard />
        </>
      ) : (
        <div  className="grid grid-cols-3 grid-flow-row mt-10 gap-6 mx-4">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {totalUsers}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Total students</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {Studentcount}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Total course creator</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {creator}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>


          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Total Intructor</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {instructorCount}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Total courses</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {totalCourses}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Cybersecurity students</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    134
                  </div>
                </div>
              </form>
            </CardContent>
          </Card> */}

          
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Diana junior</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    14
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default MainDashboard;
