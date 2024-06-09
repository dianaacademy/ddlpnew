import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, collection, getDoc, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import { useToast } from "@/components/ui/use-toast"; // Import the useToast hook
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { Card, 
    CardContent, 
    CardHeader, 
    CardDescription,
    CardTitle ,
 } from "@/components/ui/card";
 import { DoorClosed, SquareX } from "lucide-react";




const CourseBuild = () => {
    const { slug } = useParams(); // Get the courseId parameter from the URL
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newModuleName, setNewModuleName] = useState("");
    const [moduledescription, setModuledescription] = useState("");
    const [moduleno, setmoduleno] = useState("");
    const [editingModuleId, setEditingModuleId] = useState(null);
    const [newChapterName, setNewChapterName] = useState("");
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [showModuleform, SetShowmoduleform] = useState(false);
    const [showModuleEditform, SetShowEditmoduleform] = useState(false);


    const { toast } = useToast(); // Initialize the toast

   const togglePopover = () => {
    SetShowmoduleform(!showModuleform);
  };


  const togglemoduleEditform = () => {
    SetShowEditmoduleform(!showModuleEditform);
  };

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Fetch course data
                const courseRef = doc(db, "courses", slug);
                const courseSnap = await getDoc(courseRef);

                if (courseSnap.exists()) {
                    setCourse(courseSnap.data());

                    // Fetch modules data
                    const modulesRef = collection(courseRef, "modules");
                    const modulesSnap = await getDocs(modulesRef);
                    const modulesData = [];
                    
                    for (const moduleDoc of modulesSnap.docs) {
                        const moduleData = moduleDoc.data();
                        moduleData.id = moduleDoc.id;

                        // Fetch chapters for each module
                        const chaptersRef = collection(modulesRef, moduleDoc.id, "chapters");
                        const chaptersSnap = await getDocs(chaptersRef);
                        moduleData.chapters = chaptersSnap.docs.map(chapterDoc => ({
                            ...chapterDoc.data(),
                            id: chapterDoc.id
                        }));

                        modulesData.push(moduleData);
                    }

                    setModules(modulesData);
                } else {
                    console.log("No such course!");
                }
            } catch (error) {
                console.error("Error fetching course data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [slug]);

    const handleAddModule = async () => {
        if (!newModuleName) return;

        try {
            const courseRef = doc(db, "courses", slug);
            const modulesRef = collection(courseRef, "modules");

            await addDoc(modulesRef, {
                moduleName: newModuleName,
                moduledescription:moduledescription,
                moduleno:moduleno,
            });

            SetShowmoduleform(!showModuleform);

            // Refresh the modules list
            const modulesSnap = await getDocs(modulesRef);
            const modulesData = modulesSnap.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setModules(modulesData);
            setNewModuleName("");

            toast({
                title: "Module Added",
                description: `Module "${newModuleName}" has been added successfully.`,
            });
        } catch (error) {
            console.error("Error adding module: ", error);
            toast({
                title: "Error",
                description: `There was an error adding the module: ${error.message}`,
                status: "error",
            });
        }
    };

    const handleEditModule = async (moduleId, newName) => {
        try {
            const moduleRef = doc(db, "courses", slug, "modules", moduleId);
            await updateDoc(moduleRef, { moduleName: newName });

            // Refresh the modules list
            const modulesSnap = await getDocs(collection(doc(db, "courses", slug), "modules"));
            const modulesData = modulesSnap.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setModules(modulesData);
            setEditingModuleId(null);

            toast({
                title: "Module Updated",
                description: `Module "${newName}" has been updated successfully.`,
            });
        } catch (error) {
            console.error("Error editing module: ", error);
            toast({
                title: "Error",
                description: `There was an error updating the module: ${error.message}`,
                status: "error",
            });
        }
    };

    const handleAddChapter = async () => {
        if (!newChapterName || !currentModuleId) return;

        try {
            const chaptersRef = collection(db, "courses", slug, "modules", currentModuleId, "chapters");

            await addDoc(chaptersRef, {
                chapterName: newChapterName,
            });

            // Refresh the modules list
            const modulesRef = collection(doc(db, "courses", slug), "modules");
            const modulesSnap = await getDocs(modulesRef);
            const modulesData = [];

            for (const moduleDoc of modulesSnap.docs) {
                const moduleData = moduleDoc.data();
                moduleData.id = moduleDoc.id;

                // Fetch chapters for each module
                const chaptersSnap = await getDocs(collection(modulesRef, moduleDoc.id, "chapters"));
                moduleData.chapters = chaptersSnap.docs.map(chapterDoc => ({
                    ...chapterDoc.data(),
                    id: chapterDoc.id
                }));

                modulesData.push(moduleData);
            }

            setModules(modulesData);
            setNewChapterName("");
            setCurrentModuleId(null);

            toast({
                title: "Chapter Added",
                description: `Chapter "${newChapterName}" has been added successfully.`,
            });
        } catch (error) {
            console.error("Error adding chapter: ", error);
            toast({
                title: "Error",
                description: `There was an error adding the chapter: ${error.message}`,
                status: "error",
            });
        }
    };

    if (loading) {
        return (
            <div className="course-builder p-5">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-8 w-2/3 mb-4" />
                <Skeleton className="h-8 w-1/4 mb-4" />
                <Skeleton className="h-8 w-3/4 mb-4" />
            </div>
        );
    }
    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="course-builder p-5">
            <h1 className="text-2xl font-bold mb-4">{course.courseName}</h1>
            <Button variant="outline" onClick={togglePopover}
 className=' float-right  mr-4 px-2 py-2  dark:bg-navy-800 '>     
    Add  module 
          </Button>

            <div className="add-module   mb-4">
      


          {showModuleform && (
<div className=" py-2 fixed w-full inset-0 z-50 flex items-center justify-center">
<Card>
    <CardTitle className="px-2  flex justify-center mt-4">
        Add module
    </CardTitle>


<CardContent className="gap-3">

<Button
variant="outline "
className="flex float-right  text-2xl  mr-4"
onClick={togglePopover}
>
<SquareX />
</Button>

      <input
                    type="text"
                    placeholder="New Module Name"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    className="p-2 my-2 border rounded mr-2"
                />


<input
                    type="text"
                    placeholder="module description"
                    value={moduledescription}
                    onChange={(e) => setModuledescription(e.target.value)}
                    className="p-2 my-2 border rounded mr-2"
                />          
                <input
                    type="text"
                    placeholder="module no"
                    value={moduleno}
                    onChange={(e) => setmoduleno(e.target.value)}
                    className="p-2 my-2 border rounded mr-2"
                />     
                <Button onClick={handleAddModule}>Add Module</Button>



</CardContent>
</Card>
</div>
)}
          
            </div>

            <div className="modules grid grid-cols-2 grid-flow-row  gap-3 mt-20 ">
                {modules && modules.length > 0 ? modules.map((module) => (
                    <div key={module.id} className="module border p-4 rounded">
                        {editingModuleId === module.id ? (

<div className=" py-2 fixed w-full  inset-0 z-50  items-center justify-center">
<Card>
    <CardTitle className="px-2  flex justify-center mt-4">
        Add module
    </CardTitle>


<CardContent className="gap-3">

<Button
variant="outline "
className="flex float-right  text-2xl  mr-4"
onClick={togglemoduleEditform}
>
<SquareX />
</Button>

{ showModuleEditform && (



<div className="edit-module">
                                <input
                                    type="text"
                                    defaultValue={module.moduleName}
                                    onBlur={(e) => handleEditModule(module.id, e.target.value)}
                                    className="p-2 border rounded mr-2"
                                />
                                <Button onClick={() => setEditingModuleId(null)}>update</Button>
                            </div>
)



}



</CardContent>
</Card>
</div>        
                        ) : (
                            <div className="module-header  flex justify-between items-center">
                                <h2 className="text-xl font-semibold mb-2">{module.moduleName}</h2>
                                <h2 className="text-xl font-semibold mb-2">{module.moduleno}</h2>
                                <Button  className="my-2" variant="outline" onClick={() => setEditingModuleId(module.id)}>Edit</Button>
                            </div>
                        )}

                        <div className="add-chapter mb-2">
                            <input
                                type="text"
                                placeholder={`New Chapter for ${module.moduleName}`}
                                value={currentModuleId === module.id ? newChapterName : ""}
                                onChange={(e) => setNewChapterName(e.target.value)}
                                className="p-2 border rounded mr-2"
                                onFocus={() => setCurrentModuleId(module.id)}
                            />
                            <Button onClick={handleAddChapter}>Add Chapter</Button>
                        </div>

                        <div className="chapters space-y-2">
                            {module.chapters && module.chapters.length > 0 ? module.chapters.map((chapter) => (
                                <div key={chapter.id} className="chapter pl-4 border-l">
                                    <p className="chapter-name">{chapter.chapterName}</p>
                                </div>
                            )) : <p>No chapters available</p>}
                        </div>
                    </div>
                )) : <p>No modules available</p>}
            </div>
        </div>
    );
};

export default CourseBuild;
