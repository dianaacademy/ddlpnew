import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import DeleteAlert from "./DeleteAlert"; // Adjust the import path as necessary
import { EyeOpenIcon, Pencil1Icon } from "@radix-ui/react-icons";

const ModuleBuild = () => {
  const { slug, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const moduleRef = doc(db, "courses", slug, "modules", moduleId);
        const moduleSnap = await getDoc(moduleRef);

        if (moduleSnap.exists()) {
          const moduleData = moduleSnap.data();

          const chaptersRef = collection(moduleRef, "chapters");
          const chaptersSnap = await getDocs(chaptersRef);
          moduleData.chapters = chaptersSnap.docs
            .map((chapterDoc) => ({
              ...chapterDoc.data(),
              id: chapterDoc.id,
            }))
            .sort((a, b) => a.chapterno - b.chapterno);

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

  const handleDeleteChapter = (chapterId) => {
    const updatedChapters = module.chapters.filter((chapter) => chapter.id !== chapterId);
    setModule({ ...module, chapters: updatedChapters });
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
      <div>
        <h1 className="text-2xl font-bold mb-4">You are building module {module.moduleName}</h1>

        <div className="flex float-right">
          <Link to={`chapter/new`}>
            <Button>Add Chapter</Button>
          </Link>
        </div>
      </div>

      <div className="chapters space-y-2 mt-20">
        <Card className="mt-6 grid grid-flow-row gap-4 px-4 py-4 grid-cols-1">
          {module.chapters && module.chapters.length > 0 ? (
            module.chapters.map((chapter) => (
              <div key={chapter.id}>
                <Card>
                  <CardContent>
                    <CardTitle className="px-2 pt-4">Chapter</CardTitle>
                    <div className="flex justify-between mx-2 pt-2">
                      <div>
                        <p className="chapter-name">chapter name:-{chapter.chapterName}</p>
                        <p className="chapter-name">chapter number:-{chapter.chapterno}</p>
                      </div>
                      <p className="chapter-type">Type: {chapter.type}</p>
                    </div>
                    <div className="flex gap-4 pt-4 mb-2">
                      <Link to={`/course/${slug}/module/${moduleId}/chapter/${chapter.id}`}>
                        <Button variant="outline" className="pl-2">
                          <span className="pr-2"><EyeOpenIcon /></span>View Chapter
                        </Button>
                      </Link>
                      <Link to={`chapter/${chapter.id}/edit`}>
                        <Button variant="outline" className="pl-2">
                          <span className="pr-2"><Pencil1Icon /></span>Edit Chapter
                        </Button>
                      </Link>
                      <DeleteAlert chapterId={chapter.id} onDelete={handleDeleteChapter} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <p>No chapters available</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ModuleBuild;
