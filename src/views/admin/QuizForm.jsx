import  { useState, useEffect } from 'react';
import { FiTrash2, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../auth/hooks/useauth';
import { db } from '../../firebase.config';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const QuizBuilder = () => {
  const currentUser = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: [{ option: '', isCorrect: false }] }]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const snapshot = await getDocs(coursesCollection);
      const courseData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseData);
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleQuizChange = (e) => {
    setQuizName(e.target.value);
  };

  const handleSubmitQuiz = async () => {
    if (quizName.trim() === '' || selectedCourse === '') {
      setShowErrorModal(true);
      return;
    }

    const hasCorrectOption = questions.every((question) =>
      question.options.some((option) => option.isCorrect)
    );

    if (!hasCorrectOption) {
      setShowErrorModal(true);
      return;
    }

    try {
      const quizRef = collection(db, 'quizzes');
      const quizData = { quizName, course: selectedCourse, questions };
      await addDoc(quizRef, quizData);
      setShowSuccessModal(true);
      setSelectedCourse('');
      setQuizName('');
      setQuestions([{ question: '', options: [{ option: '', isCorrect: false }] }]);
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].option = e.target.value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ option: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleCorrectOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((option, idx) => {
      option.isCorrect = idx === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: [{ option: '', isCorrect: false }] }]);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(questionIndex, 1);
    setQuestions(newQuestions);
  };

  return (
    <div className="flex relative dark:bg-main-dark-bg m-0">
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">Quiz added successfully!</p>
            <div className="flex justify-center">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
             >
            OK
           </button>
           </div>

          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">
              Please fill in all required fields and ensure at least one option is marked as correct.
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className=" flex-1 dark:bg-main-dark-bg bg-main-bg min-h-screen">
        <div className="flex justify-center mt-10 pt-10">
          <div className="w-4/5 p-16 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Quiz Builder</h1>
            <div className="mb-4">
              <label htmlFor="course" className="block font-bold mb-2">
                Course Name
              </label>
              <select
                id="course"
                value={selectedCourse}
                onChange={handleCourseChange}
                className="border border-gray-400 p-2 w-full rounded-md"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="quiz" className="block font-bold mb-2">
                Quiz Name
              </label>
              <input
                type="text"
                id="quiz"
                value={quizName}
                onChange={handleQuizChange}
                className="border border-gray-400 p-2 w-full rounded-md"
              />
            </div>
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold">Question {questionIndex + 1}</h2>
                  <button
                    onClick={() => handleDeleteQuestion(questionIndex)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    <FiTrash2 className="text-white" />
                  </button>
                </div>
                <div className="mb-2">
                  <label htmlFor={`question-${questionIndex}`} className="block font-bold mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    id={`question-${questionIndex}`}
                    value={question.question}
                    onChange={(e) => handleQuestionChange(questionIndex, e)}
                    className="border border-gray-400 p-2 w-full rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-md font-bold mb-2">Options</h3>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option.option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                        className="border border-gray-400 p-2 mr-2 flex-grow rounded-md"
                      />
                      <div className="flex items-center">
                        <button
                          onClick={() => handleCorrectOption(questionIndex, optionIndex)}
                          className={`p-2 rounded mr-2 ${
                            option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          <FiCheck className={`${option.isCorrect ? 'text-white' : 'text-gray-700'}`} />
                        </button>
                        <button
                          onClick={() => handleDeleteOption(questionIndex, optionIndex)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          <FiTrash2 className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddOption(questionIndex)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Option
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block mx-auto"
            >
              Add Question
            </button>
            <button
              onClick={handleSubmitQuiz}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 block mx-auto mt-4"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;