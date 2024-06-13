import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from '../../../firebase.config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import "../../../components/ui/loader.css";

import VideoPlayer from "../../../components/CourseVideoComponents/VideoPlayer/VideoPlayer";
import DetailDPComponent from "../../../components/CourseVideoComponents/DetailDPComponent/DetailDPComponent";
import CourseContentComponent from "../../../components/CourseVideoComponents/CourseContentComponent/CourseContentComponent";
import CourseViewTabComponent from "../../../components/CourseVideoComponents/CourseViewTabComponents/CourseViewTabComponent/CourseViewTabComponent";

import CourseVideoNavbar from "../../../components/LayoutComponents/CourseVideoNavbar/CourseVideoNavbar";

import css from "./CourseViewPage.module.css";

const Learning = () => {
  const { slug } = useParams();
  console.log(slug);
  const [courseData, setCourseData] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const data = {
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
  };

  const [playerFullWidth, setPlayerFullWidth] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(db, 'courses', slug);
        const courseSnapshot = await getDoc(courseRef);

        if (courseSnapshot.exists()) {
          const courseData = courseSnapshot.data();
          setCourseInfo(courseData);

          const modulesCollectionRef = collection(db, 'courses', slug, 'modules');
          const modulesSnapshot = await getDocs(modulesCollectionRef);

          const modulesData = await Promise.all(
            modulesSnapshot.docs.map(async (moduleDoc) => {
              const moduleData = moduleDoc.data();
              const chaptersCollectionRef = collection(db, 'courses', slug, 'modules', moduleDoc.id, 'chapters');
              const chaptersSnapshot = await getDocs(chaptersCollectionRef);
              
              const chaptersData = chaptersSnapshot.docs.map(chapterDoc => ({
                id: chapterDoc.id,
                ...chapterDoc.data()
              }));

              return {
                id: moduleDoc.id,
                ...moduleData,
                chapters: chaptersData
              };
            })
          );

          const formattedData = modulesData.map(moduleData => formatModuleData(moduleData));
          setCourseData(formattedData);
        } else {
          console.log('No such course document!');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug]);

  const formatModuleData = (moduleData) => {
    return {
      id: moduleData.id || '',
      ttl: moduleData.moduleName || '',
      lects: moduleData.lectures || '',
      dur: moduleData.duration || '',
      list: moduleData.chapters.map(chapter => ({
        id: chapter.id,
        ttl: chapter.chapterName || '',
        dur: chapter.duration || '',
        preview: true,
        type: chapter.type || '',
        desc: chapter.description || '',
        resources: chapter.resources || [],
      }))
    };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
    <div className="loader"></div>
  </div>
  }

  if (!courseInfo) {
    return <div>Course not found</div>;
  }

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
