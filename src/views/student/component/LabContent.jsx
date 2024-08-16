import React, { useState, useRef, useEffect } from "react";

const LabContent = ({ labData }) => {
  const [feedback, setFeedback] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [feedback]);

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const isCorrect = 
      Math.abs(x - labData.details.answerArea.x) < 30 && 
      Math.abs(y - labData.details.answerArea.y) < 30;

    if (isCorrect) {
      setFeedback({ type: 'correct', x, y });
    } else {
      setFeedback({ type: 'incorrect', x, y });
    }
  };

  return (
    <div className="bg-white  rounded p-4 w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">{labData.chapterName}</h2>
      <p className="text-gray-800 font-bold text-2xl mb-3 ">Question : {labData.details.question}</p>
      <div className="relative">
        <img
          ref={imgRef}
          src={labData.details.imageUrl}
          alt="Lab"
          onClick={handleClick}
          className="w-full"
        />
        {feedback && (
          <div
            style={{ 
              position: 'absolute',
              left: `${feedback.x}px`,
              top: `${feedback.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {feedback.type === 'correct' ? (
  <div className="">
    <img 
      src="https://ik.imagekit.io/growthx100/icon(4).svg?updatedAt=1719486344274" 
      alt="correct icon" 
      width="30px" 
    />
  </div>
) : (
  <div className="">
    
    <img 
      src="https://ik.imagekit.io/growthx100/icon(5).svg?updatedAt=1719486414686" 
      alt="wrong icon" 
      width="30px"  
    />
  </div>
)}

          </div>
        )}
      </div>
    </div>
  );
};

export default LabContent;