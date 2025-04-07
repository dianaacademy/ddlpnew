import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home/home';
import ErrorPage from './components/404';
import 'swiper/css';
import { LoginPage } from './views/auth/login';
import SignupPage from './views/auth/signup';
import Admin from './layouts/admin';
import Instructor from './layouts/instructor';
import Student from './layouts/students';
import Kids from './layouts/Kids';
import Blog from './components/blog';
import Creator from './layouts/creators';
import Lab from "./layouts/labs";
import CourseViewPage from './views/student/course-viewer/Courseviewer';
import Learning from "@/views/student/component/learning";
import { AuthProvider } from './auth/hooks/useauth';
import PrivateRoute from './utils/PrivateRoutes';
import AuthenticatedRoute from './views/student/AuthRoutes';
import SplashScreen from './views/admin/SplashScreen';
import Course from './components/course';
import CourseStudent from './components/Home/allcourses';
import DianaJuniorCoursesPage from './components/Home/KidsPViewer';
import SupportCenterPage from './components/Home/helpandSupport';
import ContactUsPage from './components/Home/ContactPage';
import TermsAndConditions from './components/terms';
import PrivacyPolicy from './components/privacy';
import SQLLearningPage from './components/Home/SqlLanding';
import CompleteProfilePage from './views/auth/CompleteProf';
import ProfilePage from './views/auth/ProfilePage';
import CourseTracker from './views/student/Coursetrack/CourseTracker';
import Certificate from './views/student/Coursetrack/CertDesign';
import { PhoneLoginPage } from './views/auth/PhoneLogin';
import { ForgetPasswordPage } from './views/auth/forgotpass';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handleReload = () => {
      setShowSplash(true);
    };
    window.addEventListener('beforeunload', handleReload);
    return () => {
      window.removeEventListener('beforeunload', handleReload);
    };
  }, []);

  const handleAnimationEnd = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onAnimationEnd={handleAnimationEnd} />
      ) : (
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<ErrorPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgetPasswordPage />} />
              <Route path="contact" element={<ContactUsPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="course" element={<CourseStudent />} />
              <Route path="help" element={<SupportCenterPage />} />
              <Route path="Junior" element={<DianaJuniorCoursesPage/>}/>
              <Route path="blog" element={<Blog />} />
              <Route path="learn-sql" element={<SQLLearningPage />} />
              <Route path="terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="lab" element={<Lab />} />
              <Route path="viewer" element={<CourseViewPage />} />
              <Route path="course/:slug" element={<Course/>} />
              <Route path="complete-profile/:slug" element={<CompleteProfilePage/>} />
              <Route path="samplecert" element={<Certificate/>} />
              <Route path="course" element={<Course />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="phonelogin" element={<PhoneLoginPage />} />
              
              
              <Route path="student/mylearning/learn/:slug" element={
               
                  <Learning />
                
              } />
              
              <Route path="/student/course-tracker/:courseId" element={
                
                  <CourseTracker />
                
              } />
              
              <Route path="admin/*" element={<PrivateRoute allowedRoles={['Admin']}><Admin /></PrivateRoute>} />
              <Route path="admin/*" element={<PrivateRoute allowedRoles={['Admin']}><Admin /></PrivateRoute>} />
              <Route path="Kids/*" element={<PrivateRoute allowedRoles={['Kids']}> <Kids /></PrivateRoute>} />
              <Route path="instructor/*" element={
                <PrivateRoute allowedRoles={['instructor']}><Instructor />
              </PrivateRoute>
              } />
              <Route path="student/*" element={ 
                <PrivateRoute allowedRoles={['Student']}><Student /></PrivateRoute>
              }/>
              <Route path="creator/*" element={
                <PrivateRoute allowedRoles={['Creator']}>
                  <Creator />
                </PrivateRoute>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;