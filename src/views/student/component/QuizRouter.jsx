import React, { useState, useEffect } from 'react';
import TakeQuiz from './TakeQuiz';
import QuizFrontend from './QuizFrontend';
import { db } from '../../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';

const QuizRouter = ({ quizData }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

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

    if (!quizData) {
      fetchQuizzes();
    } else {
      setSelectedQuiz(quizData);
    }
  }, [quizData]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  return (
    <div className="container mx-auto p-4 relative z-10">
      {!selectedQuiz ? (
        <TakeQuiz quizzes={quizzes} onStartQuiz={handleStartQuiz} />
      ) : (
        <QuizFrontend quiz={selectedQuiz} />
      )}
    </div>
  );
};

export default QuizRouter;
