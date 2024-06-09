import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary

const CourseViewer = () => {
    const { slug } = useParams(); // Get the slug parameter from the URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseRef = doc(db, "courses", slug);
                const courseSnap = await getDoc(courseRef);
                if (courseSnap.exists()) {
                    setCourse(courseSnap.data());
                    setFormData(courseSnap.data());
                } else {
                    console.log("No such course!");
                }
            } catch (error) {
                console.error("Error fetching course: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [slug]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            const courseRef = doc(db, "courses", slug);
            await updateDoc(courseRef, formData);
            setCourse(formData);
            setEditMode(false);
        } catch (error) {
            console.error("Error updating course: ", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className="course-viewer p-5">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{course.courseName}</h1>
                <Button onClick={() => setEditMode(!editMode)}>
                    {editMode ? "Cancel" : "Edit"}
                </Button>
            </div>

            {editMode ? (
                <div className="course-edit space-y-4">
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="courseName"
                        value={formData.courseName}
                        onChange={handleChange}
                    />
                    <textarea
                        className="w-full p-2 border rounded"
                        name="courseDesc"
                        value={formData.courseDesc}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="courseDuration"
                        value={formData.courseDuration}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        type="number"
                        name="coursePrice"
                        value={formData.coursePrice}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="tutorName"
                        value={formData.tutorName}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="materialInclue"
                        value={formData.materialInclue}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="whatuLearn"
                        value={formData.whatuLearn}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full p-2 border rounded"
                        type="number"
                        name="maxStudents"
                        value={formData.maxStudents}
                        onChange={handleChange}
                    />
                    <label className="block">
                        <span>Public:</span>
                        <input
                            className="ml-2"
                            type="checkbox"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={() =>
                                setFormData({
                                    ...formData,
                                    isPublic: !formData.isPublic,
                                })
                            }
                        />
                    </label>
                    <label className="block">
                        <span>Enable Q&A:</span>
                        <input
                            className="ml-2"
                            type="checkbox"
                            name="enableQA"
                            checked={formData.enableQA}
                            onChange={() =>
                                setFormData({
                                    ...formData,
                                    enableQA: !formData.enableQA,
                                })
                            }
                        />
                    </label>
                    <Button onClick={handleSubmit}>Save</Button>
                </div>
            ) : (
                <div className="course-details space-y-4">
                    <img
                        className="w-full h-64 object-cover rounded-md mb-4"
                        src={course.thumbnailUrl}
                        alt={course.courseName}
                    />
                    <p><strong>Description:</strong> {course.courseDesc}</p>
                    <p><strong>Duration:</strong> {course.courseDuration}</p>
                    <p><strong>Price:</strong> ${course.coursePrice}</p>
                    <p><strong>Tutor Name:</strong> {course.tutorName}</p>
                    <p><strong>Material Included:</strong> {course.materialInclue}</p>
                    <p><strong>What You'll Learn:</strong> {course.whatuLearn}</p>
                    <p><strong>Maximum Students:</strong> {course.maxStudents}</p>
                    <p><strong>Public:</strong> {course.isPublic ? "Yes" : "No"}</p>
                    <p><strong>Enable Q&A:</strong> {course.enableQA ? "Yes" : "No"}</p>
                </div>
            )}
        </div>
    );
};

export default CourseViewer;
