import React, { useState } from 'react';

const SQLLearningPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const syllabus = [
    {
      id: 1,
      title: "SQL Fundamentals & Basic Queries",
      description: "Learn how to use SQL to access data stored in a database with basic queries.",
      lessons: [
        "Introduction to SQL",
        "SQL Lesson 1: SELECT queries 101",
        "SQL Lesson 2: Queries with constraints (Pt. 1)",
        "SQL Lesson 3: Queries with constraints (Pt. 2)",
        "SQL Lesson 4: Filtering and sorting Query results",
        "SQL Review: Simple SELECT Queries"
      ]
    },
    {
      id: 2,
      title: "Multi-Table Queries & Data Relationships",
      description: "Perform more complex queries by learning how to work with multiple tables.",
      lessons: [
        "SQL Lesson 6: Multi-table queries with JOINs",
        "SQL Lesson 7: OUTER JOINs",
        "SQL Lesson 8: A short note on NULLs",
        "SQL Lesson 9: Queries with expressions"
      ]
    },
    {
      id: 3,
      title: "Aggregations & Query Mechanics",
      description: "Learn powerful functions for performing complex database operations with ease.",
      lessons: [
        "SQL Lesson 10: Queries with aggregates (Pt. 1)",
        "SQL Lesson 11: Queries with aggregates (Pt. 2)",
        "SQL Lesson 12: Order of execution of a Query"
      ]
    },
    {
      id: 4,
      title: "Data Manipulation & Table Management",
      description: "Expand your SQL skills by creating and manipulating databases with multiple related tables.",
      lessons: [
        "SQL Lesson 13: Inserting rows",
        "SQL Lesson 14: Updating rows",
        "SQL Lesson 15: Deleting rows",
        "SQL Lesson 16: Creating tables",
        "SQL Lesson 17: Altering tables",
        "SQL Lesson 18: Dropping tables"
      ]
    },
    {
      id: 5,
      title: "Advanced Topics & Beyond",
      description: "Explore advanced SQL concepts and techniques for real-world applications.",
      lessons: [
        "SQL Lesson X: To infinity and beyond!"
      ]
    }
  ];

  return (
    <div className="bg-orange-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        {/* Course Header Card */}
        <div className="bg-orange-100 rounded-lg p-6 mb-4 flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0 w-full md:w-[30em]">
            <div className="inline-block bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded mb-2">FREE Course</div>
            <h1 className="text-3xl font-bold mb-2">Learn SQL</h1>
            <p className="text-gray-700 mb-4">
              In this SQL course, you'll learn how to manage large datasets and analyze real data using the standard data management language.
            </p>
            <div className="flex items-center mb-4">
              <span className="font-bold mr-2">4.6</span>
              <div className="flex text-yellow-400">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <span className="text-gray-600 text-sm ml-2">21,354 ratings</span>
            </div>
            <button className="bg-blue-700 text-white py-2 px-4 rounded w-full md:w-48 font-medium">
              Start
            </button>
          </div>

          <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg w-full md:w-[30em]">
            <h3 className="font-bold mb-4">This course includes</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="mr-2">✧</span>
                <p className="text-sm">AI assistance for guided coding help</p>
              </div>
              <div className="flex items-start">
                <span className="mr-2">⚙️</span>
                <p className="text-sm">Projects to apply new skills</p>
              </div>
              <div className="flex items-start">
                <span className="mr-2">📝</span>
                <p className="text-sm">Quizzes to test your knowledge</p>
              </div>
              <div className="flex items-start">
                <span className="mr-2">📋</span>
                <p className="text-sm">A certificate of completion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="mr-2">📊</div>
              <div>
                <div className="text-xs text-gray-500">Skill level</div>
                <div className="font-bold">Beginner</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-2">⏱</div>
              <div>
                <div className="text-xs text-gray-500">Time to complete</div>
                <div className="font-bold">5 hours</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-2">🧩</div>
              <div>
                <div className="text-xs text-gray-500">Projects</div>
                <div className="font-bold">5</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-2">📋</div>
              <div>
                <div className="text-xs text-gray-500">Prerequisites</div>
                <div className="font-bold">None</div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Description Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-4">About this course</h2>
            <p className="text-gray-700 mb-4">
              Information is all around us. You can put it to use by learning SQL basics. Used in
              data science, analytics, and engineering, SQL makes it easy to work with data and
              make more informed strategy, operations, and business decisions. It's a helpful
              skill for anyone who works with data (even in non-tech roles). In this SQL course,
              you'll learn how to manage large datasets and analyze real data.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Skills you'll gain</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
              <span className=" text-white rounded-full p-1 mr-2">
              <img src="https://ik.imagekit.io/growthx100/icon(4).svg?updatedAt=1740765548869" alt="icon" className="w-5 h-5" />
            </span>
            <span>Work with databases using SQL</span>
              </li>
              <li className="flex items-center">
              <span className=" text-white rounded-full p-1 mr-2">
              <img src="https://ik.imagekit.io/growthx100/icon(4).svg?updatedAt=1740765548869" alt="icon" className="w-5 h-5" />
            </span>
                <span>Create queries for tables</span>
              </li>
              <li className="flex items-center">
              <span className=" text-white rounded-full p-1 mr-2">
              <img src="https://ik.imagekit.io/growthx100/icon(4).svg?updatedAt=1740765548869" alt="icon" className="w-5 h-5" />
            </span>
                <span>Build SQL projects</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Syllabus Section */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Syllabus</h2>
              <div className="text-sm text-gray-600">18 lessons • 5 modules • 4 quizzes</div>
            </div>
            
          </div>

          {/* Syllabus Modules */}
          {syllabus.map((module) => (
            <div key={module.id} className="border-b border-gray-200">
              <div 
                className="p-6 flex justify-between items-center cursor-pointer" 
                onClick={() => toggleSection(module.id)}
              >
                <div className="flex items-center">
                  <div className="bg-blue-900 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4">{module.id}</div>
                  <div>
                    <h3 className="font-bold">Module {module.id}: {module.title}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                </div>
                <div
                 className={`transform transition-transform ${
                   expandedSection === module.id ? 'rotate-180' : ''
                   }`}
                >
               <img
                 src="https://ik.imagekit.io/growthx100/icon(5).svg"
                 alt="arrow icon"
                 className="w-4 h-4"
                />
               </div>

              </div>
              
              {/* Expanded content */}
              {expandedSection === module.id && (
                <div className="p-6 pt-0 pl-16 bg-gray-50">
                  <ul className="space-y-2">
                    {module.lessons.map((lesson, index) => (
                      <li key={index} className="flex items-baseline">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5"></span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Certificate Section */}
          <div className="p-6 flex items-center">
            <div className="mr-4">📋</div>
            <div>
              <h3 className="font-bold">Certificate of completion available with Plus or Pro</h3>
              <p className="text-sm text-gray-600">Earn a certificate of completion and showcase your accomplishment on your resume or LinkedIn.</p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center mb-12">
          <button className="bg-blue-700 text-white py-3 px-12 rounded font-medium">
            Start
          </button>
        </div>

        
            
          </div>

          
        </div>
 
  );
};

export default SQLLearningPage;