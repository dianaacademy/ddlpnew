import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";

// UI Component Imports
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle,  } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const CourseViewer = () => {
    const { slug } = useParams(); 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollmentData, setEnrollmentData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseRef = doc(db, "courses", slug);
                const courseSnap = await getDoc(courseRef);
                if (courseSnap.exists()) {
                    setCourse(courseSnap.data());
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

    const handleEnrollmentDataChange = (e) => {
        setEnrollmentData({
            ...enrollmentData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEnrollmentSubmit = (e) => {
        e.preventDefault();
        // Handle enrollment submission logic here
        console.log("Enrollment data:", enrollmentData);
    };

    if (loading) {
        return (
            <div className="course-viewer p-5">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-64 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
            </div>
        );
    }

    if (!course) {
        return <div>Course not found</div>;
    }

    return (
        <div className=" ml-52 mr-52 course-page grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr] gap-6 p-6">
            <div>
                <div>
                    <h2 className="text-4xl font-bold mb-4 mt-3">{course.courseName || "Course Name"}</h2>
                    <h2 className="text-xl font-semibold mt-6 mb-2">About Course</h2>
                    <p className="mb-4">{course.courseDesc || "No description available."}</p>
    
                    <h2 className="text-xl font-semibold mt-6 mb-2">What Will you Learn</h2>
                    <p className="whitespace-pre-wrap mb-4">{course.whatuLearn || "No schedule provided."}</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2">Who is this Course For</h2>
                    <p className="whitespace-pre-wrap mb-4">{course.whoiscfor || "No schedule provided."}</p>
                    <h2 className="text-xl font-semibold mt-6 mb-2">Requirements/Instructions</h2>
                    <p className="whitespace-pre-wrap mb-4">{course.reqins || "No schedule provided."}</p>
    
                    <h2 className="text-xl font-semibold mt-6 mb-2">Details</h2>
                    <p><strong>Duration:</strong> {course.courseDuration || "N/A"}</p>
                    <p><strong>Difficulty Level:</strong> {course.difficultyLevel || "N/A"}</p>
                    <p><strong>Maximum Students:</strong> {course.maxStudent || "N/A"}</p>
                </div>
            </div>
    
            {/* Right Section: Price and Enrollment */}
            <div className="lg:sticky lg:top-6 h-fit">
                <div className="bg-gray-100 p-6 rounded-md shadow-md">
                    <div className="mb-4">
                        {/* <span className="text-xl font-bold text-black-500">${course.coursePrice || "0.00"}</span> */}
                    </div>
    
                    {/* Dialog Trigger */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                Enroll Now
                            </Button>
                        </DialogTrigger>
    
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Enroll in {course.courseName || "Course"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEnrollmentSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={enrollmentData.name}
                                        onChange={handleEnrollmentDataChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={enrollmentData.email}
                                        onChange={handleEnrollmentDataChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={enrollmentData.phone}
                                        onChange={handleEnrollmentDataChange}
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Submit</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
    
                    <div className="mt-6 text-center">
                        <h3 className="text-sm font-medium text-gray-600">A course by</h3>
                        <p className="font-semibold text-gray-800">{course.tutorName || "Unknown Tutor"}</p>
                        <div className=" text-left mb-6 rounded-md	">
                        <img
                        src={course.thumbnailUrl || "https://via.placeholder.com/800x400"}
                        alt={course.name || "Course thumbnail"}
                        className="  mt-10 object-contain rounded-md"
                        />
                </div>
                    </div>
                </div>
            </div>
        </div>
    );   
};

export default CourseViewer;