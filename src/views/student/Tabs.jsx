import CourseContent from './Coursecontent';
import React from 'react';
import MatchQuiz from './component/MatchQuiz';
import Placeholder from './component/Placeholder';
import QuizRouter from './component/QuizRouter';


const TabsPage = () => {
  return (
    <div className=' rounded-lg mx-4 p-4'>
      
      <br/>

      {/* Tabs Component */}
      <CourseContent items={items} />
    </div>
  );
};

export default TabsPage;

const items = [
  {
    title: 'Match them',
    content: (
      <div className='border-2 border-blue-400 rounded-lg p-4'>
        <h1 className='text-3xl text-blue-600 font-bold'>Chapter 1</h1>
        <MatchQuiz/>
      </div>
    ),
  },
  {
    title: 'Place holder',
    content: (
      <div className='border-2 border-blue-400 rounded-lg p-4'>
        <h1 className='text-3xl text-blue-600 font-bold'>Chapter 1</h1>
        <Placeholder/>
      </div>
    ),
  },
  {
    title: 'Quiz',
    content: (
      <div className='border-2 border-blue-400 rounded-lg p-4'>
        <h1 className='text-3xl text-blue-600 font-bold'>Quiz Chapter 1</h1>
        <QuizRouter/>
      </div>
    ),
  },
  {
    title: 'Content',
    content: (
      <div className='border-2 border-blue-400 rounded-lg p-4'>
        <h1 className='text-3xl text-blue-600'>Title Test 4</h1>
        <p>
          Lorem ipsum dolor sit ue architecto dolorum, minima enim quidem
          voluptatibus at nulla deleniti harum! Totam, mollitia quos voluptatem
          deleniti provident obcaecati rerum.
        </p>
      </div>
    ),
  },
  {
    title: 'Attempt Test',
    content: (
      <div className='border-2 border-blue-400 rounded-lg p-4'>
        <h1 className='text-3xl text-blue-600'>Title Test 4</h1>
        <p>
          Lorem ipsum dolor sit ue architecto dolorum, minima enim quidem
          voluptatibus at nulla deleniti harum! Totam, mollitia quos voluptatem
          deleniti provident obcaecati rerum.
        </p>
      </div>
    ),
  },
];