import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../../../firebase.config';

function LabBuilder({ onLabDetailsChange }) {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answerArea, setAnswerArea] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
      onLabDetailsChange({ imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleSetAnswerArea = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const area = { x, y };
    setAnswerArea(area);
    onLabDetailsChange({ answerArea: area });
  };

  const handleSaveLab = async () => {
    if (!imageFile || !question || !answerArea) {
      alert('Please complete all fields before saving.');
      return;
    }

    const storageRef = ref(storage, `labsimages/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef) ;

    const labData = {
      imageUrl,
      question,
      answerArea,
    };

    await addDoc(collection(db, 'labs'), labData);
    alert('Lab saved!');
    onLabDetailsChange({ imageUrl, question, answerArea });
  };

  return (
    <div className="bg-white shadow-md rounded p-4 mb-4 w-full max-w-xl">
      <h2 className="text-xl font-bold mb-4">Lab Builder</h2>
      <input type="file" onChange={handleImageUpload} className="mb-2" />
      <input
        type="text"
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          onLabDetailsChange({ question: e.target.value });
        }}
        placeholder="Enter the question"
        className="mb-2 p-2 border rounded w-full"
      />
      <button
        onClick={() => setAnswerArea(null)}
        className="mb-2 p-2 bg-blue-500 text-white rounded"
      >
        Reset Answer Area
      </button>
      <div className="relative">
        {image && (
          <img
            src={image}
            alt="Upload"
            onClick={handleSetAnswerArea}
            className="w-full"
          />
        )}
        {answerArea && (
          <div
            className="absolute bg-red-500 opacity-50"
            style={{
              left: `${answerArea.x}px`,
              top: `${answerArea.y}px`,
              width: '40px',
              height: '40px',
            }}
          />
        )}
      </div>
      <button
        onClick={handleSaveLab}
        className="mt-4 p-2 bg-green-500 text-white rounded"
      >
        Save Lab
      </button>
    </div>
  );
}

export default LabBuilder;
