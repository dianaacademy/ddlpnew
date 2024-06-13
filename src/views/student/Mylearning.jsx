import { useState, useEffect } from "react";
import { db, auth } from "@/firebase.config";
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Card, CardTitle, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth,  } from "@/auth/hooks/useauth"


const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseid, setCourseid] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Get the currently logged-in user
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const studentId = user.uid;
            // Fetch the student's enrolled courses
            const q = query(
              collection(db, "students"),
              where("studentId", "==", studentId)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const studentData = querySnapshot.docs[0].data();
              const enrolledcourseid = studentData.enrolledCourses || [];
              setCourseid(enrolledcourseid);

              // Fetch the course details
              const coursePromises = enrolledcourseid.map((courseId) =>
                getDoc(doc(db, "courses", courseId))
              );

              const courseSnapshots = await Promise.all(coursePromises);
              const courseList = courseSnapshots.map((snapshot) =>
                snapshot.data()
              );

              setCourses(courseList);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
       <div className= "font-Poppins font-bold text-white text-4xl	font-Poppins mt-10	fontpop" >Hey !{ currentUser.displayName } </div>
       <div className= "font-Poppins  text-white text-xl	font-Poppins mt-3	fontpop mb-5" >Resume your Pending Courses </div>
      <div className="flex flex-wrap gap-4">
        {courses.map((course, index) => (
          <Card className="w-1/4 bg-white rounded-lg shadow-md overflow-hidden" key={index}>
            <img
              src={course.thumbnailUrl || "https://ik.imagekit.io/growthx100/default-image.jpg?updatedAt=1709902412480"}
              alt={course.courseName}
              className="w-full h-64 object-none bg-center"
            />
            <div className="p-4 bg-white">
              <span className="bg-teal-500 text-white text-xs font-semibold pl-3 pr-3 pt-1 pb-1 rounded-full">
                NEW
              </span>
              <CardTitle className="text-xl font-semibold mt-2">{course.courseName}</CardTitle>
              
              
              <Link to={`/student/mylearning/learn/${courseid}`}>
  <CardFooter className="bg-black text-white text-center py-2 px-2 mt-2 rounded-lg shadow-md hover:bg-gray-800 transition duration-300">
    resume
  </CardFooter>
</Link>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyLearning;
