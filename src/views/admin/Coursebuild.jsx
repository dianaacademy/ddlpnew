import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase.config";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import { useToast } from "@/components/ui/use-toast"; // Import the useToast hook
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { SquareX } from "lucide-react";
import { Link } from "react-router-dom";

const CourseBuild = () => {
  const { slug } = useParams(); // Get the courseId parameter from the URL
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModuleName, setNewModuleName] = useState("");
  const [moduledescription, setModuledescription] = useState("");
  const [moduleno, setmoduleno] = useState("");
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [showModuleform, SetShowmoduleform] = useState(false);
  const [showModuleEditform, SetShowEditmoduleform] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null); // State to track module to be deleted

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
          let modulesData = [];

          for (const moduleDoc of modulesSnap.docs) {
            const moduleData = moduleDoc.data();
            moduleData.id = moduleDoc.id;

            // Fetch chapters for each module
            const chaptersRef = collection(
              modulesRef,
              moduleDoc.id,
              "chapters"
            );
            const chaptersSnap = await getDocs(chaptersRef);
            moduleData.chapters = chaptersSnap.docs.map((chapterDoc) => ({
              ...chapterDoc.data(),
              id: chapterDoc.id,
            }));

            modulesData.push(moduleData);
          }

          // Sort modules by moduleno
          modulesData.sort((a, b) => a.moduleno - b.moduleno);

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
        moduledescription: moduledescription,
        moduleno: parseInt(moduleno, 10),
      });

      SetShowmoduleform(!showModuleform);

      // Refresh the modules list
      const modulesSnap = await getDocs(modulesRef);
      let modulesData = modulesSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Sort modules by moduleno
      modulesData.sort((a, b) => a.moduleno - b.moduleno);

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
      const modulesSnap = await getDocs(
        collection(doc(db, "courses", slug), "modules")
      );
      let modulesData = modulesSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Sort modules by moduleno
      modulesData.sort((a, b) => a.moduleno - b.moduleno);

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

  const handleDeleteModule = async (moduleId) => {
    try {
      const moduleRef = doc(db, "courses", slug, "modules", moduleId);
      await deleteDoc(moduleRef);

      // Refresh the modules list
      const modulesSnap = await getDocs(
        collection(doc(db, "courses", slug), "modules")
      );
      let modulesData = modulesSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Sort modules by moduleno
      modulesData.sort((a, b) => a.moduleno - b.moduleno);

      setModules(modulesData);
      setModuleToDelete(null);

      toast({
        title: "Module Deleted",
        description: `Module has been deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting module: ", error);
      toast({
        title: "Error",
        description: `There was an error deleting the module: ${error.message}`,
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
    <div className="course-builder text-black p-5">
      <h1 className="text-2xl font-bold mb-4">{course.courseName}</h1>
      <Button
        variant="outline"
        onClick={togglePopover}
        className="float-right mr-4 px-2 py-2 dark:bg-navy-800"
      >
        Add module
      </Button>

      <div className="add-module mb-4">
        {showModuleform && (
          <div className="py-2 fixed w-full inset-0 z-50 flex items-center justify-center">
            <Card>
              <CardTitle className="px-2 flex justify-center mt-4">
                Add module
              </CardTitle>

              <CardContent className="gap-3">
                <Button
                  variant="outline"
                  className="flex float-right text-2xl mr-4"
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
                  placeholder="Module Description"
                  value={moduledescription}
                  onChange={(e) => setModuledescription(e.target.value)}
                  className="p-2 my-2 border rounded mr-2"
                />
                <input
                  type="number"
                  placeholder="Module No"
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

      <div className="modules grid grid-cols-2 grid-flow-row gap-3 mt-20">
        {modules && modules.length > 0 ? (
          modules.map((module) => (
            <div key={module.id} className="module border p-4 rounded">
              {editingModuleId === module.id ? (
                <div className="py-2 fixed w-full inset-0 z-50 items-center justify-center">
                  <Card>
                    <CardTitle className="px-2 flex justify-center mt-4">
                      Edit Module
                    </CardTitle>

                    <CardContent className="gap-3">
                      <Button
                        variant="outline"
                        className="flex float-right text-2xl mr-4"
                        onClick={togglemoduleEditform}
                      >
                        <SquareX />
                      </Button>

                      {showModuleEditform && (
                        <div className="edit-module">
                          <input
                            type="text"
                            defaultValue={module.moduleName}
                            onBlur={(e) =>
                              handleEditModule(module.id, e.target.value)
                            }
                            className="p-2 border rounded mr-2"
                          />
                          <Button onClick={() => setEditingModuleId(null)}>
                            Update
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="module-header justify-between items-center">
                  <h2 className="text-xl font-semibold mb-2">
                    ModuleName :-    {module.moduleName}
                  </h2>
                  <h2 className="text-xl font-semibold mb-2">
                    Module Description :-    {module.moduledescription}
                  </h2>

                  <h2 className="text-xl font-semibold mb-2">
                    Modeule No:-   {module.moduleno}
                  </h2>
                  <div className="flex">
                    <Button
                      className=""
                      variant="outline"
                      onClick={() => setEditingModuleId(module.id)}
                    >
                      Edit
                    </Button>
                    <Link to={`module/${module.id}`}>
                      <Button variant="outline">Build</Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setModuleToDelete(module.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No modules available</p>
        )}
      </div>

      {/* Confirmation Dialog for Deleting Module */}
      {moduleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <Card>
            <CardTitle className="px-2 flex justify-center mt-4">
              Confirm Deletion
            </CardTitle>
            <CardContent className="gap-3 flex flex-col items-center">
              <p>Are you sure you want to delete this module?</p>
              <div className="flex">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteModule(moduleToDelete)}
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setModuleToDelete(null)}
                >
                  No
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CourseBuild;
