import React, { useState, useEffect } from "react";
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
import QuizRouter from "./QuizRouter";

const TextContent = ({ textContent }) => {
  return (
    <div className="text-content p-4 text-sm">
     
      {textContent || <p>No text content available.</p>}
    </div>
  );
};

const QuizContent = ({ quizContent }) => {
  return (
    <div className="quiz-content p-4">
      
      <QuizRouter/>
   
      {/* {quizContent || <p>No quiz content available.</p>} */}
    </div>
  );
};

const Learning = () => {
  const { slug } = useParams();
  const [courseData, setCourseData] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const [data, setData] = useState({ title: "" }); 
  const [playerFullWidth, setPlayerFullWidth] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseRef = doc(db, 'courses', slug);
        const courseSnapshot = await getDoc(courseRef);

        if (courseSnapshot.exists()) {
          const courseData = courseSnapshot.data();
          setCourseInfo(courseData);
          setData({ title: courseData.courseName || "Course Title" });

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
        details: {
          videoUrl: chapter.details?.videoUrl || '',
          textContent: chapter.details?.textContent || '',
          quizContent: chapter.details?.quizContent || '',
        }
      }))
    };
  };

  const handleChapterClick = (chapterId) => {
    const chapterData = courseData.flatMap(module => module.list).find(chapter => chapter.id === chapterId);

    if (chapterData) {
      console.log('Chapter Data:', chapterData);
      setActiveChapter(chapterData);

      switch(chapterData.type) {
        case 'video':
          setChapterContent(<VideoPlayer data={{ autoplay: true, videoUrl: chapterData.details.videoUrl }} />);
          break;
        case 'text':
          console.log('textContent:', chapterData.details.textContent); 
          setChapterContent(<TextContent textContent={chapterData.details.textContent} />);
          break;
        case 'quiz':
          setChapterContent(<QuizContent quizContent={chapterData.details.quizContent} />);
          break;
        default:
          setChapterContent(<div>Unsupported content type</div>);
      }
    } else {
      console.log("Chapter data not found");
      setChapterContent(null);
    }
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
            {chapterContent || <VideoPlayer data={{ autoplay: true }} />}
          </div>
          <CourseViewTabComponent />
        </div>
        <div
          className={css.right}
          style={{ display: playerFullWidth ? "none" : "block" }}
        >
          <DetailDPComponent
            title="Take a Diana Assessment to check your skills"
            desc="Made by Diana, this generalized assessment is a great way to check in on your skills."
            btnTxt="Launch Assessment"
          />
          <CourseContentComponent
            title="Course Content"
            data={courseData}
            playerWidthSetter={setPlayerFullWidth}
            onChapterClick={handleChapterClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Learning;
