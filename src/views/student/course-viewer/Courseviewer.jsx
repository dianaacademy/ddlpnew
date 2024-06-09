import { useState, useEffect } from "react";
import { db } from '../../../firebase.config';
import { doc, getDoc } from 'firebase/firestore';

import VideoPlayer from "../../../components/CourseVideoComponents/VideoPlayer/VideoPlayer";
import DetailDPComponent from "../../../components/CourseVideoComponents/DetailDPComponent/DetailDPComponent";
import CourseContentComponent from "../../../components/CourseVideoComponents/CourseContentComponent/CourseContentComponent";
import CourseViewTabComponent from "../../../components/CourseVideoComponents/CourseViewTabComponents/CourseViewTabComponent/CourseViewTabComponent";

import CourseVideoNavbar from "../../../components/LayoutComponents/CourseVideoNavbar/CourseVideoNavbar";
import Footer from "../../../components/LayoutComponents/Footer/Footer";

import css from "./CourseViewPage.module.css";

const CourseViewPage = () => {
  const [courseData, setCourseData] = useState([]);
  const data = {
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
  };

  const [playerFullWidth, setPlayerFullWidth] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(db, 'courses', 'jyNrAzlMM8vV9Fxwtryw', 'Modules', '7hP4SvzqpZk8F2ud4GuD');
        const courseSnapshot = await getDoc(courseRef);
        if (courseSnapshot.exists()) {
          const moduleData = courseSnapshot.data();
          console.log('Fetched module data:', moduleData); // Log fetched data
          if (moduleData) {
            const formattedData = formatModuleData(moduleData);
            console.log('Formatted module data:', formattedData); // Log formatted data
            setCourseData(formattedData);
          } else {
            console.log('No module data found!');
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
    fetchCourseData();
  }, []);

  const formatModuleData = (moduleData) => {
    console.log("Starting to format module data:", moduleData);
    const formattedData = [];
    // Assuming moduleData has a single key "Module_Name"
    const moduleValue = moduleData.Module_Name;
    if (moduleValue && moduleValue.module_ttl) {
      const module = {
        id: moduleValue.id || '', // Assuming 'id' should be taken from moduleValue
        ttl: moduleValue.module_ttl || '',
        lects: moduleValue.module_lects || '',
        dur: moduleValue.module_dur || '',
        list: [],
      };
      if (moduleValue.Classes) {
        const classes = [];
        for (const [classKey, classValue] of Object.entries(moduleValue.Classes)) {
          console.log("Processing class:", classKey, classValue);
          const classData = {
            id: classKey,
            ttl: classValue.class_name || '',
            dur: classValue.class_dur || '',
            preview: true,
            type: classValue.class_type || '',
            desc: '',
            resources: [],
          };
          classes.push(classData);
        }
        module.list = classes;
      } else {
        console.log("No classes found for module:", moduleValue);
      }
      formattedData.push(module);
    } else {
      console.log("No Module_Name found for module:", moduleValue);
    }
    return formattedData;
  };
  

  return (
    <div className={css.outterDiv}>
      <CourseVideoNavbar data={data} />
      <div className={css.bdy}>
        <div
          className={css.left}
          style={{ width: playerFullWidth ? "100%" : "75%" }}
        >
          <div
            className={css.content}
            style={{
              height: playerFullWidth ? "700px" : "600px",
            }}
          >
            <VideoPlayer
              data={{ autoplay: true }}
              playerWidthState={playerFullWidth}
              playerWidthSetter={setPlayerFullWidth}
            />
          </div>
          <CourseViewTabComponent />
        </div>
        <div
          className={css.right}
          style={{ display: playerFullWidth ? "none" : "block" }}
        >
          <DetailDPComponent
            title="Take a DIana Assessment to check your skills"
            desc="Made by Diana, this generalized assessment is a great way to check in on your skills."
            btnTxt="Launch Assessment"
          />
          <CourseContentComponent
            title="Course Content"
            data={courseData}
            playerWidthSetter={setPlayerFullWidth}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseViewPage;
