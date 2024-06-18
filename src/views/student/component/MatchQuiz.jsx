import React, { useState } from 'react';
const MatchQuiz = () => {
  const [questions, setQuestions] = useState([
    { id: 1, sentence: 'This is a sentence.', answer: '', options: ['Option 1', 'Option 2', 'Option 3'] },
    { id: 2, sentence: 'This is another sentence.', answer: '', options: ['Option 4', 'Option 5', 'Option 6'] },
    { id: 3, sentence: 'This is yet another sentence.', answer: '', options: ['Option 7', 'Option 8', 'Option 9'] },
    { id: 4, sentence: 'This is a different sentence.', answer: '', options: ['Option 10', 'Option 11', 'Option 12'] },
    { id: 5, sentence: 'This is the last sentence.', answer: '', options: ['Option 13', 'Option 14', 'Option 15'] }
  ]);
  const [draggedOption, setDraggedOption] = useState(null);

  const handleDragStart  = (e, option) => {
    setDraggedOption(option);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, questionId) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return { ...question, answer: draggedOption, options: question.options.filter((option) => option !== draggedOption) };
      }
      return question;
    });
    setQuestions(updatedQuestions);
    setDraggedOption(null);
  };

  const handleRemoveOption = (questionId) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        const removedOption = question.answer;
        const updatedOptions = [...question.options, removedOption].sort();
        return { ...question, answer: '', options: updatedOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    const correctAnswers = questions.filter((question) => question.answer === question.options[0]).length;
    const wrongAnswers = questions.length - correctAnswers;
    alert(`Correct Answers: ${correctAnswers}, Drop here: ${wrongAnswers}`);
  };

  return (
<>
    <div className="container mx-auto py-8">
      <div className="flex flex-wrap justify-center mb-8">
        {questions.flatMap((question) =>
          question.options.map((option) => (
            <div
              key={`${question.id}-${option}`}
              draggable
              onDragStart={(e) => handleDragStart(e, option)}
              className="border-solid border-2 border-indigo-600 rounded-md py-2 px-4 m-2 cursor-move text-gray-100"
            >
              {option }
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col items-start">
        {questions.map((question) => (
          <div key={question.id} className="flex items-center mb-4">
            <div className=" border-2 border-indigo-600 p-3 rounded-lg mr-4 text-gray-100">
              {question.sentence}
            </div>
            <span className="mr-4 text-gray-100">→</span>
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, question.id)}
              className="border border-2-gray-300  rounded-md relative flex items-center text-gray-100"
            >
              <span className="mr-2 p-3">{question.answer || 'Drop here'}</span>
              {question.answer && (
                <button
                  onClick={() => handleRemoveOption(question.id)}
                  className="text-red-500 hover:text-red-700 focus:outline-none pr-3"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
      <button
        onClick={handleSubmit}
        className="neon-button bg-transparent text-white font-bold py-2 px-4 rounded mt-4 "
      >
        Submit
      </button>

      <style>{`
        :root {
          --neon-color: hsl(217, 100%, 54%); /* Change this to your desired neon color */
          --background-color: hsl(223, 21%, 16%); /* Change this to your desired background color */
        }

        .neon-button {
          position: relative;
          display: inline-block;
          padding: 0.75rem 1.5rem;
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--neon-color);
          border: 0.125rem solid var(--neon-color);
          border-radius: 0.25rem;
          text-shadow: 0 0 0.125rem hsla(0, 0%, 100%, 0.3),
            0 0 0.45rem var(--neon-color);
          box-shadow: inset 0 0 0.5rem 0 var(--neon-color),
            0 0 0.5rem 0 var(--neon-color);
          transition: color 0.2s ease-in-out, text-shadow 0.2s ease-in-out,
            box-shadow 0.2s ease-in-out;
        }

        .neon-button::before {
          content: '';
          position: absolute;
          
          left: 0;
          width: 100%;
          height: 100%;
          
          transform: perspective(1rem) rotateX(40deg) scale(1, 0.35);
          filter: blur(1rem);
          opacity: 0.7;
          transition: opacity 0.2s ease-in-out;
        }

        .neon-button::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          box-shadow: 0 0 2rem 0.5rem var(--neon-color);
          opacity: 0;
          
          z-index: -1;
          transition: opacity 0.2s ease-in-out;
        }

        .neon-button:hover,
        .neon-button:focus {
          color: var(--background-color);
          text-shadow: none;
          box-shadow: 0 0 1rem 0.5rem var(--neon-color); /* Outer glow on hover */
        }

        .neon-button:hover::before,
        .neon-button:focus::before {
          opacity: 1;
        }

        .neon-button:hover::after,
        .neon-button:focus::after {
          opacity: 1;
        }
      `}</style>
      </div>
    </div>
    </>
  );
  
};

export default MatchQuiz;