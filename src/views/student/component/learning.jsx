import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from '../../../firebase.config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import "../../../components/ui/loader.css";
import VideoPlayer from "../../../components/CourseVideoComponents/VideoPlayer/VideoPlayer";
import CourseContentComponent from "../../../components/CourseVideoComponents/CourseContentComponent/CourseContentComponent";
import CourseVideoNavbar from "../../../components/LayoutComponents/CourseVideoNavbar/CourseVideoNavbar";
import MatchQuiz from "./MatchQuiz";
import parse from 'html-react-parser';
import QuizFrontend from "./QuizFrontend";
import LabContent from "./LabContent";
import 'react-quill/dist/quill.snow.css';
import { Card } from "@/components/ui/card";
import closeIcon from "../../../assets/images/icon/01.png";
import { SidebarCloseIcon } from "lucide-react";

import {
  markChapterAsComplete,
  getCompletedChapters,
  getLastVisitedChapter,
  setLastVisitedChapter
} from "../../../views/student/component/Progressservice";

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
}

const MatchContent = ({ matchContent }) => {
  return (
    <div className="quiz-content p-4">
      <h1>Match Content</h1>
      <MatchQuiz />
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [lastVisitedChapter, setLastVisitedChapterState] = useState(null);

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

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const completedChapters = await getCompletedChapters(slug);
        const lastVisitedChapter = await getLastVisitedChapter(slug);
        setCompletedChapters(completedChapters);
        setLastVisitedChapterState(lastVisitedChapter);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgressData();
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

  // const handleNextChapter = () => {
  //   if (currentChapterIndex !== null && currentChapterIndex < data.flatMap(module => module.list).length - 1) {
  //     const nextChapter = data.flatMap(module => module.list)[currentChapterIndex + 1];
  //     handleChapterClick(nextChapter.id, nextChapter.moduleId, currentChapterIndex + 1);
  //   }
  // };

  // const handlePreviousChapter = () => {
  //   if (currentChapterIndex !== null && currentChapterIndex > 0) {
  //     const prevChapter = data.flatMap(module => module.list)[currentChapterIndex - 1];
  //     handleChapterClick(prevChapter.id, prevChapter.moduleId, currentChapterIndex - 1);
  //   }
  // };

  const handleChapterClick = async (chapterId) => {
    const chapterData = courseData.flatMap(module => module.list).find(chapter => chapter.id === chapterId);

    if (chapterData) {
      console.log('Chapter Data:', chapterData);
      setActiveChapter(chapterData);

      switch (chapterData.type) {
        case 'video':
          setChapterContent(<VideoPlayer data={{ autoplay: true, videoUrl: chapterData.details.videoUrl }} />);
          break;
        case 'text':
          console.log('Content:', chapterData.details.content);
          setChapterContent(<Content content={chapterData.details.content} />);
          break;
        case 'quiz':
          console.log('quiz:', chapterData.details.questions);
          setChapterContent(<QuizContent quizContent={chapterData.details.questions} />);
          break;

        case 'match':
          setChapterContent(<MatchQuiz matchContent={chapterData.details.matchContent} />);
          break;
        case 'lab':
          console.log('Lab data:', chapterData);
          setChapterContent(
            <div className="lab-content p-4">
              <LabContent labData={chapterData} />
            </div>
          );
          break;
        default:
          setChapterContent(<div>Unknown chapter type</div>);
      }

      // Mark chapter as complete and set it as the last visited chapter
      await markChapterAsComplete(slug, chapterId);
      await setLastVisitedChapter(slug, chapterId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center ">
        <div className="loader mt-[300px] flex items-center "></div>
      </div>
    );
  }

  return (
    <>
      <CourseVideoNavbar title={data.title} />
      <div className="flex">
        <div className={`overflow-y-auto h-screen ${isSidebarCollapsed ? 'w-0' : 'w-1/5'} transition-width duration-300`}>
          {!isSidebarCollapsed && (
            <Card>
              <span
                className="flex float-right cursor-pointer"
                onClick={() => setIsSidebarCollapsed(true)}
              >
                <SidebarCloseIcon />
              </span>
              <CourseContentComponent
                title="Course "
                data={courseData}
                playerWidthSetter={setIsSidebarCollapsed}
                onChapterClick={handleChapterClick}
                completedChapters={completedChapters}
              />
            </Card>
          )}
        </div>
        <div className={`${isSidebarCollapsed ? 'w-full' : 'w-4/5'} h-screen transition-width duration-300`}>
          <Card>
            {isSidebarCollapsed && (
              <span
                className="flex float-left cursor-pointer"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <SidebarCloseIcon />
              </span>
            )}
            <div className="w-2/3 p-4">
              <div className="flex justify-between mb-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-200"
                >
                  Previous
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-200"
                >
                  Next
                </button>
              </div>
              {chapterContent}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Learning;
