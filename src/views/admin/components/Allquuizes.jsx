import  { useState, useEffect } from 'react';
// import { Firestore } from 'firebase/firestore';
import { storage } from '@/firebase.config';
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const snapshot = await storage.collection('quizzes').get();
      const quizData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizData);
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h2>Quizzes</h2>
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.id}>
            <h3>{quiz.title}</h3>
            <ul>
              {quiz.content.questions.map((question, index) => (
                <li key={index}>
                  <p>{question.questionText}</p>
                  <ul>
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex}>{option}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
