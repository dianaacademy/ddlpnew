import React, { useState } from 'react';
import TakeQuiz from './TakeQuiz';
import QuizFrontend from './QuizFrontend';

const QuizRouter = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  return (
    <div className="container mx-auto p-4 relative z-10 ">
      {!selectedQuiz ? (
        <TakeQuiz onStartQuiz={handleStartQuiz}  />
      ) : (
        <QuizFrontend quiz={selectedQuiz} />
      )}
    </div>
  

  );
};

export default QuizRouter;
