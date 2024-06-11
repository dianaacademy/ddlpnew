import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, collection, getDoc, getDocs, addDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import { useToast } from "@/components/ui/use-toast"; // Import the useToast hook
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { Input } from "@/components/ui/input"; // Import Input component
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component
import ChapterQuizform from "./chapterQuizform";
const ModuleBuild = () => {
  const { slug, moduleId } = useParams(); // Get the courseId and moduleId parameters from the URL
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newChapterName, setNewChapterName] = useState("");
  const [chapterType, setChapterType] = useState("video");
  const [chapterDetails, setChapterDetails] = useState({});
  const { toast } = useToast(); // Initialize the toast

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        // Fetch module data
        const moduleRef = doc(db, "courses", slug, "modules", moduleId);
        const moduleSnap = await getDoc(moduleRef);

        if (moduleSnap.exists()) {
          const moduleData = moduleSnap.data();

          // Fetch chapters for the module
          const chaptersRef = collection(moduleRef, "chapters");
          const chaptersSnap = await getDocs(chaptersRef);
          moduleData.chapters = chaptersSnap.docs.map((chapterDoc) => ({
            ...chapterDoc.data(),
            id: chapterDoc.id,
          }));

          setModule(moduleData);
        } else {
          console.log("No such module!");
        }
      } catch (error) {
        console.error("Error fetching module data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [slug, moduleId]);

  const handleAddChapter = async () => {
    if (!newChapterName) return;

    const chapterData = {
      chapterName: newChapterName,
      type: chapterType,
      details: chapterDetails,
    };

    try {
      const chaptersRef = collection(
        db,
        "courses",
        slug,
        "modules",
        moduleId,
        "chapters"
      );

      await addDoc(chaptersRef, chapterData);

      // Refresh the module data
      const moduleRef = doc(db, "courses", slug, "modules", moduleId);
      const moduleSnap = await getDoc(moduleRef);

      if (moduleSnap.exists()) {
        const moduleData = moduleSnap.data();

        const chaptersSnap = await getDocs(collection(moduleRef, "chapters"));
        moduleData.chapters = chaptersSnap.docs.map((chapterDoc) => ({
          ...chapterDoc.data(),
          id: chapterDoc.id,
        }));

        setModule(moduleData);
        setNewChapterName("");
        setChapterType("video");
        setChapterDetails({});
        
        toast({
          title: "Chapter Added",
          description: `Chapter "${newChapterName}" has been added successfully.`,
        });
      }
    } catch (error) {
      console.error("Error adding chapter: ", error);
      toast({
        title: "Error",
        description: `There was an error adding the chapter: ${error.message}`,
        status: "error",
      });
    }
  };

  const handleChapterDetailsChange = (e) => {
    const { name, value } = e.target;
    setChapterDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
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



        // case "quiz":
        //     return (
        //       <div>
        //         <Textarea
        //           placeholder="Quiz Questions (one per line)"
        //           name="quizQuestions"
        //           value={chapterDetails.quizQuestions || ""}
        //           onChange={handleChapterDetailsChange}
        //           className="p-2 my-2 border rounded mr-2"
        //         />
        //         <Textarea
        //           placeholder="Quiz Options (separate options with commas)"
        //           name="quizOptions"
        //           value={chapterDetails.quizOptions || ""}
        //           onChange={handleChapterDetailsChange}
        //           className="p-2 my-2 border rounded mr-2"
        //         />
        //       </div>
        //     );





      case "quiz":
        return (
     <ChapterQuizform/>
        );





      case "text":
        return (
          <div>
            <Textarea
              placeholder="Text Content"
              name="textContent"
              value={chapterDetails.textContent || ""}
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

  if (loading) {
    return (
      <div className="module-builder p-5">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-8 w-3/4 mb-4" />
      </div>
    );
  }

  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <div className="module-builder p-5">
      <h1 className="text-2xl font-bold mb-4">{module.moduleName}</h1>

      <div className="add-chapter mb-4">
        <input
          type="text"
          placeholder="New Chapter Name"
          value={newChapterName}
          onChange={(e) => setNewChapterName(e.target.value)}
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
        </select>
        {renderChapterDetailsForm()}
        <Button onClick={handleAddChapter}>Add Chapter</Button>
      </div>

      <div className="chapters space-y-2">
        {module.chapters && module.chapters.length > 0 ? (
          module.chapters.map((chapter) => (
            <div key={chapter.id} className="chapter pl-4 border-l">
              <p className="chapter-name">{chapter.chapterName}</p>
              <p className="chapter-type">Type: {chapter.type}</p>
            </div>
          ))
        ) : (
          <p>No chapters available</p>
        )}
      </div>
    </div>
  );
};

export default ModuleBuild;
