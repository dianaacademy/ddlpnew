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

const AssignBookUP = () => {
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchStudentTerm, setSearchStudentTerm] = useState("");
  const [searchBookTerm, setSearchBookTerm] = useState("");
  const [searchEnrolledTerm, setSearchEnrolledTerm] = useState("");
  const [openStudent, setOpenStudent] = useState(false);
  const [openBook, setOpenBook] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpelling, setIsExpelling] = useState(false);
  const [bookToExpel, setBookToExpel] = useState(null);
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

        const booksCollection = collection(db, "books_db");
        const booksSnapshot = await getDocs(booksCollection);
        const booksData = booksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBooks(booksData);

        const enrolledStudentsCollection = collection(db, "booksaccess");
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

  const handleAssignBook = async () => {
    if (!studentId || !bookId) {
      toast.error("Please select a student and a book.");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedBook = books.find(book => book.id === bookId);
      const bookName = selectedBook?.bookName || '';
      const currentDate = new Date().toISOString();
      const currentUserId = auth.currentUser?.uid;

      const enrolledStudentDoc = doc(db, "booksaccess", studentId);
      
      await setDoc(enrolledStudentDoc, {
        studentId: studentId,
        books: {
          [bookId]: {
            book_id: bookId,
            book_name: bookName,
            enrolled_by: currentUserId,
            enrolled_date: currentDate,
          }
        }
      }, { merge: true });

      toast.success("Book assigned successfully!");
      
      setStudentId("");
      setBookId("");
      setOpenStudent(false);
      setOpenBook(false);
      
      // Refresh enrolled students data
      const enrolledStudentsCollection = collection(db, "booksaccess");
      const enrolledStudentsSnapshot = await getDocs(enrolledStudentsCollection);
      const enrolledStudentsData = enrolledStudentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEnrolledStudents(enrolledStudentsData);
    } catch (error) {
      console.error("Error assigning book: ", error);
      toast.error("Failed to assign book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpelFromBook = async () => {
    if (!studentToExpel || !bookToExpel) return;

    setIsExpelling(true);

    try {
      const studentDoc = doc(db, "booksaccess", studentToExpel);
      const studentData = enrolledStudents.find(student => student.id === studentToExpel);
      
      if (studentData) {
        const updatedBooks = { ...studentData.books };
        delete updatedBooks[bookToExpel];
        
        if (Object.keys(updatedBooks).length === 0) {
          // If there are no books left, delete the entire document
          await firestoreDeleteDoc(studentDoc);
        } else {
          // If there are still other books, update the books object
          await updateDoc(studentDoc, {
            books: updatedBooks
          });
        }

        toast.success("Student expelled from book successfully!");
        
        // Refresh enrolled students data
        const enrolledStudentsCollection = collection(db, "booksaccess");
        const enrolledStudentsSnapshot = await getDocs(enrolledStudentsCollection);
        const enrolledStudentsData = enrolledStudentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEnrolledStudents(enrolledStudentsData);
      }
    } catch (error) {
      console.error("Error expelling student from book: ", error);
      toast.error("Failed to expel student from book. Please try again.");
    } finally {
      setIsExpelling(false);
      setStudentToExpel(null);
      setBookToExpel(null);
    }
  };

  const filteredStudents = students.filter(student =>
    student.email?.toLowerCase().includes(searchStudentTerm.toLowerCase())
  );

  const filteredBooks = books.filter(book =>
    book.bookName?.toLowerCase().includes(searchBookTerm.toLowerCase())
  );

  const filteredEnrolledStudents = enrolledStudents.filter(student => {
    const studentEmail = students.find(s => s.id === student.studentId)?.email || '';
    const booksMatch = Object.values(student.books || {}).some(book =>
      book.book_name.toLowerCase().includes(searchEnrolledTerm.toLowerCase())
    );
    return studentEmail.toLowerCase().includes(searchEnrolledTerm.toLowerCase()) || booksMatch;
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
                <CardTitle className="px-2 py-2">Assign Book to Student</CardTitle>
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

                  <Popover open={openBook} onOpenChange={setOpenBook}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {bookId ? books.find(book => book.id === bookId)?.bookName : "Choose Book"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search books..."
                          value={searchBookTerm}
                          onValueChange={setSearchBookTerm}
                        />
                        <CommandList>
                          {filteredBooks.map(book => (
                            <CommandItem
                              key={book.id}
                              onSelect={() => {
                                setBookId(book.id);
                                setOpenBook(false);
                              }}
                            >
                              {book.bookName}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Button 
                    onClick={handleAssignBook} 
                    disabled={isSubmitting || isLoading} 
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      "Assign Book"
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
                  placeholder="Search by student email or book..."
                  value={searchEnrolledTerm}
                  onChange={(e) => setSearchEnrolledTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Table className="border rounded-lg">
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Email</TableHead>
                    <TableHead>Book Name</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEnrolledStudents.map((student) => (
                    Object.entries(student.books || {}).map(([bookId, book]) => (
                      <TableRow key={`${student.id}-${bookId}`}>
                        <TableCell>{students.find(s => s.id === student.studentId)?.email}</TableCell>
                        <TableCell>{book.book_name}</TableCell>
                        <TableCell>{new Date(book.enrolled_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setStudentToExpel(student.id);
                              setBookToExpel(bookId);
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
        open={!!studentToExpel && !!bookToExpel} 
        onOpenChange={() => {
          setStudentToExpel(null);
          setBookToExpel(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the student from this book. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExpelFromBook} 
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

export default AssignBookUP;