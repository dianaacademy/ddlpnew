import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, collection, getDoc  } from "firebase/firestore";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary

const CourseBuild = () => {
    const { slug } = useParams(); // Get the courseId parameter from the URL
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(slug);
    console.log(course);
    console.log(modules);
  

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
                    const modulesSnap = await getDoc(modulesRef);
                    const modulesData = [];
                    
                    for (const moduleDoc of modulesSnap.docs) {
                        const moduleData = moduleDoc.data();
                        moduleData.id = moduleDoc.id;

                        // Fetch chapters for each module
                        const chaptersRef = collection(modulesRef, moduleDoc.id, "chapters");
                        const chaptersSnap = await getDoc(chaptersRef);
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

        fetchCourseData();``
    }, [slug]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="course-builder p-5">
            <h1 className="text-2xl font-bold mb-4">{course.courseName}</h1>
            <div className="modules space-y-4">
                {modules.map((module) => (
                    <div key={module.id} className="module border p-4 rounded">
                        <h2 className="text-xl font-semibold mb-2">{module.moduleName}</h2>
                        <div className="chapters space-y-2">
                            {module.chapters.map((chapter) => (
                                <div key={chapter.id} className="chapter pl-4 border-l">
                                    <p className="chapter-name">{chapter.chapterName}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseBuild;
