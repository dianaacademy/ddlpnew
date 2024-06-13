import React from 'react';

const TextContent = ({ content }) => {
  return (
    <div className="text-content">
      <h3>Text Content</h3>
      <p>{content}</p>
    </div>
  );
};

export default TextContent;