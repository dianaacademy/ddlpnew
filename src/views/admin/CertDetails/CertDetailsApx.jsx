import { useState, useEffect } from "react";
import { db, storage } from "@/firebase.config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, Download as DownloadIcon, Check, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SkeletonCard } from "../components/skeltoncard";
import { format } from "date-fns";
import ReactDOM from "react-dom/client";
import Certificate from "../../student/Coursetrack/CertDesign";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateDetailsPage = () => {
  // States for certificates data
  const [certificateRequests, setCertificateRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);

  // Fetch certificate data on component mount
  useEffect(() => {
    fetchCertificateRequests();
  }, []);

  const fetchCertificateRequests = async () => {
    setIsLoading(true);
    try {
      const certificatesCollection = collection(db, "cert_generate");
      const certificatesSnapshot = await getDocs(certificatesCollection);
      const certificatesData = certificatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by requestedAt (newest first)
      certificatesData.sort((a, b) => {
        return new Date(b.requestedAt) - new Date(a.requestedAt);
      });
      
      setCertificateRequests(certificatesData);
    } catch (error) {
      console.error("Error fetching certificate requests: ", error);
      toast.error("Failed to fetch certificate requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle generating certificate - integrated directly in the component
  const handleGenerateCertificate = async (certData) => {
    setIsProcessing(true);
    setProcessingId(certData.id);
    
    const toastId = toast.loading("Processing certificate request...");
    
    try {
      if (!certData || !certData.id) {
        throw new Error("Invalid certificate data");
      }
      
      // Check if cert_URL already exists and is valid
      if (certData.cert_URL && typeof certData.cert_URL === 'string' && 
          certData.cert_URL.startsWith('http') && !certData.cert_URL.includes('example.com')) {
        
        // Certificate URL already exists, update toast
        toast.loading("Certificate already generated, preparing download...", { id: toastId });
        
        // Just open the existing URL
        setTimeout(() => {
          window.open(certData.cert_URL, "_blank");
          toast.success("Certificate download initiated!", { id: toastId });
        }, 1000);
        
        // Refresh certificate data
        fetchCertificateRequests();
        return;
      }
      
      // Show sequence of toast notifications to indicate progress
      setTimeout(() => {
        toast.loading("Locating your certificate...", { id: toastId });
      }, 1000);
      
      setTimeout(() => {
        toast.loading("Downloading your certificate...", { id: toastId });
      }, 2000);
      
      // Create a temporary div to render the certificate
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);
      
      // Render the Certificate component in the temporary container
      const root = ReactDOM.createRoot(tempContainer);
      root.render(<Certificate certData={certData} certDocId={certData.id} />);
      
      // Wait for the certificate to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the certificate element
      const certificateElement = tempContainer.querySelector('#cert_x7d9f1');
      
      if (!certificateElement) {
        throw new Error("Certificate element not found");
      }
      
      // Use html2canvas to create a canvas from the certificate
      const canvas = await html2canvas(certificateElement, {
        scale: 1.5,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Convert canvas to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });
      
      // Add image to PDF
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;
      
      let scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      let xPos = (pdfWidth - imgWidth * scale) / 2;
      let yPos = (pdfHeight - imgHeight * scale) / 2;
      
      pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth * scale, imgHeight * scale);
      
      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');
      
      // Upload to Firebase Storage
      const fileRef = storageRef(storage, `certificates/${certData.id}_${Date.now()}.pdf`);
      const uploadTask = await uploadBytes(fileRef, pdfBlob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      // Update Firestore with the real URL
      await updateDoc(doc(db, "cert_generate", certData.id), {
        cert_generated: true,
        cert_URL: downloadURL
      });
      
      // Clean up temporary container
      document.body.removeChild(tempContainer);
      
      // Success toast
      toast.success("Certificate generated successfully!", { id: toastId });
      
      // Open the certificate in a new tab
      window.open(downloadURL, "_blank");
      
      // Refresh certificate data
      fetchCertificateRequests();
      
    } catch (error) {
      console.error("Error generating certificate: ", error);
      toast.error("Failed to generate certificate: " + error.message, { id: toastId });
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };
  
  // Handle approval/rejection
  const handleApprovalChange = async (certId, value) => {
    const isApproved = value === "accept";
    setIsProcessing(true);
    setProcessingId(certId);
    
    try {
      await updateDoc(doc(db, "cert_generate", certId), {
        isAdminApprove: isApproved,
        approvedAt: isApproved ? new Date().toISOString() : null
      });
      
      if (isApproved) {
        toast.success("Certificate approved successfully!");
      } else {
        toast.error("Certificate rejected!");
      }
      
      // Refresh certificate data
      fetchCertificateRequests();
      
    } catch (error) {
      console.error("Error updating approval status: ", error);
      toast.error("Failed to update approval status. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingId(null);
    }
  };
  
  // Handle view certificate
  const handleViewCertificate = (cert) => {
    setCurrentCertificate(cert);
    setViewDialogOpen(true);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch (error) {
      return "Invalid Date";
    }
  };
  
  // Filter certificates based on search term
  const filteredCertificates = certificateRequests.filter(cert => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (cert.name?.toLowerCase() || "").includes(searchTermLower) ||
      (cert.email?.toLowerCase() || "").includes(searchTermLower) ||
      (cert.courseName?.toLowerCase() || "").includes(searchTermLower) ||
      (cert.CertNumber?.toLowerCase() || "").includes(searchTermLower)
    );
  });

  return (
    <div className="max-w-full mx-auto p-4">
      <Toaster />
      <Card>
        <CardContent>
          <div className="flex mt-4 justify-between items-center">
            <CardTitle className="px-2 py-2">Certificate Management</CardTitle>
            <div className="flex space-x-4">
              <Button onClick={fetchCertificateRequests} variant="outline" size="sm">
                <Loader2 className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Input
                placeholder="Search by name, email, course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>
          
          {isLoading ? (
            <SkeletonCard />
          ) : (
            <div className="mt-4 overflow-x-auto">
              {filteredCertificates.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No certificate requests found.</p>
                </div>
              ) : (
                <Table className="border rounded-lg">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Requested At</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead>Certificate Number</TableHead>
                      <TableHead>View/Generate</TableHead>
                      <TableHead>Approve/Reject</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="font-medium">{cert.name || "N/A"}</TableCell>
                        <TableCell>{cert.email || "N/A"}</TableCell>
                        <TableCell>{cert.courseName || "N/A"}</TableCell>
                        <TableCell>{formatDate(cert.requestedAt)}</TableCell>
                        <TableCell>{formatDate(cert.CertDeliveryTime)}</TableCell>
                        <TableCell>{cert.CertNumber || "Not Generated"}</TableCell>
                        <TableCell>
                          {cert.isAdminApprove === false ? (
                            <span className="text-red-500 text-sm">Certificate Rejected</span>
                          ) : cert.cert_generated && cert.cert_URL ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(cert.cert_URL, '_blank')}
                              className="flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleGenerateCertificate(cert)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md transition-colors duration-200 flex items-center text-xs"
                              disabled={isProcessing && processingId === cert.id}
                              size="sm"
                            >
                              {isProcessing && processingId === cert.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Generate
                                  <DownloadIcon size={14} className="ml-1" />
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Select
                              defaultValue={cert.isAdminApprove === false ? "reject" : "accept"}
                              onValueChange={(value) => handleApprovalChange(cert.id, value)}
                              disabled={isProcessing && processingId === cert.id}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="accept">
                                  <div className="flex items-center">
                                    <Check size={16} className="text-green-500 mr-2" />
                                    Accept
                                  </div>
                                </SelectItem>
                                <SelectItem value="reject">
                                  <div className="flex items-center">
                                    <X size={16} className="text-red-500 mr-2" />
                                    Reject
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
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

      {/* Certificate View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Details</DialogTitle>
          </DialogHeader>
          
          {currentCertificate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Recipient Details</h3>
                  <p><span className="text-gray-500">Name:</span> {currentCertificate.title || ""} {currentCertificate.name}</p>
                  <p><span className="text-gray-500">Email:</span> {currentCertificate.email}</p>
                  <p><span className="text-gray-500">Phone:</span> {currentCertificate.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-medium">Certificate Details</h3>
                  <p><span className="text-gray-500">Course:</span> {currentCertificate.courseName}</p>
                  <p><span className="text-gray-500">Category:</span> {currentCertificate.courseCategory}</p>
                  <p><span className="text-gray-500">Recognition:</span> {currentCertificate.recognizeAs}</p>
                  <p><span className="text-gray-500">Certificate Number:</span> {currentCertificate.CertNumber || "Not Generated"}</p>
                </div>
              </div>
              
              {currentCertificate.CertThumb && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Certificate Preview</h3>
                  <div className="relative rounded-md overflow-hidden border">
                    <img 
                      src={currentCertificate.CertThumb} 
                      alt="Certificate Preview" 
                      className="w-full object-contain"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-4">
                <div>
                  <p><span className="text-gray-500">Requested:</span> {formatDate(currentCertificate.requestedAt)}</p>
                  <p><span className="text-gray-500">Delivery Date:</span> {formatDate(currentCertificate.CertDeliveryTime)}</p>
                </div>
                <div>
                  <p>
                    <span className="text-gray-500">Status:</span> 
                    {currentCertificate.isAdminApprove === false ? (
                      <span className="text-red-500 ml-1">Rejected</span>
                    ) : currentCertificate.cert_generated ? (
                      <span className="text-green-500 ml-1">Generated</span>
                    ) : (
                      <span className="text-yellow-500 ml-1">Pending</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {currentCertificate && currentCertificate.cert_URL && (
              <Button 
                onClick={() => window.open(currentCertificate.cert_URL, '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <DownloadIcon size={16} className="mr-2" />
                Download Certificate
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificateDetailsPage;