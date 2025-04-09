import { Button } from "@/components/ui/button";
import { db, auth } from "@/firebase.config";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  where,
  orderBy,
  startAfter,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MiniCourseList() {
  const [courses, setCourses] = useState([]);
  const [imageLoading, setImageLoading] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showFreeOnly, setShowFreeOnly] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const coursesPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    if (auth.currentUser) {
      checkEnrollmentStatus();
    }
  }, [showFreeOnly]);

  const handleImageLoad = (index) => {
    setImageLoading((prev) => {
      const newImageLoading = [...prev];
      newImageLoading[index] = false;
      return newImageLoading;
    });
  };

  const checkEnrollmentStatus = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      // Get enrolled courses data
      const enrolledDoc = await getDoc(doc(db, "enrolledstudents", userId));
      if (!enrolledDoc.exists()) return;

      const enrolledData = enrolledDoc.data();
      const enrolledCourses = enrolledData.courses || {};

      // Get progress data
      const progressRef = doc(db, "progress", userId);
      const progressDoc = await getDoc(progressRef);
      const progressData = progressDoc.exists() ? progressDoc.data() : {};

      // Update enrollment status with progress information
      const statuses = {};
      Object.keys(enrolledCourses).forEach(courseId => {
        const hasStarted = progressData[courseId] && 
                          Object.keys(progressData[courseId]).length > 0;
        statuses[courseId] = hasStarted ? "continue" : "start";
      });

      setEnrollmentStatus(statuses);
    } catch (error) {
      console.error("Error checking enrollment status:", error);
    }
  };

  const fetchCourses = async (loadMore = false) => {
    setLoading(!loadMore);
    if (loadMore) setLoadingMore(true);
    setError(null);
    
    try {
      let q;
      
      if (showFreeOnly) {
        // Query for free courses - using only the where clause without sorting
        q = query(
          collection(db, "courses"),
          where("isPublic", "==", true)
        );
      } else {
        // Query for recent courses
        q = query(
          collection(db, "courses"),
          orderBy("createdAt", "desc")
        );
      }

      // Add pagination
      if (loadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      q = query(q, limit(coursesPerPage));

      const querySnapshot = await getDocs(q);
      const coursesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort free courses by name in-memory instead of in the query
      const sortedCoursesList = showFreeOnly 
        ? coursesList.sort((a, b) => a.courseName.localeCompare(b.courseName))
        : coursesList;

      // Initialize image loading state for new courses
      const newImageLoadingState = loadMore 
        ? [...imageLoading, ...Array(sortedCoursesList.length).fill(true)]
        : Array(sortedCoursesList.length).fill(true);
        
      setImageLoading(newImageLoadingState);
      
      // Update courses list
      setCourses((prev) => (loadMore ? [...prev, ...sortedCoursesList] : sortedCoursesList));
      
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === coursesPerPage);
    } catch (error) {
      console.error("Error fetching courses: ", error);
      setError("Unable to fetch courses. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreCourses = async () => {
    await fetchCourses(true);
  };

  const handleCourseClick = async (course) => {
    // If not logged in, redirect to login page
    if (!auth.currentUser) {
      navigate('/login', { state: { redirectTo: `/student/course-tracker/${course.id}` } });
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      
      // Check if already enrolled
      if (enrollmentStatus[course.id] === "start" || enrollmentStatus[course.id] === "continue") {
        // Already enrolled, just navigate without showing "Enrolling..."
        navigate(`/student/course-tracker/${course.id}`);
        return;
      }
      
      // If not enrolled, then set loading state and enroll
      setLoadingCourseId(course.id);
      
      // Check if course is public
      if (!course.isPublic) {
        navigate(`/student/course-tracker/${course.id}`);
        return;
      }
      
      // Enroll the student
      const enrolledStudentDoc = await getDoc(doc(db , "enrolledstudents", userId));
      const enrolledData = enrolledStudentDoc.exists() ? enrolledStudentDoc.data() : { courses: {} };
      
      const currentDate = new Date().toISOString();
      
      await setDoc(doc(db, "enrolledstudents", userId), {
        studentId: userId,
        courses: {
          ...enrolledData.courses,
          [course.id]: {
            course_id: course.id,
            course_name: course.courseName,
            enrolled_by: "self-enrollment",
            enrolled_date: currentDate,
          }
        }
      }, { merge: true });
      
      // Update local state
      setEnrollmentStatus(prev => ({
        ...prev,
        [course.id]: "start"
      }));
      
      // Redirect to course tracker
      navigate(`/student/course-tracker/${course.id}`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    } finally {
      setLoadingCourseId(null);
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <Skeleton className="h-40 w-full mb-4 rounded" />
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 col-span-4">
            No courses available
          </div>
        ) : (
          courses.map((course, index) => (
            <Card key={`${course.id}-${index}`} className="flex flex-col overflow-hidden shadow bg-white rounded-lg">
              <div className="relative w-full h-40">
                <img
                  className={`w-full h-full object-cover ${
                    imageLoading[index] ? "hidden" : "block"
                  }`}
                  src={course.thumbnailUrl}
                  alt={course.courseName}
                  onLoad={() => handleImageLoad(index)}
                />
                {imageLoading[index] && (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-medium text-gray-800 text-lg mb-3 line-clamp-2 flex-grow">
                  {course.courseName}
                </h3>
                <Button
                  className="flex gap-2 items-center justify-center w-full"
                  variant="default"
                  size="sm"
                  onClick={() => handleCourseClick(course)}
                  disabled={loadingCourseId === course.id}
                >
                  {loadingCourseId === course.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : enrollmentStatus[course.id] === "continue" ? (
                    <>
                      <ArrowRight size={16} />
                      Continue Learning
                    </>
                  ) : enrollmentStatus[course.id] === "start" ? (
                    <>
                      <BookOpen size={16} />
                      Start Learning
                    </>
                  ) : (
                    <>
                      <BookOpen size={16} />
                      Learn
                    </>   
                  )}
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {hasMore && !loading && (
        <div className="mt-6 text-center">
          <Button
            onClick={loadMoreCourses}
            disabled={loadingMore}
            variant="outline"
            size="sm"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}