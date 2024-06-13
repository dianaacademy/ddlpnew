import React from 'react';

const LabContent = ({ labData }) => {
  return (
    <div className="lab-content">
      <h3>Lab Content</h3>
      <pre>{JSON.stringify(labData, null, 2)}</pre>
    </div>
  );
};

export default LabContent;