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
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseid,setcourseid] = useState(true);
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
              const enrolledCourseIds = studentData.enrolledCourses || [];
              setcourseid(enrolledCourseIds);
              // Fetch the course details
              const coursePromises = enrolledCourseIds.map((courseId) =>
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
      <h1>My Learning hello</h1>
      {courses?.map((course, index) => (
          <Card className="pb-4" key={index}>
            <div className="pt-4">
              <CardTitle className="px-2 py-2">{course.courseName}</CardTitle>
              <CardContent className="pt-2">
                <img
                  className="w-72 h-72 object-cover rounded-md"
                  height={300}
                  width={300}
                  src={course.thumbnailUrl}
                  alt={course.courseName} />
              </CardContent>
            </div>
            <Link to={`learn/${courseid }`} >
            <CardFooter>
              Learn
            </CardFooter>
            </Link>
          </Card>
        ))}
    </div>
  );
};
export default MyLearning;