import  { useState, useEffect } from 'react';
import './assests/RadioButton.css';


const QuizFrontend = ({ quiz }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(new Array(quiz.questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [celebration, setCelebration] = useState(false);

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

  const currentQuestion = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    if (celebration) {
      const timeoutId = setTimeout(() => {
        setCelebration(false);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [celebration]);

  return (
    <div className="quiz-frontend" style={{ backgroundColor: '', minHeight: '100vh', padding: '20px' }}>
      {!showResult && (
        <div className= "bg-opacity-30 backdrop-blur-sm" style={{ backgroundColor: '', borderRadius: '10px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '20px' }}>{quiz.course}</h1>
          <div key={currentQuestionIndex} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ color: '#fff', fontSize: '18px', marginRight: '10px' }}>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h2>
              <div style={{ backgroundColor: '#e74c3c', height: '20px', width: '200px', borderRadius: '10px', position: 'relative' }}>
                <div
                  style={{
                    backgroundColor: '#2ecc71',
                    height: '100%',
                    width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                    borderRadius: '10px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
            <p style={{ color: '#fff' }}>{currentQuestion.question}</p>
            <div style={{ marginTop: '10px' }}>
              {currentQuestion.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={optionIndex}
                    checked={userAnswers[currentQuestionIndex] === optionIndex}
                    onChange={() => handleAnswerChange(optionIndex)}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                  />
                  {option.option}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                style={{
                  backgroundColor: 'rgb(57 73 171 / var(--tw-bg-opacity))',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Previous
              </button>
            )}
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                style={{
                  backgroundColor: 'rgb(57 73 171 / var(--tw-bg-opacity))',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                style={{
                  backgroundColor: 'rgb(57 73 171 / var(--tw-bg-opacity))',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
      {showResult && (
        <div style={{ backgroundColor: '#2c3e50', borderRadius: '10px', padding: '20px', maxWidth: '800px', margin: '0 auto', position: 'relative', minHeight: '80vh',  alignContent: 'center' }}>
          <button
            onClick={() => setShowResult(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 style={{ color: '#fff', fontSize: '64px', marginBottom: '20px', textAlign: 'center' }} >Result</h2>
          <p style={{ color: '#fff', textAlign: 'center',fontSize: '21px', }}>
            You scored {score} out of {quiz.questions.length} questions.
          </p>
          {celebration && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '100vh',
                  maxWidth: '800px',
                }}
              >
                <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Congratulations!</h2>
                <p style={{ marginBottom: '20px'}}>You have completed the quiz.</p>
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#f1c40f',
                      borderRadius: '50%',
                      marginRight: '10px',
                      animation: 'celebration 1s infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#e67e22',
                      borderRadius: '50%',
                      marginRight: '10px',
                      animation: 'celebration 1s infinite 0.2s',
                    }}
                  />
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#2ecc71',
                      borderRadius: '50%',
                      animation: 'Celebration 1s infinite 0.4s',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes celebration {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default QuizFrontend;