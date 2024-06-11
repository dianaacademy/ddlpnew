import { useState, useEffect } from "react";
import { db } from "@/firebase.config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Instructor = () => {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses: ", error);
        toast({
          title: "Error",
          description: `There was an error fetching courses: ${error.message}`,
          status: "error",
        });
      }
    };

    fetchCourses();
  }, [toast]);

  const handleAssignCourse = async () => {
    if (!studentId || !courseId) {
      toast({
        title: "Error",
        description: "Please enter a student ID and select a course.",
        status: "error",
      });
      return;
    }

    try {
      const newStudentData = {
        studentId,
        enrolledCourses: [courseId]
      };
      await addDoc(collection(db, "students"), newStudentData);

      toast({
        title: "Course Assigned",
        description: `Course ${courseId} has been assigned to student ${studentId} successfully.`,
        status: "success",
      });

      setStudentId("");
      setCourseId("");
    } catch (error) {
      console.error("Error assigning course: ", error);
      toast({
        title: "Error",
        description: `There was an error assigning the course: ${error.message}`,
        status: "error",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Assign Course to instructor</h1>
      <input
        type="text"
        placeholder="Instructor ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="p-2 my-2 border rounded mr-2"
      />
      <select
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="p-2 my-2 border rounded mr-2"
      >
        <option value="">Select a course</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>{course.courseName}</option>
        ))}
      </select>
      <Button onClick={handleAssignCourse}>Assign Course</Button>
    </div>
  );
};

export default Instructor;
