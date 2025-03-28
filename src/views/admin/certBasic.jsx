import { useState, useEffect } from "react";
import { getDatabase, ref, get } from 'firebase/database';
import { db, auth, storage } from "@/firebase.config";
import { collection, getDocs, setDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter, 
  SheetClose 
} from "@/components/ui/sheet";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription 
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Loader2, Edit, Eye, Image as ImageIcon, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SkeletonCard } from "./components/skeltoncard";
import { useForm, FormProvider } from "react-hook-form";
import CertificateDetailsPage from "./CertDetails/CertDetailsApx";

const CertificateManagement = () => {
  const [courseCategories, setCourseCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [recognizeAs, setRecognizeAs] = useState("");
  const [certificateImage, setCertificateImage] = useState(null);
  const [certificateImagePreview, setCertificateImagePreview] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [openCourse, setOpenCourse] = useState(false);
  const [searchCategoryTerm, setSearchCategoryTerm] = useState("");
  const [searchCourseTerm, setSearchCourseTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [certificates, setCertificates] = useState([]);
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [searchCertTerm, setSearchCertTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openImageDrawer, setOpenImageDrawer] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isFormModified, setIsFormModified] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  const form = useForm({
    defaultValues: {
      categoryId: "",
      courseId: "",
      recognizeAs: "",
      CertThumb: ""
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const coursesCollection = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesData = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
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
        
        setCourseCategories(uniqueCategories);
        setCourses(coursesData);
        
        const certificatesCollection = collection(db, "cert_basicdb");
        const certificatesSnapshot = await getDocs(certificatesCollection);
        const certificatesData = certificatesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCertificates(certificatesData);
        
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

  useEffect(() => {
    if (selectedCategory) {
      const filtered = courses.filter(course => course.category === selectedCategory);
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [selectedCategory, courses]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Image size should not exceed 1MB");
        return;
      }
      
      setCertificateImage(file);
      setIsFormModified(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setCertificateImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageWithProgress = async (file, path) => {
    try {
      const reference = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(reference, file);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploadProgress(0);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleAddCertificate = async () => {
    if (!selectedCategory || !selectedCourse || !recognizeAs || !certificateImage) {
      toast.error("Please fill all fields and upload a certificate image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const downloadURL = await uploadImageWithProgress(
        certificateImage, 
        `certificates/${selectedCourse}_${Date.now()}`
      );

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
      
      setSelectedCategory("");
      setSelectedCourse("");
      setRecognizeAs("");
      setCertificateImage(null);
      setCertificateImagePreview("");

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

  const handleEditCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setSelectedCategory(certificate.categoryId);
    setSelectedCourse(certificate.courseId);
    setRecognizeAs(certificate.recognizeAs);
    setCertificateImagePreview(certificate.CertThumb);
    setInitialValues({
      categoryId: certificate.categoryId,
      courseId: certificate.courseId,
      recognizeAs: certificate.recognizeAs,
      CertThumb: certificate.CertThumb
    });
    setOpenEditSheet(true);
    setIsFormModified(false);
  };

  const handleUpdateCertificate = async () => {
    if (!currentCertificate) {
      toast.error("No certificate selected for update.");
      return;
    }

    setIsSubmitting(true);

    try {
      let CertThumb = currentCertificate.CertThumb;
      
      if (certificateImage) {
        CertThumb = await uploadImageWithProgress(
          certificateImage, 
          `certificates/${selectedCourse}_${Date.now()}`
        ).catch(error => {
          toast.error(`Image upload failed: ${error.message}`);
          throw error;
        });
      }

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
      
      setOpenEditSheet(false);
      setCurrentCertificate(null);
      setSelectedCategory("");
      setSelectedCourse("");
      setRecognizeAs("");
      setCertificateImage(null);
      setCertificateImagePreview("");
      setIsFormModified(false);

      const certificatesCollection = collection(db, "cert_basicdb");
      const certificatesSnapshot = await getDocs(certificatesCollection);
      const certificatesData = certificatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificates(certificatesData);
    } catch (error) {
      console.error("Error updating certificate:", error);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewImage = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageDrawer(true);
  };

  const filteredCertificates = certificates.filter(cert => {
    const courseName = courses.find(c => c.id === cert.courseId)?.courseName || "";
    const categoryName = courseCategories.find(c => c.id === cert.categoryId)?.name || "";
    return (
      courseName.toLowerCase().includes(searchCertTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchCertTerm.toLowerCase()) ||
      cert.recognizeAs.toLowerCase().includes(searchCertTerm.toLowerCase())
    );
  });

  const filteredCategories = courseCategories.filter(category =>
    category.name?.toLowerCase().includes(searchCategoryTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Toaster />
      <Tabs defaultValue="add">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Certificate Details</TabsTrigger>
          <TabsTrigger value="view">View/Edit Certificate Details</TabsTrigger>
          <TabsTrigger value="issued">View Issued Certificates</TabsTrigger>
        </TabsList>
        
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
                                  setSelectedCourse("");
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
                                    setRecognizeAs(course.courseName);
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

                  <div>
                    <div className="text-sm font-medium mb-2">Recognize As</div>
                    <Input 
                      className="mt-2"
                      placeholder="Certificate recognition name"
                      value={recognizeAs}
                      onChange={(e) => setRecognizeAs(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Upload Certificate Badge image</div>
                    <div className="mt-2 flex flex-col space-y-4">
                      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-md">
                        <label className="cursor-pointer flex flex-col items-center space-y-2">
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                          <span className="text-sm text-gray-500">Click to Upload Certificate Badge image</span>
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

                      {uploadProgress > 0 && (
                        <Progress value={uploadProgress} className="w-full" />
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
                              {courses.find(c => c.id === cert.courseId)?.courseName || "Unknown"}
                            </TableCell>
                            <TableCell>{cert.recognizeAs}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewImage(cert.CertThumb)}
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
        
        <TabsContent value="issued">
          <CertificateDetailsPage/>
        </TabsContent>
      </Tabs>

      <Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
        <SheetContent className="w-[500px] overflow-y-auto">
          <SheetHeader className="sticky top-0 bg-white z-10">
            <SheetTitle>Edit Certificate Template</SheetTitle>
            <SheetDescription>
              Update details for your certificate template
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 mt-4 pb-24">
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
                            setSelectedCourse("");
                            setOpenCategory(false);
                            setIsFormModified(true);
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
                              setIsFormModified(true);
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

            <div>
              <div className="text-sm font-medium mb-2">Recognize As</div>
              <Input 
                className="mt-2"
                placeholder="Certificate recognition name"
                value={recognizeAs}
                onChange={(e) => {
                  setRecognizeAs(e.target.value);
                  setIsFormModified(true);
                }}
              />
            </div>

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
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setCertificateImage(null);
                        setCertificateImagePreview("");
                        setIsFormModified(true);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
                
                {uploadProgress > 0 && (
                  <Progress value={uploadProgress} className="w-full" />
                )}
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex justify-end gap-2">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button 
                onClick={handleUpdateCertificate} 
                disabled={isSubmitting || !isFormModified}
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
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Drawer open={openImageDrawer} onOpenChange={setOpenImageDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Certificate Image</DrawerTitle>
            <DrawerDescription>Full view of the certificate image</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex justify-center items-center">
            <img 
              src={selectedImageUrl} 
              alt="Certificate Full View" 
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CertificateManagement;