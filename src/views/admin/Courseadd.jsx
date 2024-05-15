import  { useState } from 'react';
import { Input, Textarea, Button } from "@material-tailwind/react";
import { db, storage } from '../../firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const CourseAdd = () => {
  const [courseName, setCourseName] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [maxStudent, setMaxStudent] = useState('');
  const [whatuLearn, setWhatuLearn] = useState('');
  const [category, setCategory] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [materialInclue, setMaterialInclue] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [maxStudents, setMaxStudents] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState("All Levels");
  const [isPublic, setIsPublic] = useState(true);
  const [enableQA, setEnableQA] = useState(false);
  const difficultyLevels = ["All Levels", "Beginner", "Intermediate", "Expert"];

  const handleNewCourse = async (
    courseName,
    tutorName,
    courseDesc,
    maxStudent,
    whatuLearn,
    materialInclue,
    courseDuration,
    thumbnailFile,
    maxStudents,
    category,
    coursePrice,
    difficultyLevel,
    isPublic,
    enableQA
  ) => {
    try {
      // Generate a unique file name for the thumbnail
      const timestamp = new Date().getTime();
      const uniqueFileName = `${thumbnailFile.name}_${timestamp}`;

      // Upload the thumbnail file to Firebase Storage
      const thumbnailRef = ref(storage, `thumbnails/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(thumbnailRef, thumbnailFile);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Error uploading thumbnail:', error);
        },
        async () => {
          const thumbnailUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Add the course data to Firestore, including the thumbnail URL and additional fields
          const courseRef = collection(db, 'courses');
          await addDoc(courseRef, {
            courseName,
            tutorName,
            courseDesc,
            maxStudent,
            whatuLearn,
            materialInclue,
            courseDuration,
            thumbnailUrl,
            maxStudents,
            category,
            coursePrice,
            difficultyLevel,
            isPublic,
            enableQA,
          });

          // Clear the input fields after successful submission
          setCourseName('');
          setTutorName('');
          setCourseDesc('');
          setMaxStudent('');
          setWhatuLearn('');
          setMaterialInclue('');
          setCourseDuration('');
          setMaxStudents('');
          setCategory('');
          setCoursePrice('');
          setDifficultyLevel('');
          setIsPublic('');
          setEnableQA('');

          setThumbnailFile(null);
          console.log('Course added successfully!');
        }
      );
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const Submit = (e) => {
    e.preventDefault();
    if (courseName.trim() === '' || courseDesc.trim() === '' || !thumbnailFile) {
      console.log('Please fill in all fields and upload a thumbnail.');
      return;
    }

    handleNewCourse(
      courseName,
      tutorName,
      courseDesc,
      maxStudent,
      whatuLearn,
      materialInclue,
      courseDuration,
      thumbnailFile,
      maxStudents,
      category,
      coursePrice,
      difficultyLevel,
      isPublic,
      enableQA
    );
  };

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      <div className=" dark:bg-main-dark-bg bg-main-bg min-h-screen">
        <div className="flex  items-center mt-20">
          <div className="w-full  px-4">
            <div className="mb-4 text-align:center">
              <h1>Add Course</h1>
            </div>
            <div className="mb-4">
              <Input
                label="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Input
                label="Tutor Name"
                value={tutorName}
                onChange={(e) => setTutorName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Textarea
                label="Course Description"
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-4">
                <Input
                  label="Max Students"
                  value={maxStudent}
                  onChange={(e) => setMaxStudent(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Textarea
                  label="What Will I Learn?"
                  value={whatuLearn}
                  onChange={(e) => setWhatuLearn(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Textarea
                  label="Materials Included"
                  value={materialInclue}
                  onChange={(e) => setMaterialInclue(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Total Course Duration"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Input
                  type="file"
                  label="Course Thumbnail"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                />
              </div>
              <div className=" p-8 border-solid rounded-lg shadow-md">
                <h2 className="text-black text-2xl mb-4">Course Settings</h2>

                <div className="flex flex-col mb-4">
                  <div className="grid grid-cols-2">
                    <label
                      className="flex flex-col text-black mb-2"
                      htmlFor="maxStudents"
                    >
                      Maximum Students
                      <span className="text-sm text-gray-500 ">
                        (Number of students that can enrol in this course. Set 0 for no
                        limits.)
                      </span>
                    </label>
                    <div className="flex flex-col items-center">
                      <input
                        className="bg-white rounded-md px-4 py-2 w-24 mr-4"
                        type="number"
                        id="maxStudents"
                        value={maxStudents}
                        onChange={(e) => setMaxStudents(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <div className="grid grid-cols-2">
                    <label
                      className="flex flex-col text-black mb-2"
                      htmlFor="categoryInput"
                    >
                      Category
                    </label>
                    <div className="flex flex-col items-center">
                      <select
                        className="bg-white rounded-md px-4 py-2 w-24 mr-4"
                        id="categoryInput"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="Cyber Security">Cyber Security</option>
                        <option value="AWS">AWS</option>
                        <option value="BlockChain">BlockChain</option>
                        <option value="Diana HR">Diana HR</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mb-4">
                  <div className="grid grid-cols-2">
                    <label
                      className="flex flex-col text-black mb-2"
                      htmlFor="setPrice"
                    >
                      Price
                    </label>
                    <div className="flex flex-col items-center">
                      <input
                        className="bg-white rounded-md px-4 py-2 w-24 mr-4"
                        type="text"
                        id="coursePrice"
                        value={"$" + coursePrice}
                        onChange={(e) => {
                          const value = e.target.value.replace(/^\$/, ""); // Remove $ if user manually enters it
                          setCoursePrice(value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-2">
                    <label className="flex text-black mb-2" htmlFor="difficultyLevel">
                      Difficulty Level
                    </label>
                    <select
                      className="bg-zinc-200 rounded-md px-4 py-2"
                      id="difficultyLevel"
                      value={difficultyLevel}
                      onChange={(e) => setDifficultyLevel(e.target.value)}
                    >
                      {difficultyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-2 items-center">
                    <label className="flex flex-col text-black mb-2">
                      Public Course
                      <span className="text-sm text-gray-500 ">
                        (Make This Course Public. No enrollment required.)
                      </span>
                    </label>

                    <label className="switch inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={isPublic}
                        onChange={() => {
                          setIsPublic(!isPublic);
                        }}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f79d7a] dark:peer-focus:ring-[#F16126] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#F16126]"></div>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-2 items-center">
                    <label className="flex flex-col text-black mb-2">
                      Q&A
                      <span className="text-sm text-gray-500 ">
                        (Enable Q&A section for your course)
                      </span>
                    </label>

                    <label className="switch inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={enableQA}
                        onChange={() => {
                          setEnableQA(!enableQA);
                        }}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f79d7a] dark:peer-focus:ring-[#F16126] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#F16126]"></div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-4 mt-5" type="submit" onClick={Submit}>
                <Button variant="filled">Add Course</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseAdd;