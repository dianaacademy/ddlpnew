'use client';
import { useState, useEffect, useRef } from 'react';

const CourseContent = ({ items }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const firstBtnRef = useRef();

  useEffect(() => {
    firstBtnRef.current.focus();
  }, []);

  return (
<>

<div className="w-full min-h-[34vh] bg-transparent backdrop-blur-[20px] border border-red-500 rounded-lg flex flex-row-reverse">
  <div className="flex-1 relative">
    <div className="absolute inset-0 p-10 bg-opacity-30"></div>
    <img
      src="https://ik.imagekit.io/growthx100/default-image.jpg?updatedAt=1709902412480"
      alt="Cyber Security"
      className="w-[300px] h-[300px] object-cover  ml-auto "
    />
  </div>
  <div className="flex-1 p-8 flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Cyber Security with AI</h1>
    <p className="text-gray-600 text-center">The DIANA'S CERTIFIED DOUBLE A+ CERTIFICATION course is designed to provide participants with a comprehensive understanding of cyber threats and vulnerabilities, as well as the tools and techniques used to identify and mitigate them. The course covers topics such as risk management, threat analysis, and incident response.</p>
  </div>
</div>

<div className='bg-sky-100 flex justify-center items-center py-12'>
  <div className=' flex flex-col gap-y-2 w-full'>
    <div className='bg-indigo-700 p-3 rounded-xl flex justify-between items-center gap-x-4 font-bold text-white'>
      {items.map((item, index) => (
        <button
          ref={index === 0 ? firstBtnRef : null}
          key={index}
          onClick={() => setSelectedTab(index)}
          className={`outline-none flex-1 p-3 hover:bg-indigo-300 rounded-xl text-center focus:ring-2 focus:bg-white focus:text-blue-600  ${
            selectedTab === index ? 'ring-2 bg-white text-blue-600' : ''
          }`}
        >
          {item.title}
        </button>
      ))}
    </div>
    <div className=' p-2 rounded-xl'>
      {items.map((item, index) => (
        <div className={`${selectedTab === index ? '' : 'hidden'}`}>
          {item.content}
        </div>
      ))}
    </div>
  </div>
    </div>
    </>
  );
};

export default CourseContent;