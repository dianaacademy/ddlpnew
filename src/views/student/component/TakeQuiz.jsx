import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
const TakeQuiz = ({ onStartQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizRef = collection(db, 'quizzes');
        const querySnapshot = await getDocs(quizRef);
        const quizzesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = () => {
    onStartQuiz(selectedQuiz);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Take Quiz</h1>
      <div className="mb-4">
        <label htmlFor="quizSelect" className="block font-bold mb-2 text-gray-100 ">
          Select Quiz
        </label>
        <select
          id="quizSelect"
          value={selectedQuiz ? selectedQuiz.id : ''}
          onChange={(e) => setSelectedQuiz(quizzes.find((quiz) => quiz.id === e.target.value))}
          className="border border-gray-400 p-2 w-full rounded-md"
        >
          <option value="">Select a quiz</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.course}
            </option>
          ))}
        </select>
      </div>
      {selectedQuiz && (
        <button
          onClick={handleStartQuiz}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Start Quiz
        </button>
      )}
    </div>
  );
};

export default TakeQuiz;