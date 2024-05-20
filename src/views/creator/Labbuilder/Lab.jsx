// src/components/Lab.js
import React from 'react';
import { useState } from 'react';

function Lab({ lab }) {
  const [clicked, setClicked] = useState(null);

  if (!lab) return null;

  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setClicked({ x, y });

    const isCorrect =
      Math.abs(x - lab.answerArea.x) < 10 && Math.abs(y - lab.answerArea.y) < 10;
    alert(isCorrect ? 'Correct!' : 'Wrong!');
  };

  return (
    <div className="bg-white shadow-md rounded p-4 w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">Lab</h2>
      <p className="mb-2">{lab.question}</p>
      <div className="relative">
        <img
          src={lab.imageUrl}
          alt="Lab"
          onClick={handleClick}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default Lab;
