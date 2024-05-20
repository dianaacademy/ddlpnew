import { useState } from 'react';
import Lab from './Labbuilder/Lab';
import LabList from './Labbuilder/Lablist';

function Labfind() {
    const [selectedLab, setSelectedLab] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
    <div className="flex w-full max-w-4xl">
      <LabList onSelectLab={setSelectedLab} />
      <Lab lab={selectedLab} />
    </div>
  </div>
  )
}

export default Labfind
