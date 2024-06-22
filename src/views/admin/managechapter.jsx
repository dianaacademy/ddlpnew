import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "@/firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import ChapterQuizform from "./chapterQuizform";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const NewChapter = () => {
  const navigate = useNavigate();
  const { slug, moduleId } = useParams();
  const [chapterName, setChapterName] = useState("");
  const [chapterno, setChapterNo] = useState("");
  const [chapterType, setChapterType] = useState("video");
  const [chapterDetails, setChapterDetails] = useState({});
  const { toast } = useToast();
  const [file, setFile] = useState(null);

  const handleChapterDetailsChange = (e) => {
    const { name, value } = e.target;
    setChapterDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleQuillChange = (value) => {
    setChapterDetails((prevDetails) => ({
      ...prevDetails,
      content: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleAddChapter = async () => {
    if (!chapterName) return;

    try {
      let fileUrl = "";
      if (file) {
        const storageRef = ref(storage, `files/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }

      const chapterData = {
        chapterName,
        chapterno,
        fileUrl: fileUrl || "",
        type: chapterType,
        details: {
          ...chapterDetails,
        },
      };

      console.log(chapterData);

      const chaptersRef = collection(
        db,
        "courses",
        slug,
        "modules",
        moduleId,
        "chapters"
      );
      await addDoc(chaptersRef, chapterData);

      toast({
        title: "Chapter Added",
        description: `Chapter "${chapterName}" has been added successfully.`,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error adding chapter: ", error);
      toast({
        title: "Error",
        description: `There was an error adding the chapter: ${error.message}`,
        status: "error",
      });
    }
  };

  const renderChapterDetailsForm = () => {
    switch (chapterType) {
      case "video":
        return (
          <div>
            <Input
              type="url"
              placeholder="Video URL"
              name="videoUrl"
              value={chapterDetails.videoUrl || ""}
              onChange={handleChapterDetailsChange}
              className="p-2 my-2 border rounded mr-2"
            />
          </div>
        );
      case "quiz":
        return (
          <ChapterQuizform
            questions={chapterDetails.questions || []}
            setQuestions={(questions) =>
              setChapterDetails((prev) => ({ ...prev, questions }))
            }
          />
        );
      case "text":
        return (
          <div>
            <ReactQuill
              theme="snow"
              value={chapterDetails.content || ""}
              onChange={handleQuillChange}
            />
          </div>
        );
      case "match":
        return (
          <div>
            <Input
              type="text"
              placeholder="Match the Following"
              name="matchFollow"
              value={chapterDetails.matchFollow || ""}
              onChange={handleChapterDetailsChange}
              className="p-2 my-2 border rounded mr-2"
            />
          </div>
        );

      case "lab":
        return (
          <div>
            <Input
              type="url"
              placeholder="Lab Instructions URL"
              name="labInstructionsUrl"
              value={chapterDetails.labInstructionsUrl || ""}
              onChange={handleChapterDetailsChange}
              className="p-2 my-2 border rounded mr-2"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chapter-form text-black p-5">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Add New Chapter</h1>
        <Button onClick={handleAddChapter}>Submit</Button>
      </div>
      <div className="mb-4">
        <div className="flex float-right">
          <select
            value={chapterType}
            onChange={(e) => setChapterType(e.target.value)}
            className="p-2 my-2 border rounded mr-2"
          >
            <option value="video">Video</option>
            <option value="quiz">Quiz</option>
            <option value="text">Text Document</option>
            <option value="lab">Lab</option>
            <option value="match">Match Answer</option>
          </select>
        </div>
        <Input
          type="text"
          placeholder="Chapter Name"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="p-2 my-2 border rounded mr-2"
        />
        <Input
          type="number"
          placeholder="Chapter No"
          value={chapterno}
          onChange={(e) => setChapterNo(e.target.value)}
          className="p-2 my-2 border rounded mr-2"
        />
        <Input
          type="file"
          onChange={handleFileChange}
          className="p-2 my-2 border rounded mr-2"
        />

        {renderChapterDetailsForm()}
      </div>
    </div>
  );
};

export default NewChapter;
