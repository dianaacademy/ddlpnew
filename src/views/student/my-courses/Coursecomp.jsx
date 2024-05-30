import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import InputUtil from '../../../utils/InputUtil/InputUtil';
import SelectDropdownUtil from '../../../utils/SelectDropdownUtil/SelectDropdownUtil';
import CourseCardWithOptions from '../../../utils/CourseCardWithOptions/CourseCardWithOptions';
import searchIcon from '/icons/search.png';
import shareIcon from '/icons/share.png';
import starIcon from '/icons/star-b.png';
import plusIcon from '/icons/plus.png';
import folderIcon from '/icons/folder.png';
import css from './AllCoursesComponent.module.css';

const AllCoursesComponent = () => {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: {},
    filterByCategory: {},
    filterByState: {},
    filterByInstructor: {},
  });
  const [resetBtn, setResetBtn] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesList = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const formattedCourses = coursesList.map((course) => ({
        path: '/course/view/video',
        img: course.thumbnailUrl,
        id: course.id,
        ttl: course.courseName,
        author: course.instructor,
        ratings: course.rating,
        courseCoveredPercent: course.progress,
      }));

      setCourses(formattedCourses);
    };

    fetchCourses();
  }, []);

  const optionsComps = [
    <div className={css.opt} key="lists">
      <div className={css.httl}>Lists</div>
      <Link to="/" className={css.ctxt}>
        Dynamics
      </Link>
      <Link to="/" className={css.ctxt}>
        NCloud
      </Link>
    </div>,
    <div className={css.opt} key="actions">
      <Link to="/" className={css.txtBox}>
        <span className={css.iconBox}>
          <img src={shareIcon} alt="icon" className={css.icon} />
        </span>
        <span className={css.txt}>Share</span>
      </Link>
      <Link to="/" className={css.txtBox}>
        <span className={css.iconBox}>
          <img src={plusIcon} alt="icon" className={css.icon} />
        </span>
        <span className={css.txt}>Create New List</span>
      </Link>
      <Link to="/" className={css.txtBox}>
        <span className={css.iconBox}>
          <img src={starIcon} alt="icon" className={css.icon} />
        </span>
        <span className={css.txt}>Favorite</span>
      </Link>
      <Link to="/" className={css.txtBox}>
        <span className={css.iconBox}>
          <img src={folderIcon} alt="icon" className={css.icon} />
        </span>
        <span className={css.txt}>Unarchive</span>
      </Link>
    </div>,
  ];

  return (
    <div className={css.outerDiv}>
      <div className={css.topBar}>
        <div className={css.filters}>
          {/* Add filter components here */}
        </div>
      </div>
      <div className={css.bdy}>
        {courses.map((course) => (
          <CourseCardWithOptions
            key={course.id}
            data={course}
            isOptions={true}
            options={optionsComps}
          />
        ))}
      </div>
    </div>
  );
};

export default AllCoursesComponent;