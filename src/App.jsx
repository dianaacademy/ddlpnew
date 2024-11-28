import  { useState, useEffect } from 'react';
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
import Blog from './components/blog';
import Creator from './layouts/creators';
import Lab from "./layouts/labs";
import CourseViewPage from './views/student/course-viewer/Courseviewer';
import Learning from "@/views/student/component/learning";
import { AuthProvider } from './auth/hooks/useauth';
import PrivateRoute from './utils/PrivateRoutes';
import SplashScreen from './views/admin/SplashScreen';
import Course from './components/course';

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
              <Route path="login" element={<LoginPage />} />
              <Route path="blog" element={<Blog />} />
              <Route path="lab" element={<Lab />} />
              <Route path="viewer" element={<CourseViewPage />} />
              <Route path="course/:slug" element={<Course />} />
              <Route path="course" element={<Course />} />


              <Route path="student/mylearning/learn/:slug" element={<Learning />} />
              <Route path="admin/*" element={
                <PrivateRoute allowedRoles={['Admin']}>
                  <Admin />
                </PrivateRoute>
              } />
              <Route path="instructor/*" element={
                <PrivateRoute allowedRoles={['instructor']}>
                  <Instructor />
                </PrivateRoute>
              } />
              <Route path="student/*" element={
                <PrivateRoute allowedRoles={['Student']}>
                  <Student />
                </PrivateRoute>
              } />
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
