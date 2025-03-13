import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import toast from 'react-hot-toast';

// UI Component Imports
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DisCViewer = () => {
    const { slug } = useParams(); 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollmentData, setEnrollmentData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
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

    const sendEmailNotification = async () => {
        if (!enrollmentData.name || !enrollmentData.email || !enrollmentData.phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const emailPayload = {
                toEmail: "manager@dianaadvancedtechacademy.uk",
                toName: "Diana ATA",
                subject: "New Course Enrollment Request",
                content: `
                    <h1>New Course Enrollment Request for ${course.courseName}</h1>
                    <p><strong>Course:</strong> ${course.courseName}</p>
                    <p><strong>Name:</strong> ${enrollmentData.name}</p>
                    <p><strong>Email:</strong> ${enrollmentData.email}</p>
                    <p><strong>Phone:</strong> ${enrollmentData.phone}</p>
                    <p><strong>Message:</strong> ${enrollmentData.message || 'No message provided'}</p>
                    <p><strong>Course Price:</strong> $${course.coursePrice}</p>
                `
            };

            const response = await fetch("https://emailw.kkbharti555.workers.dev/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(emailPayload)
            });

            if (response.ok) {
                toast.success("Enrollment request submitted successfully!");
                setEnrollmentData({
                    name: "",
                    email: "",
                    phone: "",
                    message: ""
                });
            } else {
                toast.error("Failed to submit enrollment request");
            }
        } catch (error) {
            console.error("Email notification error:", error);
            toast.error("An error occurred while submitting your request");
        }
    };

    const handleEnrollmentSubmit = async (e) => {
        e.preventDefault();
        await sendEmailNotification();
    };

    if (loading) {
        return (
            <div className="p-5 bg-gray-900 text-gray-100">
                <Skeleton className="h-8 w-1/2 bg-gray-700" />
                <Skeleton className="h-8 w-24 bg-gray-700" />
                <Skeleton className="h-64 w-full mb-4 bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-1/2 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-2/3 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-1/3 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-1/4 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
            </div>
        );
    }

    if (!course) {
        return <div className="text-gray-100">Course not found</div>;
    }

    return (
        <div className="bg-gray-900  bg-opacity-0 min-h-screen">
            <div className="ml-52 mr-52 course-page grid grid-cols-1 lg:grid-cols-[2.5fr_1.5fr] gap-6 p-6 text-gray-100">
                <div>
                    <div>
                        <h2 className="text-4xl font-bold mb-4 mt-3 text-gray-100">{course.courseName || "Course Name"}</h2>
                        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-100">About Course</h2>
                        <p className="mb-4 text-gray-100">{course.courseDesc || "No description available."}</p>
        
                        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-100">What Will you Learn</h2>
                        <p className="whitespace-pre-wrap mb-4 text-gray-100">{course.whatuLearn || "No schedule provided."}</p>
                        
                        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-100">Who is this Course For</h2>
                        <p className="whitespace-pre-wrap mb-4 text-gray-100">{course.whoiscfor || "No schedule provided."}</p>
                        
                        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-100">Requirements/Instructions</h2>
                        <p className="whitespace-pre-wrap mb-4 text-gray-100">{course.reqins || "No schedule provided."}</p>
        
                        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-100">Details</h2>
                        <p className="text-gray-100"><strong className="text-gray-100">Duration:</strong> {course.courseDuration || "N/A"}</p>
                        <p className="text-gray-100"><strong className="text-gray-100">Difficulty Level:</strong> {course.difficultyLevel || "N/A"}</p>
                        <p className="text-gray-100"><strong className="text-gray-100">Maximum Students:</strong> {course.maxStudent || "N/A"}</p>
                    </div>
                </div>
        
                {/* Right Section: Price and Enrollment */}
                <div className="lg:sticky lg:top-6 h-fit ">
                    <div className="bg-gray-800 p-6 rounded-md shadow-md border border-gray-700">
                        <div className="mb-4">
                            <span className="text-xl font-bold text-gray-100">${course.coursePrice || "0.00"}</span>
                        </div>
        
                        {/* Dialog Trigger */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Enroll Now
                                </Button>
                            </DialogTrigger>
        
                            <DialogContent className="bg-gray-800 text-gray-100">
                                <DialogHeader>
                                    <DialogTitle className="text-gray-100">Enroll in {course.courseName || "Course"}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleEnrollmentSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="text-gray-200">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={enrollmentData.name}
                                            onChange={handleEnrollmentDataChange}
                                            required
                                            className="bg-gray-700 text-gray-100 border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="text-gray-200">Email</Label>
                                        <Input
                                            id="email"
                                            name="emai-l"
                                            type="email"
                                            value={enrollmentData.email}
                                            onChange={handleEnrollmentDataChange}
                                            required
                                            className="bg-gray-700 text-gray-100 border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="text-gray-200">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={enrollmentData.phone}
                                            onChange={handleEnrollmentDataChange}
                                            required
                                            className="bg-gray-700 text-gray-100 border-gray-600"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="message" className="text-gray-200">Message (Optional)</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={enrollmentData.message}
                                            onChange={handleEnrollmentDataChange}
                                            className="bg-gray-700 text-gray-100 border-gray-600"
                                            rows={4}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Submit</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
        
                        <div className="mt-6 text-center">
                            <h3 className="text-sm font-medium text-gray-400">A course by</h3>
                            <p className="font-semibold text-gray-100">{course.tutorName || "Unknown Tutor"}</p>
                            <div className="text-left mb-6 rounded-md">
                                <img
                                    src={course.thumbnailUrl || "https://via.placeholder.com/800x400"}
                                    alt={course.name || "Course thumbnail"}
                                    className="mt-10 object-contain rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );   
};

export default DisCViewer;