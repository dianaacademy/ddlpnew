import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import ChapterQuizform from "./chapterQuizform";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LabBuilder from "../creator/Labbuilder/Labbuilder";

const EditChapter = () => {
  const { slug, moduleId, chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [chapterno, setChapterNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [chapterName, setChapterName] = useState("");
  const [chapterType, setChapterType] = useState("video");
  const [chapterDetails, setChapterDetails] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const chapterRef = doc(db, "courses", slug, "modules", moduleId, "chapters", chapterId);
        const chapterSnap = await getDoc(chapterRef);

        if (chapterSnap.exists()) {
          const chapterData = chapterSnap.data();
          setChapter(chapterData);
          setChapterName(chapterData.chapterName);
          setChapterNo(chapterData.chapterno);
          setChapterType(chapterData.type);
          setChapterDetails(chapterData.details);
        } else {
          console.log("No such chapter!");
        }
      } catch (error) {
        console.error("Error fetching chapter data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapterData();
  }, [slug, moduleId, chapterId]);

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

  const handleSaveChapter = async () => {
    if (!chapterName) return;

    const chapterData = {
      chapterName,
      chapterno,
      type: chapterType,
      details: chapterDetails,
    };

    try {
      const chapterRef = doc(db, "courses", slug, "modules", moduleId, "chapters", chapterId);
      await updateDoc(chapterRef, chapterData);

      toast({
        title: "Chapter Updated",
        description: `Chapter "${chapterName}" has been updated successfully.`,
      });
      navigate(-1);

    } catch (error) {
      console.error("Error updating chapter: ", error);
      toast({
        title: "Error",
        description: `There was an error updating the chapter: ${error.message}`,
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
      case "lab":
        return (
          <div>
            {/* <Input
              type="url"
              placeholder="Lab Instructions URL"
              name="labInstructionsUrl"
              value={chapterDetails.labInstructionsUrl || ""}
              onChange={handleChapterDetailsChange}
              className="p-2 my-2 border rounded mr-2"
            /> */}

<LabBuilder/>
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
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  return (
    <div className="chapter-form text-black p-5">
      <h1 className="text-2xl font-bold mb-4">Edit Chapter</h1>
      <div className="mb-4">
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
        {renderChapterDetailsForm()}
      </div>
      <Button onClick={handleSaveChapter}>Save Changes</Button>
    </div>
  );
};

export default EditChapter;
