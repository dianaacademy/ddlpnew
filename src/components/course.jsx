import React from 'react'
import StudentHires from './studenthire'
import Header from './header'
function course() {
  return (
    <div>
        <div className="min-h-screen  bg-gray-100">
   <Header/>
      <main>
        <div className="max-w-7xl pt-40  mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upskilling Courses upgraded for 10X greater outcomes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black text-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2">Coding Ninjas TechVarsity</h3>
                  <p className="mb-4">2 years program for 1st to pre-final year college students</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>Get job assistance</li>
                    <li>Complete CS education</li>
                    <li>2 year flexible student track</li>
                  </ul>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded">Explore TechVarsity</button>
                </div>
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2">Job Bootcamp</h3>
                  <p className="mb-4">Extensive program for working professionals</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>Get job assistance</li>
                    <li>FSD/Data career tracks</li>
                    <li>9 months intensive bootcamp</li>
                  </ul>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded">Explore Job Bootcamp</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
        <h2 className="text-blue-600 text-sm font-semibold">FOR BEGINNERS AND EXPERIENCED LEARNERS</h2>
        <h1 className="text-3xl font-bold text-gray-800 my-4">Data Structures and Algorithms In Java Course</h1>
        <p className="text-gray-600 mb-6">
          This is the course to pick if you are just getting into coding and want to build a strong foundation. Widely used in IT industry.
        </p>
        <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600">
          Enrol now
        </button>
        <div className="mt-6 flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-yellow-500 text-2xl">&#9733;</span>
            <span className="text-gray-800 text-xl ml-2">4.8</span>
          </div>
          <div className="text-gray-600">30K+ Learners enrolled</div>
          <div className="text-gray-600">60+ Hours of lectures</div>
          <div className="text-gray-600">350+ Problems</div>
        </div>
      </div>
      <div className="mt-8">
        <img src="path_to_your_image" alt="Instructor" className="w-64 h-64 object-cover rounded-full mx-auto" />
      </div>
    </div>

    <StudentHires/>
      
    </div>
  )
}

export default course
