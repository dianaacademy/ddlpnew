import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useAuth } from "@/auth/hooks/useauth";
import { db, storage } from "@/firebase.config";
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { getDatabase, ref as dbRef, get } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ChevronRightIcon, DownloadIcon } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Certificate from "./CertDesign";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast, { Toaster } from "react-hot-toast";

// Helper: Returns an array of valid words (only letters and at least 3 characters)
const getValidWords = (str) => {
  const words = str.split(' ');
  // Only allow words with letters (A-Z, case-insensitive) and length at least 3.
  return words.filter(word => /^[A-Za-z]{3,}$/.test(word));
};

// Certificate number generation function
const generateCertificateNumber = (firstName, lastName, recognized) => {
  if (!recognized) {
    throw new Error("Recognized value is missing");
  }
  
  // Extract valid words from the recognized string
  const validWords = getValidWords(recognized);
  // Use first valid word for the suffix and second valid word for the prefix.
  const recognizedAsSuffix = validWords[0] ? validWords[0].slice(0, 3).toUpperCase() : "DNA";
  const recognizedAsPrefix = validWords[1] ? validWords[1].slice(0, 3).toUpperCase() : "DNA";
  
  // For name initials: first character from first and last name (uppercased)
  const lastNamePrefix = lastName[0].toUpperCase();
  const firstNamePrefix = firstName[0].toUpperCase();
  
  // Generate a future timestamp (2-3 hours from now)
  const now = new Date();
  const randomHours = 2 + Math.random(); // Random time between 2-3 hours
  const futureTime = new Date(now.getTime() + (randomHours * 60 * 60 * 1000));
  
  const dd = String(futureTime.getDate()).padStart(2, '0');
  const mm = String(futureTime.getMonth() + 1).padStart(2, '0');
  const yyyy = futureTime.getFullYear();
  const hours = String(futureTime.getHours()).padStart(2, '0');
  const minutes = String(futureTime.getMinutes()).padStart(2, '0');
  
  const dateFormatted = `${dd}${mm}${yyyy}-${hours}${minutes}`;
  
  return `DATA / ${recognizedAsPrefix}-${recognizedAsSuffix} / ${firstNamePrefix}${lastNamePrefix}-${dateFormatted} / DATA`;
};

// Helper function to capitalize first letter of each word
const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const CertificateGenerator = ({ courseId, courseName, courseCategory }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: "Mr.",
    name: "",
    email: "",
    phoneNumber: "",
    courseName: courseName || "",
    courseCategory: courseCategory || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certStatus, setCertStatus] = useState(null);
  const [certData, setCertData] = useState(null);
  const [certDocId, setCertDocId] = useState(null); // Store document ID for updates
  const [loading, setLoading] = useState(true);
  const [recognizedAs, setRecognizedAs] = useState("");
  const [certThumb, setCertThumb] = useState("");
  const [recognizedAsLoading, setRecognizedAsLoading] = useState(true);
  const [certReadyTime, setCertReadyTime] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAdminApprove, setIsAdminApprove] = useState(true); // Added approval state

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) return;
        
        // Fetch user data from Firebase Realtime Database
        const database = getDatabase();
        const userRef = dbRef(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const fullName = userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}`
            : userData.displayName || "";
            
          setFormData(prev => ({
            ...prev,
            name: fullName,
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            title: userData.title || "Mr."
          }));
        }
        
        // Fetch recognizedAs from cert_basicdb based on courseId
        const fetchCertBasicData = async (courseId) => {
          if (courseId) {
            try {
              // Query the cert_basicdb to find document that matches the courseId
              const certBasicRef = collection(db, "cert_basicdb");
              const q = query(certBasicRef, where("courseId", "==", courseId));
              const querySnapshot = await getDocs(q);
              
              if (!querySnapshot.empty) {
                const certBasicDoc = querySnapshot.docs[0];
                const data = certBasicDoc.data();
                setRecognizedAs(data.recognizeAs || "DNA Certificate");
                setCertThumb(data.CertThumb || "https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/certificates%2FSYl7lwe2lGvcEJ6TBsBa_1742207407976?alt=media&token=a6262a0c-49a1-4f10-9977-493408db0a6e");
                console.log("Recognized As:", data.recognizeAs);
                console.log("Cert Thumb:", data.CertThumb);
              } else {
                // Fallback to direct ID lookup
                const directRef = doc(db, "cert_basicdb", courseId);
                const directDoc = await getDoc(directRef);
                
                if (directDoc.exists()) {
                  const data = directDoc.data();
                  setRecognizedAs(data.recognizeAs || "DNA Certificate");
                  setCertThumb(data.CertThumb || "https://firebasestorage.googleapis.com/v0/b/ddlp-456ce.appspot.com/o/certificates%2FSYl7lwe2lGvcEJ6TBsBa_1742207407976?alt=media&token=a6262a0c-49a1-4f10-9977-493408db0a6e");
                  console.log("Recognized As (direct):", data.recognizeAs);
                  console.log("Cert Thumb (direct):", data.CertThumb);
                } else {
                  console.log("No cert_basicdb document found for courseId:", courseId);
                  setRecognizedAs("DNA Certificate");
                }
              }
            } catch (error) {
              console.error("Error fetching cert_basicdb document: ", error);
              setRecognizedAs("DNA Certificate");
            } finally {
              setRecognizedAsLoading(false);
            }
          } else {
            console.log("No courseId provided");
            setRecognizedAsLoading(false);
          }
        };

        await fetchCertBasicData(courseId);
        
        // Check certificate status in cert_generate collection
        const certRef = collection(db, "cert_generate");
        const q = query(
          certRef, 
          where("uid", "==", currentUser.uid),
          where("courseId", "==", courseId)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const certDoc = querySnapshot.docs[0];
          const certDocData = certDoc.data();
          setCertData(certDocData);
          setCertDocId(certDoc.id); // Store the document ID
          
          // Check if admin approved the certificate
          if (certDocData.hasOwnProperty('isAdminApprove')) {
            setIsAdminApprove(certDocData.isAdminApprove);
          }

          // If certificate is rejected by admin, set status accordingly
          if (certDocData.hasOwnProperty('isAdminApprove') && !certDocData.isAdminApprove) {
            setCertStatus("rejected");
          } else {
            // Continue with existing logic for approved certificates
            // Check if certificate delivery time has passed
            const now = new Date();
            const deliveryTime = certDocData.CertDeliveryTime ? new Date(certDocData.CertDeliveryTime) : null;
            
            if (certDocData.cert_generated) {
              setCertStatus("generated");
            } else if (deliveryTime && now >= deliveryTime) {
              // If delivery time has passed, automatically mark as generated
              try {
                await updateDoc(doc(db, "cert_generate", certDoc.id), {
                  cert_generated: true
                });
                setCertStatus("generated");
                setCertData({...certDocData, cert_generated: true});
              } catch (error) {
                console.error("Error updating certificate status:", error);
                setCertStatus("pending");
              }
            } else {
              setCertStatus("pending");
              setCertReadyTime(deliveryTime);
            }
          }
        } else {
          setCertStatus("not_requested");
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setRecognizedAs("DNA Certificate");
        setRecognizedAsLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Check certificate status every minute
    const statusCheckInterval = setInterval(async () => {
      if (certStatus === "pending" && certDocId && certReadyTime) {
        const now = new Date();
        if (now >= certReadyTime) {
          try {
            await updateDoc(doc(db, "cert_generate", certDocId), {
              cert_generated: true
            });
            setCertStatus("generated");
            setCertData(prev => ({...prev, cert_generated: true}));
          } catch (error) {
            console.error("Error updating certificate status:", error);
          }
        }
      }
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(statusCheckInterval);
    };
  }, [currentUser, courseId, courseName, courseCategory, certStatus, certDocId, certReadyTime]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTitleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      title: value
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phoneNumber: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!currentUser || !courseId) {
        throw new Error("User or course information missing");
      }

      // Ensure recognizedAs is available
      if (!recognizedAs) {
        try {
          // Query the cert_basicdb to find document that matches the courseId
          const certBasicRef = collection(db, "cert_basicdb");
          const q = query(certBasicRef, where("courseId", "==", courseId));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const certBasicDoc = querySnapshot.docs[0];
            const data = certBasicDoc.data();
            if (data.recognizeAs) {
              setRecognizedAs(data.recognizeAs);
            } else {
              throw new Error("Recognized value is not available in the database");
            }
          } else {
            // Fallback to direct ID lookup
            const directRef = doc(db, "cert_basicdb", courseId);
            const directDoc = await getDoc(directRef);
            
            if (directDoc.exists()) {
              const data = directDoc.data();
              if (data.recognizeAs) {
                setRecognizedAs(data.recognizeAs);
              } else {
                throw new Error("Recognized value is not available in the database");
              }
            } else {
              throw new Error("Certificate basic data not found");
            }
          }
        } catch (error) {
          console.error("Error fetching recognizedAs:", error);
          throw new Error("Failed to get certificate recognition data");
        }
      }

      // Extract and properly capitalize first and last name
      const formattedName = capitalizeWords(formData.name.trim());
      const nameParts = formattedName.split(/\s+/);
      let firstName = "";
      let lastName = "";
      
      if (nameParts.length >= 2) {
        firstName = nameParts[0];
        lastName = nameParts[nameParts.length - 1];
      } else if (nameParts.length === 1) {
        firstName = nameParts[0];
        lastName = nameParts[0];
      }

      // Generate certificate number using our valid-words logic
      const certNumber = generateCertificateNumber(firstName, lastName, recognizedAs);
      
      // Get current timestamp
      const now = new Date();
      // Calculate delivery time (3 hours from now)
      const certDeliveryTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));

      const certData = {
        uid: currentUser.uid,
        courseId: courseId,
        title: formData.title,
        name: formattedName, // Store name with proper capitalization
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        courseName: formData.courseName,
        courseCategory: formData.courseCategory,
        requestedAt: now.toISOString(),
        CertDeliveryTime: certDeliveryTime.toISOString(), // Store certificate delivery time
        cert_generated: false,
        cert_URL: "",
        CertNumber: certNumber,
        CertThumb: certThumb,        // Store CertThumb from cert_basicdb
        recognizeAs: recognizedAs,   // Store recognizeAs from cert_basicdb
        isAdminApprove: true         // Default to approved, can be changed by admin later
      };

      // Create a new document in cert_generate collection
      const newCertRef = doc(collection(db, "cert_generate"));
      await setDoc(newCertRef, certData);

      setCertStatus("pending");
      setCertData(certData);
      setCertDocId(newCertRef.id); // Store the new document ID
      setCertReadyTime(certDeliveryTime);
      
      toast.success("Certificate request submitted successfully!");
    } catch (error) {
      console.error("Error requesting certificate:", error);
      toast.error("Error requesting certificate: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAndDownloadCertificate = async () => {
    if (!certData || !certDocId) return;
    
    // Disable the button immediately
    setIsDownloading(true);
    
    // Start with loading toast
    const toastId = toast.loading("Connecting to certificate server...");
    
    try {
      // Check if cert_URL already exists and is valid
      if (certData.cert_URL && typeof certData.cert_URL === 'string' && certData.cert_URL.startsWith('http') && !certData.cert_URL.includes('example.com')) {
        // Certificate URL already exists, update toast
        toast.loading("Certificate already generated, preparing download...", { id: toastId });
        
        // Just open the existing URL
        setTimeout(() => {
          window.open(certData.cert_URL, "_blank");
          toast.success("Certificate download initiated!", { id: toastId });
        }, 1000);
        
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
      root.render(<Certificate certData={certData} certDocId={certDocId} />);
      
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
      const fileRef = storageRef(storage, `certificates/${certDocId}_${Date.now()}.pdf`);
      const uploadTask = await uploadBytes(fileRef, pdfBlob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      // Update Firestore with the real URL
      await updateDoc(doc(db, "cert_generate", certDocId), {
        cert_generated: true,
        cert_URL: downloadURL
      });
      
      // Update local state
      setCertData(prev => ({...prev, cert_generated: true, cert_URL: downloadURL}));
      
      // Clean up temporary container
      document.body.removeChild(tempContainer);
      
      // Success toast
      toast.success("Certificate generated successfully!", { id: toastId });
      
      // Open the certificate in a new tab
      window.open(downloadURL, "_blank");
      
    } catch (error) {
      console.error("Error Downloading certificate:", error);
      toast.error("Error Downloading certificate: " + error.message, { id: toastId });
    } finally {
      // Re-enable the button after processing is complete
      setIsDownloading(false);
    }
  };

  // Format the ready time for display
  const formatReadyTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           " on " + 
           date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
      <Toaster position="top-center" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Course Certificate
      </h2>

      {/* Show rejection message when isAdminApprove is false */}
      {certStatus === "rejected" && (
        <div className="text-center p-8 border rounded-lg bg-red-50 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Certificate Request was Rejected</h3>
            <p className="text-gray-600 mb-4">
              Please contact us for further information.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
            </Button>
          </div>
        </div>
      )}

      {/* Show request form if status is not_requested and certificate is not rejected */}
      {certStatus === "not_requested" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-medium text-gray-700">Title</Label>
            <Select value={formData.title} onValueChange={handleTitleChange} disabled>
              <SelectTrigger className="w-full opacity-50 cursor-not-allowed">
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr.">Mr.</SelectItem>
                <SelectItem value="Mrs.">Mrs.</SelectItem>
                <SelectItem value="Ms.">Ms.</SelectItem>
                <SelectItem value="Dr.">Dr.</SelectItem>
                <SelectItem value="Prof.">Prof.</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">This title will appear on your certificate.</p>
          </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium text-gray-700">Full Name*</Label>
              <Input
                id="name"
                name="name"
                readOnly
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
              <p className="text-xs text-gray-500">This name will appear on your certificate.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium text-gray-700">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                readOnly
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              <p className="text-xs text-gray-500">We'll send a copy of your certificate to this email.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="font-medium text-gray-700">Mobile Number*</Label>
              <div className="relative flex items-center bg-white rounded-md shadow-sm ring-1 ring-gray-300 focus-within:ring-1 focus-within:ring-gray-900 px-3 py-2 h-10">
                <PhoneInput
                  international
                  countryCallingCodeEditable={true}
                  defaultCountry="IN"
                  className="w-full bg-transparent focus:ring-0 outline-none text-gray-900 text-sm px-3 py-[10px]"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  required
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500">Please provide a valid phone number to keep your account safe and secure.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseName" className="font-medium text-gray-700">Course Name</Label>
              <Input
                id="courseName"
                name="courseName"
                value={formData.courseName}
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">This course name will appear on your certificate.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseCategory" className="font-medium text-gray-700">Course Category</Label>
              <Input
                id="courseCategory"
                name="courseCategory"
                value={formData.courseCategory}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
              disabled={isSubmitting || recognizedAsLoading}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  Request Certificate
                  <ChevronRightIcon size={16} className="ml-1" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Show pending status only if not rejected */}
      {certStatus === "pending" && isAdminApprove && (
        <div className="text-center p-8 border rounded-lg bg-blue-50 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4">
              <img src="https://ik.imagekit.io/growthx100/icon(6).svg" alt="Certificate" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Certificate is Under Verification</h3>
            <p className="text-gray-600 mb-4">
              Our team is verifying your certificate details. 
              Your certificate will be available within 24 hours.
            </p>
            {certReadyTime && (
              <p className="text-sm text-blue-700">
                Expected availability: {formatReadyTime(certReadyTime)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Show download button only if generated and approved */}
      {certStatus === "generated" && isAdminApprove && certData && (
        <div className="text-center p-8 border rounded-lg bg-green-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4">
              <img src="https://ik.imagekit.io/growthx100/icon(6).svg" alt="Certificate" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Certificate is Ready!</h3>
            <p className="text-gray-600 mb-4">Congratulations on completing the course! Click the button below to generate and download your certificate.</p>
            <Button 
              onClick={generateAndDownloadCertificate}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {certData.cert_URL ? "Downloading..." : "Downloading..."}
                </>
              ) : (
                <>
                  Download Certificate
                  <DownloadIcon size={16} className="ml-1" />
                </>
              )}
            </Button>
          </div>  
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;