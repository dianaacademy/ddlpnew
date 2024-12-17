import React, { useState } from "react";

const StudyPath = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const lessons = [
    { id: 1, title: "Lesson 1 of 8", description: "Basics of Spanish", completed: false },
    { id: 2, title: "Lesson 2 of 8", description: "Pronouns and Verbs", completed: false },
    { id: 3, title: "Lesson 3 of 8", description: "Vocabulary Basics", completed: false },
    // Add more lessons as needed
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center space-y-8">
      {/* Header Section */}
      <div className="w-full max-w-md bg-green-500 p-4 rounded-lg text-left">
        <h2 className="text-xl font-bold">Unit 1</h2>
        <p className="text-sm">Basics of Spanish.</p>
        <button className="float-right bg-white text-green-500 px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90">
          Continue
        </button>
      </div>

      {/* Lesson Path */}
      <div className="flex flex-col items-center space-y-8">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            className={`relative flex items-center justify-center w-24 h-24 rounded-full cursor-pointer ${
              lesson.completed ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            {/* Lesson Icon */}
            <span className="text-2xl">
              {lesson.completed ? "⭐" : "🔒"}
            </span>

            {/* Lesson Details */}
            {selectedLesson && selectedLesson.id === lesson.id && (
              <div className="absolute top-28 w-60 p-4 bg-black rounded-lg text-center shadow-lg">
                <h3 className="text-md font-bold">{`Unit 1`}</h3>
                <p className="text-sm mt-1">{lesson.title}</p>
                <button className="mt-3 bg-green-500 px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-400">
                  START
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPath;
