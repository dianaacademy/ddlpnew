import { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import { db, auth } from "@/firebase.config";
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc as firestoreDeleteDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SkeletonCard } from "./components/skeltoncard";


const AssignCourseUP = () => {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchStudentTerm, setSearchStudentTerm] = useState("");
  const [searchCourseTerm, setSearchCourseTerm] = useState("");
  const [searchEnrolledTerm, setSearchEnrolledTerm] = useState("");
  const [openStudent, setOpenStudent] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpelling, setIsExpelling] = useState(false);
  const [courseToExpel, setCourseToExpel] = useState(null);
  const [studentToExpel, setStudentToExpel] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = getDatabase();
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        const usersData = snapshot.val();

        if (usersData) {
          const usersList = Object.entries(usersData).map(([uid, userData]) => ({
            id: uid,
            email: userData.email,
            name: userData.name,
            role: userData.role
          }));
          setStudents(usersList);
        }

        const coursesCollection = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);

        const enrolledStudentsCollection = collection(db, "enrolledstudents");
        const enrolledStudentsSnapshot = await getDocs(enrolledStudentsCollection);
        const enrolledStudentsData = enrolledStudentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEnrolledStudents(enrolledStudentsData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignCourse = async () => {
    if (!studentId || !courseId) {
      toast.error("Please select a student and a course.");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCourse = courses.find(course => course.id === courseId);
      const courseName = selectedCourse?.courseName || '';
      const currentDate = new Date().toISOString();
      const currentUserId = auth.currentUser?.uid;

      const enrolledStudentDoc = doc(db, "enrolledstudents", studentId);
      
      await setDoc(enrolledStudentDoc, {
        studentId: studentId,
        courses: {
          [courseId]: {
            course_id: courseId,
            course_name: courseName,
            enrolled_by: currentUserId,
            enrolled_date: currentDate,
          }
        }
      }, { merge: true });

      toast.success("Course assigned successfully!");
      
      setStudentId("");
      setCourseId("");
      setOpenStudent(false);
      setOpenCourse(false);
      
      // Refresh enrolled students data
      const enrolledStudentsCollection = collection(db, "enrolledstudents");
      const enrolledStudentsSnapshot = await getDocs(enrolledStudentsCollection);
      const enrolledStudentsData = enrolledStudentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEnrolledStudents(enrolledStudentsData);
    } catch (error) {
      console.error("Error assigning course: ", error);
      toast.error("Failed to assign course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpelFromCourse = async () => {
    if (!studentToExpel || !courseToExpel) return;

    setIsExpelling(true);

    try {
      const studentDoc = doc(db, "enrolledstudents", studentToExpel);
      const studentData = enrolledStudents.find(student => student.id === studentToExpel);
      
      if (studentData) {
        const updatedCourses = { ...studentData.courses };
        delete updatedCourses[courseToExpel];
        
        if (Object.keys(updatedCourses).length === 0) {
          // If there are no courses left, delete the entire document
          await firestoreDeleteDoc(studentDoc);
        } else {
          // If there are still other courses, update the courses object
          await updateDoc(studentDoc, {
            courses: updatedCourses
          });
        }

        toast.success("Student expelled from course successfully!");
        
        // Refresh enrolled students data
        const enrolledStudentsCollection = collection(db, "enrolledstudents");
        const enrolledStudentsSnapshot = await getDocs(enrolledStudentsCollection);
        const enrolledStudentsData = enrolledStudentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEnrolledStudents(enrolledStudentsData);
      }
    } catch (error) {
      console.error("Error expelling student from course: ", error);
      toast.error("Failed to expel student from course. Please try again.");
    } finally {
      setIsExpelling(false);
      setStudentToExpel(null);
      setCourseToExpel(null);
    }
  };

  const filteredStudents = students.filter(student =>
    student.email?.toLowerCase().includes(searchStudentTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.courseName?.toLowerCase().includes(searchCourseTerm.toLowerCase())
  );

  const filteredEnrolledStudents = enrolledStudents.filter(student => {
    const studentEmail = students.find(s => s.id === student.studentId)?.email || '';
    const coursesMatch = Object.values(student.courses || {}).some(course =>
      course.course_name.toLowerCase().includes(searchEnrolledTerm.toLowerCase())
    );
    return studentEmail.toLowerCase().includes(searchEnrolledTerm.toLowerCase()) || coursesMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEnrolledStudents = filteredEnrolledStudents.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <Tabs defaultValue="enroll">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enroll">Enroll Students</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled Student Data</TabsTrigger>
        </TabsList>
        <TabsContent value="enroll">
          <Card>
            <CardContent>
              <div className="flex mt-4 justify-between">
                <CardTitle className="px-2 py-2">Assign Course to Student</CardTitle>
              </div>
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <div className="space-y-4">
                  <Popover open={openStudent} onOpenChange={setOpenStudent}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {studentId ? students.find(student => student.id === studentId)?.email : "Choose Student"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search student email..."
                          value={searchStudentTerm}
                          onValueChange={setSearchStudentTerm}
                        />
                        <CommandList>
                          {filteredStudents.map(student => (
                            <CommandItem
                              key={student.id}
                              onSelect={() => {
                                setStudentId(student.id);
                                setOpenStudent(false);
                              }}
                            >
                              {student.email}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Popover open={openCourse} onOpenChange={setOpenCourse}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {courseId ? courses.find(course => course.id === courseId)?.courseName : "Choose Course"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search courses..."
                          value={searchCourseTerm}
                          onValueChange={setSearchCourseTerm}
                        />
                        <CommandList>
                          {filteredCourses.map(course => (
                            <CommandItem
                              key={course.id}
                              onSelect={() => {
                                setCourseId(course.id);
                                setOpenCourse(false);
                              }}
                            >
                              {course.courseName}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Button 
                    onClick={handleAssignCourse} 
                    disabled={isSubmitting || isLoading} 
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      "Assign Course"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="enrolled">
          <Card>
            <CardContent>
              <div className="flex mt-4 justify-between">
                <CardTitle className="px-2 py-2">Enrolled Student Data</CardTitle>
                <Input
                  placeholder="Search by student email or course..."
                  value={searchEnrolledTerm}
                  onChange={(e) => setSearchEnrolledTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Table className="border rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Email</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEnrolledStudents.map((student) => (
                    Object.entries(student.courses || {}).map(([courseId, course]) => (
                      <TableRow key={`${student.id}-${courseId}`}>
                        <TableCell>{students.find(s => s.id === student.studentId)?.email}</TableCell>
                        <TableCell>{course.course_name}</TableCell>
                        <TableCell>{new Date(course.enrolled_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setStudentToExpel(student.id);
                              setCourseToExpel(courseId);
                            }}
                            disabled={isExpelling}
                          >
                            {isExpelling ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Expelling...
                              </>
                            ) : (
                              "Expel"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                {Array.from({ length: Math.ceil(filteredEnrolledStudents.length / itemsPerPage) }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => paginate(i + 1)}
                    className="mx-1"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={!!studentToExpel && !!courseToExpel} 
        onOpenChange={() => {
          setStudentToExpel(null);
          setCourseToExpel(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the student from this course. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExpelFromCourse} 
              disabled={isExpelling}
            >
              {isExpelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Expelling...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssignCourseUP;