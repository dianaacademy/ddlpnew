import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from '../../../firebase.config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

import VideoPlayer from "../../../components/CourseVideoComponents/VideoPlayer/VideoPlayer";
import DetailDPComponent from "../../../components/CourseVideoComponents/DetailDPComponent/DetailDPComponent";
import CourseContentComponent from "../../../components/CourseVideoComponents/CourseContentComponent/CourseContentComponent";
import CourseViewTabComponent from "../../../components/CourseVideoComponents/CourseViewTabComponents/CourseViewTabComponent/CourseViewTabComponent";

import CourseVideoNavbar from "../../../components/LayoutComponents/CourseVideoNavbar/CourseVideoNavbar";


import css from "./CourseViewPage.module.css";

const Learning = () => {
  const { courseId } = useParams();
  console.log(courseId);
  const [courseData, setCourseData] = useState([]);
  const data = {
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
  };

  const [playerFullWidth, setPlayerFullWidth] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(db, 'courses', courseId);
        const courseSnapshot = await getDoc(courseRef);
        
        if (courseSnapshot.exists()) {
        //   const courseData = courseSnapshot.data();
          const modulesCollectionRef = collection(db, 'courses', courseId, 'modules');
          const modulesSnapshot = await getDocs(modulesCollectionRef);

          const modulesData = modulesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const formattedData = modulesData.map(moduleData => formatModuleData(moduleData));
          setCourseData(formattedData);
        } else {
          console.log('No such course document!');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const formatModuleData = (moduleData) => {
    console.log("Starting to format module data:", moduleData);
    const formattedData = [];
    
    if (moduleData.module_ttl) {
      const module = {
        id: moduleData.id || '',
        ttl: moduleData.module_ttl || '',
        lects: moduleData.module_lects || '',
        dur: moduleData.module_dur || '',
        list: [],
      };
      
      if (moduleData.Classes) {
        const classes = [];
        for (const [classKey, classValue] of Object.entries(moduleData.Classes)) {
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
        console.log("No classes found for module:", moduleData);
      }
      formattedData.push(module);
    } else {
      console.log("No Module_Name found for module:", moduleData);
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

export default Learning;
