import React, { useState, useEffect } from "react";
import { useAuth } from "@/auth/hooks/useauth";
import { db } from "@/firebase.config";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";
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
  
  // Note: The certificate number is formatted as:
  // "DATA / <recognizedAsPrefix>-<recognizedAsSuffix> / <firstNamePrefix><lastNamePrefix>-<dateFormatted> / DATA"
  // With our swap, if recognized is "DNA Certificate", this produces "DATA / CER-DNA / ..."  
  return `DATA / ${recognizedAsPrefix}-${recognizedAsSuffix} / ${firstNamePrefix}${lastNamePrefix}-${dateFormatted} / DATA`;
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
  const [loading, setLoading] = useState(true);
  const [recognizedAs, setRecognizedAs] = useState("");
  const [certThumb, setCertThumb] = useState("");
  const [recognizedAsLoading, setRecognizedAsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentUser) return;
        
        // Fetch user data from Firebase Realtime Database
        const database = getDatabase();
        const userRef = ref(database, `users/${currentUser.uid}`);
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
              const certBasicRef = doc(db, "cert_basicdb", courseId);
              const certBasicDoc = await getDoc(certBasicRef);
        
              if (certBasicDoc.exists()) {
                const data = certBasicDoc.data();
                // Use fallback "DNA Certificate" if recognizeAs isn't provided
                setRecognizedAs(data.recognizeAs || "DNA Certificate");
                setCertThumb(data.CertThumb || "");
                console.log("Recognized As:", data.recognizeAs);
                console.log("Cert Thumb:", data.CertThumb);
              } else {
                console.log("No cert_basicdb document found for courseId:", courseId);
                setRecognizedAs("DNA Certificate");
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
          setCertData(certDoc.data());
          setCertStatus(certDoc.data().cert_generated ? "generated" : "pending");
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
  }, [currentUser, courseId, courseName, courseCategory]);

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
          const certBasicRef = doc(db, "cert_basicdb", courseId);
          const certBasicDoc = await getDoc(certBasicRef);
          if (certBasicDoc.exists()) {
            const data = certBasicDoc.data();
            if (data.recognizeAs) {
              setRecognizedAs(data.recognizeAs);
            } else {
              throw new Error("Recognized value is not available in the database");
            }
          } else {
            throw new Error("Certificate basic data not found");
          }
        } catch (error) {
          console.error("Error fetching recognizedAs:", error);
          throw new Error("Failed to get certificate recognition data");
        }
      }

      // Extract first and last name
      let firstName = "";
      let lastName = "";
      const nameParts = formData.name.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        firstName = nameParts[0];
        lastName = nameParts[nameParts.length - 1];
      } else if (nameParts.length === 1) {
        firstName = nameParts[0];
        lastName = nameParts[0];
      }

      // Generate certificate number using our valid-words logic
      const certNumber = generateCertificateNumber(firstName, lastName, recognizedAs);

      const certData = {
        uid: currentUser.uid,
        courseId: courseId,
        title: formData.title,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        courseName: formData.courseName,
        courseCategory: formData.courseCategory,
        requestedAt: new Date().toISOString(),
        cert_generated: false,
        cert_URL: "",
        CertNumber: certNumber,
        CertThumb: certThumb
      };

      // Create a new document in cert_generate collection
      const certRef = doc(collection(db, "cert_generate"));
      await setDoc(certRef, certData);

      setCertStatus("pending");
      setCertData(certData);
    } catch (error) {
      console.error("Error requesting certificate:", error);
      alert("Error requesting certificate: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadCertificate = () => {
    if (certData && certData.cert_URL) {
      window.open(certData.cert_URL, "_blank");
    }
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Course Certificate
      </h2>

      {certStatus === "not_requested" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium text-gray-700">Title</Label>
              <Select value={formData.title} onValueChange={handleTitleChange}>
                <SelectTrigger className="w-full">
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

      {certStatus === "pending" && (
        <div className="text-center p-8 border rounded-lg bg-blue-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4">
              <img src="https://ik.imagekit.io/growthx100/icon(6).svg" alt="Certificate" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Certificate is Being Processed</h3>
            <p className="text-gray-600 mb-4">Your certificate will be available within 24 hours after verification.</p>
            <div className="bg-yellow-100 p-4 rounded-lg text-yellow-800">
              <p>Please check back later to download your certificate.</p>
            </div>
          </div>
        </div>
      )}

      {certStatus === "generated" && certData && (
        <div className="text-center p-8 border rounded-lg bg-green-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4">
              <img src="https://ik.imagekit.io/growthx100/icon(6).svg" alt="Certificate" className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Certificate is Ready!</h3>
            <p className="text-gray-600 mb-4">Congratulations on completing the course! Your certificate is now available to download.</p>
            <Button 
              onClick={downloadCertificate}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center"
            >
              Download Certificate
              <DownloadIcon size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;
