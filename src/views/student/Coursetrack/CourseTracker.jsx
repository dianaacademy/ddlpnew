import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/auth/hooks/useauth";
import { getCompletedChapters } from "../component/Progressservice";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, BookOpenIcon, CheckCircleIcon, TrophyIcon } from "lucide-react";
import CertificateGenerator from "./CertificateTracker";


const CourseTracker = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedModules, setCompletedModules] = useState({});
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showCertGenerator, setShowCertGenerator] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError("No course ID provided");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching course data for ID:", courseId);
        
        // Fetch course details
        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);
        
        if (courseSnap.exists()) {
          console.log("Course found:", courseSnap.data());
          setCourseData(courseSnap.data());
          
          // Fetch modules
          const modulesCollectionRef = collection(db, "courses", courseId, "modules");
          const modulesSnapshot = await getDocs(modulesCollectionRef);
          
          if (modulesSnapshot.empty) {
            console.log("No modules found for course");
            setModules([]);
          } else {
            const modulesData = await Promise.all(
              modulesSnapshot.docs.map(async (moduleDoc) => {
                const moduleData = moduleDoc.data();
                
                // Fetch chapters for this module
                const chaptersCollectionRef = collection(
                  db, 
                  "courses", 
                  courseId, 
                  "modules", 
                  moduleDoc.id, 
                  "chapters"
                );
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
            
            // Sort modules by module number
            modulesData.sort((a, b) => (a.moduleno || 0) - (b.moduleno || 0));
            console.log("Modules data:", modulesData);
            setModules(modulesData);
            
            // Get completed chapters data
            const completedChapters = await getCompletedChapters(courseId);
            console.log("Completed chapters:", completedChapters);
            
            // Calculate module completion
            const moduleCompletion = {};
            modulesData.forEach(module => {
              const totalChapters = module.chapters?.length || 0;
              if (totalChapters === 0) return;
              
              const completedCount = module.chapters.filter(chapter => 
                completedChapters.includes(chapter.id)
              ).length;
              
              moduleCompletion[module.id] = {
                completed: completedCount,
                total: totalChapters,
                isComplete: completedCount === totalChapters,
                percentage: Math.round((completedCount / totalChapters) * 100)
              };
            });
            
            console.log("Module completion data:", moduleCompletion);
            setCompletedModules(moduleCompletion);
          }
        } else {
          console.error("Course not found for ID:", courseId);
          setError("Course not found");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError(`Error loading course: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleStartContinueLearning = (moduleId) => {
    // Find first incomplete chapter in the module
    const module = modules.find(m => m.id === moduleId);
    if (!module || !module.chapters || module.chapters.length === 0) return;
    
    const moduleCompletion = completedModules[moduleId];
    
    // If module is complete, navigate to first chapter
    if (moduleCompletion?.isComplete) {
      navigate(`/student/mylearning/learn/${courseId}`);
      return;
    }
    
    // Find first incomplete chapter
    module.chapters.sort((a, b) => (a.chapterno || 0) - (b.chapterno || 0));
    navigate(`/student/mylearning/learn/${courseId}`);
  };

  const handleCertificateAction = () => {
    setShowCertGenerator(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium text-gray-700">Loading your course...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-medium text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-medium text-lg">Course data not available</div>
      </div>
    );
  }

  // Calculate overall course completion
  const totalModules = modules.length;
  const completedModulesCount = Object.values(completedModules).filter(m => m.isComplete).length;
  const completionPercentage = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0;
  const isAheadOfSchedule = completionPercentage > 35; // Just an example threshold
  const isCourseCompleted = completionPercentage === 100;

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* Course title at the top */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{courseData.courseName}</h1>
        <p className="text-gray-600 mt-2">{courseData.description}</p>
      </div>
      
      {/* Certificate/Goal Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Completion Progress</h2>
        
        <div className="relative mb-6">
          {/* Progress bar */}
          <div className="h-3 bg-green-100 rounded-full">
            {/* Completed portion */}
            <div 
              className="absolute left-0 top-0 h-3 bg-green-700 rounded-full" 
              style={{ width: `${completionPercentage * 0.7}%` }}
            ></div>
            
            {/* Striped section for "ahead of pace" */}
            <div 
              className="absolute h-3 bg-green-500 rounded-full overflow-hidden"
              style={{ 
                left: `${completionPercentage * 0.7}%`, 
                width: `${completionPercentage * 0.3}%`,
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
              }}
            ></div>
            
            {/* Current position indicator */}
            <div 
              className="absolute w-6 h-6 bg-white border-2 border-green-700 rounded-full shadow-md z-10 top-1/2 transform -translate-y-1/2 ml-[-10px]"
              style={{ left: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
         
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg text-gray-700">
            Complete all mandatory <span className="font-semibold text-green-600">courses</span>  by meeting their individual {' '}
              <span className="font-semibold text-gray-800">completion criteria</span>
            </p>
          </div>
          
          <div className="flex items-center">
            {isCourseCompleted ? (
              <Button 
                onClick={handleCertificateAction} 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                Generate Certificate
                <TrophyIcon size={16} className="ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={() => navigate(`/student/mylearning/learn/${courseId}`)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
              >
                Continue Learning
                <ChevronRightIcon size={16} className="ml-1" />
              </Button>
            )}
            <div className="ml-4 flex items-center">
              <img src="https://ik.imagekit.io/growthx100/icon(6).svg" alt="Certificate" className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Generator */}
      {showCertGenerator && (
        <CertificateGenerator 
          courseId={courseId} 
          courseName={courseData.courseName}
          courseCategory={courseData.category || "General"}
        />
      )}

     
      
      {/* Learning Path */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 mt-7">Learning Path</h2>
        
        {modules.length > 0 ? (
          <div className="relative">
            {/* Timeline tracker */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-300"></div>
            
            <div className="space-y-6">
              {modules.map((module, index) => {
                const moduleStats = completedModules[module.id] || {
                  completed: 0,
                  total: module.chapters?.length || 0,
                  percentage: 0,
                  isComplete: false
                };
                
                return (
                  <div 
                    key={module.id}
                    className="relative pl-16"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-8 top-8 w-4 h-4 rounded-full z-10 transform -translate-x-1/2 ${
                      moduleStats.isComplete ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    
                    <div className={`border rounded-lg overflow-hidden transition-all ${
                      moduleStats.isComplete ? 'border-green-200' : 'border-gray-200'
                    }`}>
                      <div className="flex flex-col md:flex-row">
                        {/* Course details */}
                        <div className="p-6 md:w-2/3">
                          <div className="flex items-start mb-3">
                            <div className="mr-3 flex-shrink-0">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-semibold">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm mb-1">Course {index + 1}</p>
                              <h3 className="font-semibold text-lg text-gray-800">{module.moduleName}</h3>
                              <div className="flex items-center mt-2 text-sm text-gray-600">
                                <BookOpenIcon size={16} className="mr-1" />
                                <span>{moduleStats.total} chapters</span>
                                {moduleStats.completed > 0 && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>
                                      {moduleStats.completed}/{moduleStats.total} completed
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                            <div 
                              className={`h-2 rounded-full ${moduleStats.isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${moduleStats.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Action button */}
                        <div className="bg-gray-50 p-6 md:w-1/3 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-200">
                          {moduleStats.isComplete ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircleIcon size={20} className="mr-2" />
                              <span className="font-medium">Completed</span>
                            </div>
                          ) : (
                            <Button 
                              onClick={() => handleStartContinueLearning(module.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
                            >
                              {moduleStats.completed > 0 ? 'Continue Learning' : 'Start Learning'}
                              <ChevronRightIcon size={16} className="ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center p-10 border rounded-lg bg-gray-50">
            <p className="text-lg text-gray-500">No modules found for this course.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseTracker;
