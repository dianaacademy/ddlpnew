import { useState, useEffect } from 'react';

const QuizFrontend = ({ quiz, chapterTitle }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [celebration, setCelebration] = useState(false);

  useEffect(() => {
    if (quiz && quiz.questions) {
      setUserAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz]);

  const handleAnswerChange = (optionIndex) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newUserAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quiz.questions.forEach((question, questionIndex) => {
      const correctOptionIndex = question.options.findIndex((option) => option.isCorrect);
      if (userAnswers[questionIndex] === correctOptionIndex) {
        score++;
      }
    });
    setScore(score);
    setShowResult(true);
    setCelebration(true);
  };

  useEffect(() => {
    if (celebration) {
      const timeoutId = setTimeout(() => {
        setCelebration(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [celebration]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div>No quiz data available.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="bg-white min-h-screen ">
      {!showResult && (
        <div className="bg-white bg-opacity-30  rounded-lg p-5 max-w-3xl  ">
          <h1 className="text-gray-800 font-bold text-2xl mb-5">{chapterTitle || "Quiz"}</h1>
          <div key={currentQuestionIndex} className="mb-5">
            <div className="flex items-center mb-3">
              <h2 className="text-gray-800 text-lg mr-3">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h2>
              <div className="bg-gray-200 h-2.5 flex-grow rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-500 ease-in-out"
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-gray-800 text-base mb-4">👉 {currentQuestion.question}</p>
            <div className="mt-3">
              {currentQuestion.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`block p-3 mb-2 border border-gray-300 rounded-md cursor-pointer transition-colors duration-300 ${
                    userAnswers[currentQuestionIndex] === optionIndex ? 'bg-blue-100' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={optionIndex}
                      checked={userAnswers[currentQuestionIndex] === optionIndex}
                      onChange={() => handleAnswerChange(optionIndex)}
                      className="form-radio h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{option.option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-5">
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Previous
              </button>
            )}
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
      {showResult && (
        <div className="bg-white rounded-lg p-5 max-w-3xl mx-auto relative min-h-[80vh] shadow-md">
          <button
            onClick={() => setShowResult(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-gray-800 text-4xl mb-5 text-center">Result</h2>
          <p className="text-gray-800 text-center text-2xl">
            You scored {score} out of {quiz.questions.length} questions.
          </p>
          {celebration && (
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-90 z-10">
              <div className="bg-white rounded-lg p-5 flex flex-col items-center shadow-md">
                <h2 className="text-3xl mb-3 text-gray-800">Congratulations!</h2>
                <p className="mb-5 text-gray-600">You have completed the quiz.</p>
                <div className="flex">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className={`w-5 h-5 rounded-full ${
                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-orange-400' : 'bg-green-400'
                      } ${index < 2 ? 'mr-3' : ''} animate-bounce`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizFrontend;