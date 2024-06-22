import { useState } from 'react';
import { FiTrash2, FiCheck } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ChapterQuizform = ({ questions, setQuestions }) => {
  const [quizName, setQuizName] = useState('');

  const handleQuizChange = (e) => {
    setQuizName(e.target.value);
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleHintChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].hint = e.target.value;
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
    setQuestions([
      ...questions,
      { question: '', hint: '', options: [{ option: '', isCorrect: false }] },
    ]);
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
      <div className="flex-1 dark:bg-main-dark-bg bg-main-bg min-h-screen">
        <div className="flex justify-center mt-10 pt-10">
          <Card className="w-[1400px] px-4 py-4">
            <h1 className="font-bold text-center">Quiz Builder</h1>
            <div className="mb-4">
              <label htmlFor="quiz" className="block font-bold mb-2">
                Quiz Name
              </label>
              <Input
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
                  <Button variant="outline" onClick={() => handleDeleteQuestion(questionIndex)}>
                    <FiTrash2 className="" />
                  </Button>
                </div>
                <div className="mb-2">
                  <label htmlFor={`question-${questionIndex}`} className="block font-bold mb-1">
                    Question
                  </label>
                  <Input
                    type="text"
                    id={`question-${questionIndex}`}
                    value={question.question}
                    onChange={(e) => handleQuestionChange(questionIndex, e)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor={`hint-${questionIndex}`} className="block text-green-600  mb-1">
                    Hint
                  </label>
                  <Input
                    type="text"
                    id={`hint-${questionIndex}`}
                    value={question.hint}
                    onChange={(e) => handleHintChange(questionIndex, e)}
                  />
                </div>
                <div>
                  <h3 className="text-md font-bold mb-2">Options</h3>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <Input
                        type="text"
                        value={option.option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                      />
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          onClick={() => handleCorrectOption(questionIndex, optionIndex)}
                          className={`p-2 rounded mr-2 ${
                            option.isCorrect ? 'bg-green-500 ' : 'bg-gray-300 text-gray-700'
                          }`}
                        >
                          <FiCheck className={`${option.isCorrect ? '' : 'text-gray-700'}`} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteOption(questionIndex, optionIndex)}
                          className="bg-red-500 p-2 rounded hover:bg-red-600"
                        >
                          <FiTrash2 className="" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleAddOption(questionIndex)}
                    className="px-1 py-1 rounded"
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={handleAddQuestion}
              className="px-4 py-2 rounded block mx-auto"
            >
              Add Question
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChapterQuizform;
