import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from '../../../firebase.config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import "../../../components/ui/loader.css";
import VideoPlayer from "../../../components/CourseVideoComponents/VideoPlayer/VideoPlayer";
import CourseContentComponent from "../../../components/CourseVideoComponents/CourseContentComponent/CourseContentComponent";
import CourseVideoNavbar from "../../../components/LayoutComponents/CourseVideoNavbar/CourseVideoNavbar";
import css from "./CourseViewPage.module.css";
import MatchQuiz from "./MatchQuiz";
import parse from 'html-react-parser';
import QuizFrontend from "./QuizFrontend";
import LabContent from "./LabContent";
import 'react-quill/dist/quill.snow.css';

const Content = ({ content }) => {
  return (
    <div className="text-content p-4 text-sm">
      {content ? parse(content) : <p>No text content available.</p>}
    </div>
  );
};

const QuizContent = ({ quizContent }) => {
  return (
    <div className="quiz-content p-4">
      <QuizFrontend quiz={{ questions: quizContent, course: "Your Course Name" }} />
    </div>
  );
};






const MatchContent = ({ matchContent }) => {
  return (
    <div className="quiz-content p-4">
      <h1>Match Content</h1>
      <MatchQuiz/>
   
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
      list: (moduleData.chapters || []).map(chapter => ({
        id: chapter.id,
        ttl: chapter.chapterName || '',
        dur: chapter.duration || '',
        preview: true,
        type: chapter.type || '',
        desc: chapter.description || '',
        resources: chapter.resources || [],
        details: {
          videoUrl: chapter.details?.videoUrl || '',
          content: chapter.details?.content || '',
          imageUrl: chapter.details?.imageUrl || '',
          question: chapter.details?.question || '',
          answerArea: chapter.details?.answerArea || {},
          quizContent: chapter.details?.quizContent || '',
          questions: (chapter.details?.questions || []).map(question => ({
            question: question.question || '',
            hint: question.hint || '',
            options: (question.options || []).map(option => ({
              option: option.option || '',
              isCorrect: option.isCorrect || false
            }))
          }))
        }
      }))
    };
  };

  const handleChapterClick = (chapterId) => {
    const chapterData = courseData.flatMap(module => module.list).find(chapter => chapter.id === chapterId);

    if (chapterData) {
      setActiveChapter(chapterData);

      switch(chapterData.type) {
        case 'video':
          setChapterContent(<VideoPlayer data={{ autoplay: true, videoUrl: chapterData.details.videoUrl }} />);
          break;
        case 'text':
          setChapterContent(<Content content={chapterData.details.content} />);
          break;
        case 'quiz':
          setChapterContent(<QuizContent quizContent={chapterData.details.questions} />);
          break;
        case 'match':
          setChapterContent(<MatchQuiz matchContent={chapterData.details.matchContent} />);
          break;
        case 'lab':
          setChapterContent(
            <div className="lab-content p-4">
              <LabContent labData={chapterData} />
            </div>
          );
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
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!courseInfo) {
    return <div>Course not found</div>;
  }

  return (
    <div className={css.outterDiv}>
      <div className={css.stickyHeader}>
        <CourseVideoNavbar data={data} />
      </div>
      
      <div className={css.bdy}>
        {sidebarOpen && (
          <div className={css.right}>
            <CourseContentComponent
              title="Course Content"
              data={courseData}
              playerWidthSetter={setPlayerFullWidth}
              onChapterClick={handleChapterClick}
              onClose={toggleSidebar}
              activeChapter={activeChapter}
            />
          </div>
        )}
        <div
          className={css.left}
          style={{ width: sidebarOpen ? "75%" : "100%" }}
        >
        {!sidebarOpen && (
  <button className={css.openSidebarBtn} onClick={toggleSidebar} style={{ display: 'flex', alignItems: 'center' }}>
    <img src="https://ik.imagekit.io/growthx100/icon(9).svg?updatedAt=1719580145816" alt="icon" style={{ marginRight: '8px' ,width:'15px'}} />
    Menu
  </button>
)}

      
          <div className={css.content}>
            {chapterContent || <VideoPlayer data={{ autoplay: true }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;