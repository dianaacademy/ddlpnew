import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { db, storage } from '../../firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CourseAdd = () => {
  const [courseName, setCourseName] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [maxStudent, setMaxStudent] = useState('');
  const [whatuLearn, setWhatuLearn] = useState('');
  const [whoiscfor, SetWhoiscfor] = useState('');
  const [reqins, SetReqins] = useState('');
  const [category, setCategory] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [materialInclue, setMaterialInclue] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState("All Levels");
  const [isPublic, setIsPublic] = useState(true);
  const [enableQA, setEnableQA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const difficultyLevels = ["All Levels", "Beginner", "Intermediate", "Expert"];
  const categories = ["BIG DATA", "Linux", "Azure","Cyber Security","DevOps", "5G", "AWS", "BlockChain", "Diana HR", "AI", "VMWARE","Diana Junior", "Diana Junior Program","Web Development","Digital Marketing","Coding","Oracle", "Others"];

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      uploadThumbnail(file);
    }
  };

  const uploadThumbnail = (file) => {
    const timestamp = new Date().getTime();
    const uniqueFileName = `${file.name}_${timestamp}`;
    const thumbnailRef = ref(storage, `thumbnails/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(thumbnailRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading thumbnail:', error);
        toast.error('Error uploading thumbnail.');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setThumbnailUrl(downloadURL);
        toast.success('Thumbnail uploaded successfully!');
      }
    );
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailUrl('');
    setUploadProgress(0);
  };

  const handleNewCourse = async () => {
    if (!thumbnailUrl) {
      toast.error('Please upload a thumbnail.');
      return;
    }

    setIsLoading(true);
    const addCoursePromise = new Promise(async (resolve, reject) => {
      try {
        const courseRef = collection(db, 'courses');
        await addDoc(courseRef, {
          courseName,
          tutorName,
          courseDesc,
          maxStudent,
          whatuLearn,
          whoiscfor,
          reqins,
          materialInclue,
          courseDuration,
          thumbnailUrl,
          category,
          coursePrice,
          difficultyLevel,
          isPublic,
          enableQA,
        });

        // Reset form fields
        setCourseName('');
        setTutorName('');
        setCourseDesc('');
        setMaxStudent('');
        setWhatuLearn('');
        SetWhoiscfor('');
        SetReqins('');
        setMaterialInclue('');
        setCourseDuration('');
        setCategory('');
        setCoursePrice('');
        setDifficultyLevel("All Levels");
        setIsPublic(true);
        setEnableQA(false);
        setThumbnailFile(null);
        setThumbnailUrl('');
        setUploadProgress(0);

        resolve('Course added successfully!');
      } catch (error) {
        console.error('Error adding course:', error);
        reject('Error adding course.');
      }
    });

    toast.promise(addCoursePromise, {
      loading: 'Adding course...',
      success: (message) => message,
      error: (message) => message,
    });

    await addCoursePromise;
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <Toaster position="top-right " />
      <Card className="max-w-4xl mx-auto bg-white rounded-lg overflow-hidden ">
        <div className="p-8">
          <h1 className="text-black text-3xl mb-4">Add New Course</h1>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
              <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tutor Name</label>
              <Input value={tutorName} onChange={(e) => setTutorName(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
              <Textarea value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} className="w-full" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What Will I Learn?</label>
              <Textarea value={whatuLearn} onChange={(e) => setWhatuLearn(e.target.value)} className="w-full" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Materials Included</label>
              <Textarea value={materialInclue} onChange={(e) => setMaterialInclue(e.target.value)} className="w-full" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Who Is This Course For</label>
              <Textarea value={whoiscfor} onChange={(e) => SetWhoiscfor(e.target.value)} className="w-full" rows={4} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements/Instructions</label>
              <Textarea value={reqins} onChange={(e) => SetReqins(e.target.value)} className="w-full" rows={4} />
            </div>
            <div className=" border-solid ">
              <h2 className="text-black text-2xl mb-4">Course Settings</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 items-center">
                  <label className="flex flex-col text-black mb-2" htmlFor="maxStudents">
                    Maximum Students
                    <span className="text-sm text-gray-500 pr-5">
                      (Number of students that can enrol in this course. Set 0 for no limits.)
                    </span>
                  </label>
                  <Input
                    type="number"
                    id="maxStudents"
                    value={maxStudent}
                    onChange={(e) => setMaxStudent(e.target.value)}
                    className="w-24"
                  />
                </div>
                <div className="grid grid-cols-2 items-center">
  <label className="flex flex-col text-black mb-2" htmlFor="courseDuration">
    Total Course Duration
    <span className="text-sm text-gray-500 pr-5">(in Hours.)</span>
  </label>
  <div className="flex items-center">
    <input
      type="number"
      id="courseDuration"
      value={courseDuration.replace(" hours", "")} // Show only the number in the input
      onChange={(e) =>
        setCourseDuration(e.target.value ? `${e.target.value} hours` : "")
      }
      className="w-24 border-gray-300 rounded-md"
    />
    <span className="ml-2">hours</span>
  </div>
</div>

                <div className="grid grid-cols-2 items-center">
                  <label className="flex flex-col text-black mb-2" htmlFor="categoryInput">
                    Category
                  </label>
                  <select
                    className="bg-zinc-200 rounded-md px-4 py-2 w-48"
                    id="categoryInput"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <label className="flex flex-col text-black mb-2" htmlFor="setPrice">
                    Price
                  </label>
                  <Input
                    type="text"
                    id="coursePrice"
                    value={"$  " + coursePrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/^\$/, "");
                      setCoursePrice(value);
                    }}
                    className="w-48"
                  />
                </div>
                <div className="grid grid-cols-2 items-center">
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
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <label className="flex flex-col text-black mb-2">
                    Public Course
                    <span className="text-sm text-gray-500">
                      (Make This Course Public. No enrollment required.)
                    </span>
                  </label>
                  <label className="switch inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isPublic}
                      onChange={() => setIsPublic(!isPublic)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f79d7a] dark:peer-focus:ring-[#F16126] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#F16126]"></div>
                  </label>
                </div>
                <div className="grid grid-cols-2 items-center">
                  <label className="flex flex-col text-black mb-2">
                    Q&A
                    <span className="text-sm text-gray-500">
                      (Enable Q&A section for your course)
                    </span>
                  </label>
                  <label className="switch inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={enableQA}
                      onChange={() => setEnableQA(!enableQA)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#f79d7a] dark:peer-focus:ring-[#F16126] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#F16126]"></div>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
              <input
                type="file"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress.toFixed(0)}%</p>
                </div>
              )}
              {thumbnailUrl && (
                <div className="mt-2">
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-32 h-32 object-cover rounded" />
                  <button
                    onClick={handleRemoveThumbnail}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-left">
            <Button
              onClick={handleNewCourse}
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Course...
                </>
              ) : (
                'Add Course'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseAdd;