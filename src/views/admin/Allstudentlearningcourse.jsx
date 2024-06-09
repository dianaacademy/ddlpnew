import { useState, useEffect } from "react";
import { db } from "@/firebase.config";
import { collection, getDocs } from "firebase/firestore";

const StudentCourseTable = () => {
  const [studentCourses, setStudentCourses] = useState([]);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        const studentsCollection = collection(db, "students");
        const coursesCollection = collection(db, "courses");

        const [studentsSnapshot, coursesSnapshot] = await Promise.all([
          getDocs(studentsCollection),
          getDocs(coursesCollection)
        ]);

        // Create a dictionary for quick course lookup
        const coursesData = {};
        coursesSnapshot.docs.forEach(doc => {
          coursesData[doc.id] = doc.data().courseName;
        });

        const studentCoursesData = [];

        for (const studentDoc of studentsSnapshot.docs) {
          const studentData = studentDoc.data();
          const studentId = studentDoc.id;
          const studentName = studentData.name;

          studentData.enrolledCourses.forEach(courseId => {
            if (coursesData[courseId]) {
              studentCoursesData.push({
                studentId,
                studentName,
                courseId,
                courseName: coursesData[courseId]
              });
            } else {
              console.warn(`Course ID ${courseId} not found in courses collection.`);
            }
          });
        }

        setStudentCourses(studentCoursesData);
      } catch (error) {
        console.error("Error fetching student courses: ", error);
      }
    };

    fetchStudentCourses();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Course Table</h1>
      <table className="border-collapse border border-gray-800">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-800 p-2">Student ID</th>
            <th className="border border-gray-800 p-2">Student Name</th>
            <th className="border border-gray-800 p-2">Course ID</th>
            <th className="border border-gray-800 p-2">Course Name</th>
          </tr>
        </thead>
        <tbody>
          {studentCourses.map(({ studentId, studentName, courseId, courseName }) => (
            <tr key={`${studentId}-${courseId}`}>
              <td className="border border-gray-800 p-2">{studentId}</td>
              <td className="border border-gray-800 p-2">{studentName}</td>
              <td className="border border-gray-800 p-2">{courseId}</td>
              <td className="border border-gray-800 p-2">{courseName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentCourseTable;
