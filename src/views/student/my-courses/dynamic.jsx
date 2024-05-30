import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';

const CourseTable = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2>Course List</h2>
      <table>
        <thead>
          <tr>
            <th>Course Description</th>
            <th>Course Duration</th>
            <th>Course Price</th>
            <th>Course Name</th>
            <th>Course PIC</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.courseDesc}</td>
              <td>{course.courseDuration}</td>
              <td>{course.coursePrice}</td>
              <td>{course.courseName}</td>
              <td>{course.thumbnailUrl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;