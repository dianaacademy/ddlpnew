import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';

function LabList({ onSelectLab }) {
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    const fetchLabs = async () => {
      const querySnapshot = await getDocs(collection(db, 'labs'));
      const labsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLabs(labsData);
    };

    fetchLabs();
  }, []);

  return (
    <div className="bg-gray-100 shadow-md rounded p-4 w-full max-w-xs">
      <h2 className="text-xl font-bold mb-4">Labs</h2>
      <ul>
        {labs.map((lab) => (
          <li
            key={lab.id}
            className="mb-2 p-2 bg-white shadow cursor-pointer rounded"
            onClick={() => onSelectLab(lab)}
          >
            {lab.question}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LabList;
