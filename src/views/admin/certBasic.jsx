import { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import { db, auth, storage } from "@/firebase.config";
import { collection, getDocs, setDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Edit, Eye, Image as ImageIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SkeletonCard } from "./components/skeltoncard";
import { useForm, FormProvider } from "react-hook-form";

const CertificateManagement = () => {
  // States for the form
  const [courseCategories, setCourseCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [recognizeAs, setRecognizeAs] = useState("");
  const [certificateImage, setCertificateImage] = useState(null);
  const [certificateImagePreview, setCertificateImagePreview] = useState("");
  
  // States for dropdowns
  const [openCategory, setOpenCategory] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);
  const [searchCategoryTerm, setSearchCategoryTerm] = useState("");
  const [searchCourseTerm, setSearchCourseTerm] = useState("");
  
  // States for loading and submission
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // States for certificates data
  const [certificates, setCertificates] = useState([]);
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [searchCertTerm, setSearchCertTerm] = useState("");
  
  // States for edit mode
  const [editMode, setEditMode] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  
  // Form initialization
  const form = useForm({
    defaultValues: {
      categoryId: "",
      courseId: "",
      recognizeAs: "",
      CertThumb: ""
    }
  });

  // Fetch initial data on component mount
  useEffect(() => {
   // Replace the fetchData function in your useEffect with this:
const fetchData = async () => {
    setIsLoading(true);
    try {
      // Get course categories from courses (since there's no separate collection)
      const coursesCollection = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollection);
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Extract unique categories from courses
      const uniqueCategories = [];
      const categoryMap = {};
      
      coursesData.forEach(course => {
        if (course.category && !categoryMap[course.category]) {
          categoryMap[course.category] = true;
          uniqueCategories.push({
            id: course.category,
            name: course.category
          });
        }
      });
      
      console.log("Extracted categories:", uniqueCategories);
      setCourseCategories(uniqueCategories);
      setCourses(coursesData);
      
      // Fetch certificates
      const certificatesCollection = collection(db, "cert_generate");
      const certificatesSnapshot = await getDocs(certificatesCollection);
      const certificatesData = certificatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificates(certificatesData);
      
      // Fetch issued certificates
      const issuedCertificatesQuery = query(
        collection(db, "cert_generate"), 
        where("cert_generated", "==", true)
      );
      const issuedCertificatesSnapshot = await getDocs(issuedCertificatesQuery);
      const issuedCertificatesData = issuedCertificatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssuedCertificates(issuedCertificatesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

    fetchData();
  }, []);

  // Filter courses when category is selected
  useEffect(() => {
    if (selectedCategory) {
      // Filter courses based on the selected category
      const filtered = courses.filter(course => course.category === selectedCategory);
      console.log("Filtered courses for category", selectedCategory, ":", filtered);    
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [selectedCategory, courses]);

  // Update recognizeAs when course is selected
  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find(c => c.id === selectedCourse);
      if (course) {
        setRecognizeAs(course.courseName || "");
      }
    } else {
      setRecognizeAs("");
    }
  }, [selectedCourse, courses]);

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCertificateImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setCertificateImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission for adding new certificate
  const handleAddCertificate = async () => {
    if (!selectedCategory || !selectedCourse || !recognizeAs || !certificateImage) {
      toast.error("Please fill all fields and upload a certificate image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Firebase Storage
      const storageReference = storageRef(storage, `certificates/${selectedCourse}_${Date.now()}`);
      const uploadResult = await uploadBytes(storageReference, certificateImage);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Save certificate data to Firestore
      const certificateData = {
        categoryId: selectedCategory,
        courseId: selectedCourse,
        recognizeAs: recognizeAs,
        CertThumb: downloadURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cert_generated: false,
        createdBy: auth.currentUser?.uid || "unknown"
      };

      const certDocRef = doc(collection(db, "cert_basicdb"));
      await setDoc(certDocRef, certificateData);

      toast.success("Certificate template added successfully!");
      
      // Reset form
      setSelectedCategory("");
      setSelectedCourse("");
      setRecognizeAs("");
      setCertificateImage(null);
      setCertificateImagePreview("");

      // Refresh certificates data
      const certificatesCollection = collection(db, "cert_basicdb");
      const certificatesSnapshot = await getDocs(certificatesCollection);
      const certificatesData = certificatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificates(certificatesData);
    } catch (error) {
      console.error("Error adding certificate: ", error);
      toast.error("Failed to add certificate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit certificate
  const handleEditCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setSelectedCategory(certificate.categoryId);
    setSelectedCourse(certificate.courseId);
    setRecognizeAs(certificate.recognizeAs);
    setCertificateImagePreview(certificate.CertThumb);
    setOpenEditDialog(true);
  };

  // Handle update certificate
  const handleUpdateCertificate = async () => {
    if (!currentCertificate || !selectedCategory || !selectedCourse || !recognizeAs) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      let CertThumb = currentCertificate.CertThumb;
      
      // If a new image was uploaded, update it
      if (certificateImage) {
        const storageReference = storageRef(storage, `certificates/${selectedCourse}_${Date.now()}`);
        const uploadResult = await uploadBytes(storageReference, certificateImage);
        CertThumb = await getDownloadURL(uploadResult.ref);
      }

      // Update certificate data
      const certificateData = {
        categoryId: selectedCategory,
        courseId: selectedCourse,
        recognizeAs: recognizeAs,
        CertThumb: CertThumb,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid || "unknown"
      };

      await updateDoc(doc(db, "cert_basicdb", currentCertificate.id), certificateData);

      toast.success("Certificate updated successfully!");
      
      // Close dialog and reset form
      setOpenEditDialog(false);
      setCurrentCertificate(null);
      setSelectedCategory("");
      setSelectedCourse("");
      setRecognizeAs("");
      setCertificateImage(null);
      setCertificateImagePreview("");

      // Refresh certificates data
      const certificatesCollection = collection(db, "cert_basicdb");
      const certificatesSnapshot = await getDocs(certificatesCollection);
      const certificatesData = certificatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificates(certificatesData);
    } catch (error) {
      console.error("Error updating certificate: ", error);
      toast.error("Failed to update certificate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter certificates based on search term
  const filteredCertificates = certificates.filter(cert => {
    const courseName = courses.find(c => c.id === cert.courseId)?.courseName || "";
    const categoryName = courseCategories.find(c => c.id === cert.categoryId)?.name || "";
    return (
      courseName.toLowerCase().includes(searchCertTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchCertTerm.toLowerCase()) ||
      cert.recognizeAs.toLowerCase().includes(searchCertTerm.toLowerCase())
    );
  });

  // Filter course categories based on search term
  const filteredCategories = courseCategories.filter(category =>
    category.name?.toLowerCase().includes(searchCategoryTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster />
      <Tabs defaultValue="add">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Certificate Details</TabsTrigger>
          <TabsTrigger value="view">View/Edit Certificate Details</TabsTrigger>
          <TabsTrigger value="issued">View Issued Certificates</TabsTrigger>
        </TabsList>
        
        {/* Add Certificate Details Tab */}
        <TabsContent value="add">
          <Card>
            <CardContent>
              <div className="flex mt-4 justify-between">
                <CardTitle className="px-2 py-2">Add Certificate Template</CardTitle>
              </div>
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <div className="space-y-4 mt-4">
                  {/* Course Category Dropdown */}
                  <div>
                    <div className="text-sm font-medium mb-2">Choose Course Category</div>
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start mt-2">
                          {selectedCategory 
                            ? courseCategories.find(cat => cat.id === selectedCategory)?.name 
                            : "Choose Course Category"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            value={searchCategoryTerm}
                            onValueChange={setSearchCategoryTerm}
                          />
                          <CommandList>
                            {filteredCategories.map(category => (
                              <CommandItem
                                key={category.id}
                                onSelect={() => {
                                  setSelectedCategory(category.id);
                                  setSelectedCourse(""); // Reset course when category changes
                                  setOpenCategory(false);
                                }}
                              >
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Course Dropdown */}
                  <div>
                    <div className="text-sm font-medium mb-2">Choose Course</div>
                    <Popover open={openCourse} onOpenChange={setOpenCourse}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start mt-2"
                          disabled={!selectedCategory}
                        >
                          {selectedCourse 
                            ? courses.find(course => course.id === selectedCourse)?.courseName 
                            : "Choose Course"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search course..."
                            value={searchCourseTerm}
                            onValueChange={setSearchCourseTerm}
                          />
                          <CommandList>
                            {filteredCourses
                              .filter(course => 
                                course.courseName?.toLowerCase().includes(searchCourseTerm.toLowerCase())
                              )
                              .map(course => (
                                <CommandItem
                                  key={course.id}
                                  onSelect={() => {
                                    setSelectedCourse(course.id);
                                    setOpenCourse(false);
                                  }}
                                >
                                  {course.courseName}
                                </CommandItem>
                              ))
                            }
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Recognize As Field */}
                  <div>
                    <div className="text-sm font-medium mb-2">
                    Recognize As</div>
                    <Input 
                      className="mt-2"
                      placeholder="Certificate recognition name"
                      value={recognizeAs}
                      onChange={(e) => setRecognizeAs(e.target.value)}
                    />
                  </div>

                  {/* Certificate Image Upload */}
                  <div>
                    <div className="text-sm font-medium mb-2">Upload Certificate Image</div>
                    <div className="mt-2 flex flex-col space-y-4">
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-md">
                        <label className="cursor-pointer flex flex-col items-center space-y-2">
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                          <span className="text-sm text-gray-500">Click to upload certificate image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      
                      {certificateImagePreview && (
                        <div className="relative">
                          <img 
                            src={certificateImagePreview} 
                            alt="Certificate Preview" 
                            className="w-full max-h-64 object-contain rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setCertificateImage(null);
                              setCertificateImagePreview("");
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddCertificate} 
                    disabled={isSubmitting || !selectedCategory || !selectedCourse || !recognizeAs || !certificateImage} 
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Certificate...
                      </>
                    ) : (
                      "Add Certificate"
                    )}
                  </Button>
                </div>   
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* View/Edit Certificate Details Tab */}
        <TabsContent value="view">
          <Card>
            <CardContent>
              <div className="flex mt-4 justify-between">
                <CardTitle className="px-2 py-2">Certificate Templates</CardTitle>
                <Input
                  placeholder="Search certificates..."
                  value={searchCertTerm}
                  onChange={(e) => setSearchCertTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <div className="mt-4">
                  {filteredCertificates.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No certificate templates found.</p>
                    </div>
                  ) : (
                    <Table className="border rounded-lg">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Category</TableHead>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Recognition</TableHead>
                          <TableHead>Preview</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCertificates.map((cert) => (
                          <TableRow key={cert.id}>
                            <TableCell>
                              {courseCategories.find(c => c.id === cert.categoryId)?.name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              {courses.find(c => c.id === cert.courseId)?.courseName || "Unknown"}
                            </TableCell>
                            <TableCell>{cert.recognizeAs}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(cert.CertThumb, '_blank')}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCertificate(cert)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* View Issued Certificates Tab */}
        <TabsContent value="issued">
          <Card>
            <CardContent>
              <div className="flex mt-4 justify-between">
                <CardTitle className="px-2 py-2">Issued Certificates</CardTitle>
                <Input
                  placeholder="Search issued certificates..."
                  value={searchCertTerm}
                  onChange={(e) => setSearchCertTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <div className="mt-4">
                  {issuedCertificates.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No issued certificates found.</p>
                    </div>
                  ) : (
                    <Table className="border rounded-lg">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course Category</TableHead>
                          <TableHead>Course Name</TableHead>
                          <TableHead>Recognition</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Certificate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {issuedCertificates
                          .filter(cert => {
                            const courseName = courses.find(c => c.id === cert.courseId)?.courseName || "";
                            const categoryName = courseCategories.find(c => c.id === cert.categoryId)?.name || "";
                            return (
                              courseName.toLowerCase().includes(searchCertTerm.toLowerCase()) ||
                              categoryName.toLowerCase().includes(searchCertTerm.toLowerCase()) ||
                              cert.recognizeAs.toLowerCase().includes(searchCertTerm.toLowerCase())
                            );
                          })
                          .map((cert) => (
                            <TableRow key={cert.id}>
                              <TableCell>
                                {courseCategories.find(c => c.id === cert.categoryId)?.name || "Unknown"}
                              </TableCell>
                              <TableCell>
                                {courses.find(c => c.id === cert.courseId)?.courseName || "Unknown"}
                              </TableCell>
                              <TableCell>{cert.recognizeAs}</TableCell>
                              <TableCell>
                                {new Date(cert.issueDate || cert.updatedAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(cert.CertThumb, '_blank')}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Certificate Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Certificate Template</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Course Category Dropdown */}
            <div>
              <div className="text-sm font-medium mb-2">Choose Course Category</div>
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start mt-2">
                    {selectedCategory 
                      ? courseCategories.find(cat => cat.id === selectedCategory)?.name 
                      : "Choose Course Category"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search category..."
                      value={searchCategoryTerm}
                      onValueChange={setSearchCategoryTerm}
                    />
                    <CommandList>
                      {filteredCategories.map(category => (
                        <CommandItem
                          key={category.id}
                          onSelect={() => {
                            setSelectedCategory(category.id);
                            setSelectedCourse(""); // Reset course when category changes
                            setOpenCategory(false);
                          }}
                        >
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Course Dropdown */}
            <div>
              <div className="text-sm font-medium mb-2">Choose Course</div>
              <Popover open={openCourse} onOpenChange={setOpenCourse}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start mt-2"
                    disabled={!selectedCategory}
                  >
                    {selectedCourse 
                      ? courses.find(course => course.id === selectedCourse)?.courseName 
                      : "Choose Course"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search course..."
                      value={searchCourseTerm}
                      onValueChange={setSearchCourseTerm}
                    />
                    <CommandList>
                      {filteredCourses
                        .filter(course => 
                          course.courseName?.toLowerCase().includes(searchCourseTerm.toLowerCase())
                        )
                        .map(course => (
                          <CommandItem
                            key={course.id}
                            onSelect={() => {
                              setSelectedCourse(course.id);
                              setOpenCourse(false);
                            }}
                          >
                            {course.courseName}
                          </CommandItem>
                        ))
                      }
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Recognize As Field */}
            <div>
              <div className="text-sm font-medium mb-2">Recognize As</div>
              <Input 
                className="mt-2"
                placeholder="Certificate recognition name"
                value={recognizeAs}
                onChange={(e) => setRecognizeAs(e.target.value)}
              />
            </div>

            {/* Certificate Image Upload/Preview */}
            <div>
              <div className="text-sm font-medium mb-2">Certificate Image</div>
              <div className="mt-2 flex flex-col space-y-4">
                {certificateImagePreview && (
                  <div className="relative">
                    <img 
                      src={certificateImagePreview} 
                      alt="Certificate Preview" 
                      className="w-full max-h-64 object-contain rounded-md"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-md">
                  <label className="cursor-pointer flex flex-col items-center space-y-2">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload new certificate image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCertificate} 
              disabled={isSubmitting || !selectedCategory || !selectedCourse || !recognizeAs}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Certificate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificateManagement;