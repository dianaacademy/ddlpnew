import { useState, useEffect } from "react";
import { db, auth } from "@/firebase.config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Card, CardTitle, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useauth";
import { getLastVisitedChapter } from "./component/Progressservice"; 

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async (user) => {
      if (!user) return;
      
      try {
        const studentId = user.uid;
        const enrolledStudentDoc = doc(db, "enrolledstudents", studentId);
        const enrolledStudentSnapshot = await getDoc(enrolledStudentDoc);

        if (enrolledStudentSnapshot.exists()) {
          const enrolledCoursesData = enrolledStudentSnapshot.data().courses;

          const coursePromises = Object.keys(enrolledCoursesData).map(async (courseId) => {
            const courseDoc = await getDoc(doc(db, "courses", courseId));
            if (courseDoc.exists()) {
              const courseData = courseDoc.data();
              const enrolledCourseData = enrolledCoursesData[courseId];

              // Check if the user has started this course
              const lastVisitedChapter = await getLastVisitedChapter(courseId);
              
              return {
                ...courseData,
                id: courseId,
                enrolledDate: enrolledCourseData?.enrolled_date || null,
                enrolledBy: enrolledCourseData?.enrolled_by?.user_id || null,
                hasStarted: !!lastVisitedChapter,
                lastVisitedChapter: lastVisitedChapter
              };
            }
            return null;
          });

          const courseList = (await Promise.all(coursePromises)).filter(Boolean);
          setCourses(courseList);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      fetchCourses(user);
    });

    return () => unsubscribe();
  }, []);

  const handleContinueLearning = (courseId) => {
    // Redirect to the course tracker page instead of directly to the learning page
    navigate(`/student/course-tracker/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="font-Poppins font-bold text-white text-4xl mt-6">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="font-Poppins font-bold text-white text-4xl mt-6">
          Error loading courses. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="font-Poppins font-bold text-white text-4xl font-Poppins mt-6 fontpop">
        Hey! {currentUser.displayName}
      </div>
      <div className="font-Poppins text-white text-xl font-Poppins mt-3 fontpop mb-5">
        Resume your Pending Courses
      </div>

      {courses.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {courses.map((course) => (
            <Card className="w-1/5 bg-white rounded-lg shadow-md overflow-hidden" key={course.id}>
              <img
                src={course.thumbnailUrl || "https://ik.imagekit.io/growthx100/default-image.jpg?updatedAt=1709902412480"}
                alt={course.courseName}
                className="w-full h-auto object-cover"
              />
              <div className="p-4 bg-white">
                <span className="bg-teal-500 text-white text-xs font-semibold pl-3 pr-3 pt-1 pb-1 rounded-full">
                  NEW
                </span>
                <CardTitle className="text-xl font-semibold mt-2">{course.courseName}</CardTitle>
                <button
                  onClick={() => handleContinueLearning(course.id)}
                  className="w-full bg-black text-white text-center py-2 px-2 mt-2 rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
                >
                  {course.hasStarted ? "Continue Learning" : "Start Learning"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-white text-3xl text-center mt-10">
          No enrolled course found.
        </div>
      )}
    </div>
  );
};

export default MyLearning;