import './App.css'
import {BrowserRouter, Routes, Route } from "react-router-dom";
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
import CourseViewer from './views/admin/CourseViewer';
import { AuthProvider } from './auth/hooks/useauth';
import PrivateRoute from './utils/PrivateRoutes';
import CourseBuild from './views/admin/Coursebuild';
import ModuleBuild from './views/admin/Modulebuild';

function App() {
    return (
    <>
		<BrowserRouter>
    <AuthProvider>
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="blog" element={<Blog />} />
      <Route path="lab" element={<Lab />} />
      <Route path="viewer" element={<CourseViewPage />} />
      <Route path="student/mylearning/learn/:slug" element={<Learning />} />
      
      {/* <Route path="admin/courses/:slug" element={<CourseViewer/>} />

      <Route path="admin/courses/build/:slug" element={<CourseBuild/>} />
      <Route path="admin/courses/build/:slug/module/:moduleId" element={<ModuleBuild/>} /> */}






      



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
      
    </>
  )
}

export default App
