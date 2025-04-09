import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from '../../../firebase.config';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import Lottie from "lottie-react";
import VideoPlayer from "../../../components/CourseVideoComponents/VideoPlayer/VideoPlayer";
import CourseContentComponent from "../../../components/CourseVideoComponents/CourseContentComponent/CourseContentComponent";
import CourseVideoNavbar from "../../../components/LayoutComponents/CourseVideoNavbar/CourseVideoNavbar";
import MatchQuiz from "./MatchQuiz";
import parse from 'html-react-parser';
import QuizFrontend from "./QuizFrontend";
import LabContent from "./LabContent";
import 'react-quill/dist/quill.snow.css';
import { Card } from "@/components/ui/card";
import { SidebarCloseIcon, ChevronLeft, ChevronRight } from "lucide-react";
import "./CourseViewPage.module.css";
import "./LottieLoader.css";

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
};

const MatchContent = ({ matchContent }) => {
  return ( 
    <div className="quiz-content p-4">
      <h1>Match Content</h1>
      <MatchQuiz matchContent={matchContent} />
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
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentModuleName, setCurrentModuleName] = useState("");
  const [animationData, setAnimationData] = useState(null);
  const [totalChapters, setTotalChapters] = useState(0);

  useEffect(() => {
    fetch("https://lottie.host/d684aa48-68fe-4b9a-9c97-c8c8b17f7136/2efFrG33MG.json")
      .then(response => response.json())
      .then(data => setAnimationData(data));
  }, []);

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
          
          formattedData.sort((a, b) => a.modnum - b.modnum);
          
          setCourseData(formattedData);
          
          // Calculate total chapters
          const chaptersCount = formattedData.reduce((total, module) => total + module.list.length, 0);
          setTotalChapters(chaptersCount);
          
        } else {
          console.log('No such course document!');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        if (animationData) {
          setLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [slug, animationData]);

  useEffect(() => {
    if (courseData.length > 0 && courseData[0].list.length > 0) {
      const firstChapter = courseData[0].list[0];
      handleChapterClick(firstChapter.id);
    }
  }, [courseData]);

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
    const formattedModule = {
      id: moduleData.id || '',
      ttl: moduleData.moduleName || '',
      lects: moduleData.lectures || '',
      dur: moduleData.duration || '',
      modnum: moduleData.moduleno || '',
      list: (moduleData.chapters || []).map(chapter => ({
        id: chapter.id,
        ttl: chapter.chapterName || '',
        chanum: chapter.chapterno || '',
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

    formattedModule.list.sort((a, b) => a.chanum - b.chanum);

    return formattedModule;
  };

  const allChapters = courseData.flatMap(module => module.list);

  const handleChapterClick = async (chapterId) => {
    const index = allChapters.findIndex(chapter => chapter.id === chapterId);
    if (index !== -1) {
      setCurrentChapterIndex(index);
      const chapterData = allChapters[index];
      setActiveChapter(chapterData);

      const currentModule = courseData.find(module => 
        module.list.some(chapter => chapter.id === chapterId)
      );
      setCurrentModuleName(currentModule ? currentModule.ttl : "");

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
          setChapterContent(<MatchContent matchContent={chapterData.details.matchContent} />);
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

      // Mark chapter as complete and update local state immediately
      await markChapterAsComplete(slug, chapterId);
      
      // Update local state to reflect completion immediately
      if (!completedChapters.includes(chapterId)) {
        setCompletedChapters(prevCompletedChapters => {
          const updatedCompletedChapters = [...prevCompletedChapters];
          if (!updatedCompletedChapters.includes(chapterId)) {
            updatedCompletedChapters.push(chapterId);
          }
          return updatedCompletedChapters;
        });
      }
      
      await setLastVisitedChapter(slug, chapterId);
      setLastVisitedChapterState(chapterId);
    } else {
      console.log("Chapter data not found");
      setChapterContent(null);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      handleChapterClick(allChapters[currentChapterIndex + 1].id);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      handleChapterClick(allChapters[currentChapterIndex - 1].id);
    }
  };

  const renderChapterOpener = () => { 
    if (!activeChapter) return null;
    // Add your chapter opener rendering logic here if needed
  };

  const calculateProgress = () => {
    if (totalChapters === 0) return 0;
    return Math.round((completedChapters.length / totalChapters) * 100);
  };

  if (loading) {
    return (
      <div className="lottie-loader-container">
        {animationData && (
          <Lottie 
            animationData={animationData} 
            loop={true}
            autoplay={true}
            className="lottie-loader"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-10 shadow-sm">
        <CourseVideoNavbar 
          title={data.title}
          moduleName={currentModuleName}
          chapterName={activeChapter ? activeChapter.ttl : ""}
          completedChapters={completedChapters.length}
          totalChapters={allChapters.length}
          progressPercentage={calculateProgress()}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className={`overflow-y-auto custom-scrollbar ${isSidebarCollapsed ? 'w-0' : 'w-1/4'} transition-all duration-300 border-r-2`}>
          {!isSidebarCollapsed && (
            <Card className="h-full">
              <div className="">
                <span
                  className="flex float-right    cursor-pointer pt-4 pr-5 z-30 sticky"
                  onClick={() => setIsSidebarCollapsed(true)}
                >
                <SidebarCloseIcon />
                </span>
                <CourseContentComponent
                  title="Course Content"
                  data={courseData}
                  playerWidthSetter={setIsSidebarCollapsed}
                  onChapterClick={handleChapterClick}
                  completedChapters={completedChapters}
                  activeChapter={activeChapter}
                  currentChapterIndex={currentChapterIndex}
                  totalChapters={allChapters.length}
                />
              </div>
            </Card>
          )}
        </div>
        <div className={`flex-1 flex flex-col ${isSidebarCollapsed ? 'w-full' : 'w-3/4'} transition-all duration-300`}>
          <Card className="flex-1 overflow-y-auto">
            {isSidebarCollapsed && (
              <span className="flex float-left cursor-pointer mt-4 ml-4"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <SidebarCloseIcon />
              </span>
            )}
            <div className="">
              
              {renderChapterOpener()}
              {chapterContent}
            </div>
          </Card>
          <div className="flex justify-between p-2 bg-white border-t">
            <button
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-200"
              onClick={handlePreviousChapter}
              disabled={currentChapterIndex === 0}
            >
              <ChevronLeft className="mr-2" /> Previous
            </button>
            <button
              className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-200"
              onClick={handleNextChapter}
              disabled={currentChapterIndex === allChapters.length - 1}
            >
              Next <ChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;