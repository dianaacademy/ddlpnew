import './App.css'
import {BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './auth/hooks/useauth';
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
function App() {
  return (
    <>
		<BrowserRouter>
		
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Home />} />

      
      <Route path="*" element={<ErrorPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="blog" element={<Blog />} />


      <Route path="admin/*" element={<Admin />} />
      <Route path="instructor/*" element={<Instructor />} />
      <Route path="student/*" element={<Student />} />
      <Route path="creator/*" element={<Creator />} />



    </Routes>
    </AuthProvider>
    
  </BrowserRouter>
      
    </>
  )
}

export default App
