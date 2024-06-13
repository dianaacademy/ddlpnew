import React from 'react';

const QuizContent = ({ quizData }) => {
  return (
    <div className="quiz-content">
      <h3>Quiz Content</h3>
      <pre>{JSON.stringify(quizData, null, 2)}</pre>
    </div>
  );
};

export default QuizContent;