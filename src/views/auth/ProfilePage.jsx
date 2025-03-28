import { Fragment, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDatabase, ref, get, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';
import Footer from "../../components/footer";
import Header from "../../components/header";
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../firebase.config";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const [currentSection, setCurrentSection] = useState(1);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Basic details
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [linkedinProfile, setLinkedinProfile] = useState('');
    const [trainingFund, setTrainingFund] = useState('Self');

    // Contact details
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');

    // Professional details
    const [experience, setExperience] = useState('');
    const [industry, setIndustry] = useState('');

    // Academic details
    const [education, setEducation] = useState('');

    // Learning outcome
    const [learningOutcome, setLearningOutcome] = useState('');

    useEffect(() => {
        // Verify user authentication
        const verifyAuth = async () => {
            try {
                // Wait for auth state to be ready
                const currentUser = await new Promise((resolve) => {
                    const unsubscribe = auth.onAuthStateChanged((user) => {
                        unsubscribe();
                        resolve(user);
                    });
                });
                
                if (!currentUser) {
                    console.log("User not authenticated, redirecting to login");
                    navigate('/login', { replace: true });
                    return;
                }
                
                console.log("Current user ID:", currentUser.uid);
                
                // If userId param is not provided, use the current user's ID
                const profileUserId = userId || currentUser.uid;
                console.log("Profile to view/edit:", profileUserId);
                
                // If viewing someone else's profile, check if admin
                if (profileUserId !== currentUser.uid) {
                    console.log("User ID mismatch, checking if admin");
                    const database = getDatabase();
                    const userRef = ref(database, `users/${currentUser.uid}`);
                    const snapshot = await get(userRef);
                    
                    if (snapshot.exists()) {
                        const currentUserData = snapshot.val();
                        console.log("Current user role:", currentUserData.role);
                        if (currentUserData.role !== 'Admin') {
                            console.log("Unauthorized access (not admin), redirecting to dashboard");
                            navigate('/student/default', { replace: true });
                            return;
                        } else {
                            console.log("Admin access granted");
                        }
                    } else {
                        console.log("Current user data not found, redirecting");
                        navigate('/login', { replace: true });
                        return;
                    }
                }
                
                // Now fetch the user data for the profile
                await fetchUserData(profileUserId);
            } catch (error) {
                console.error("Auth verification error:", error);
                navigate('/login', { replace: true });
            }
        };
        
        // Function to fetch user data
        const fetchUserData = async (userIdToFetch) => {
            if (!userIdToFetch) {
                console.log("No user ID provided");
                setInitialLoading(false);
                return;
            }
            
            try {
                const database = getDatabase();
                const userRef = ref(database, `users/${userIdToFetch}`);
                const snapshot = await get(userRef);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setUserData(data);
                    console.log("Fetched user data:", data);

                    // Pre-fill form fields with existing data
                    // Basic details
                    setTitle(data.title || '');
                    setFirstName(data.firstName || '');
                    setLastName(data.lastName || '');
                    setGender(data.gender || '');
                    setDateOfBirth(data.dateOfBirth || '');
                    setProfilePicture(data.profilePicture || '');
                    setLinkedinProfile(data.linkedinProfile || '');
                    setTrainingFund(data.trainingFund || 'Self');
                    
                    // Contact details
                    setEmail(data.email || '');
                    setContactNumber(data.contactNumber || '');
                    setCountry(data.country || '');
                    setState(data.state || '');
                    setCity(data.city || '');
                    setAddress(data.address || '');
                    
                    // Professional details
                    setExperience(data.experience || '');
                    setIndustry(data.industry || '');
                    
                    // Academic details
                    setEducation(data.education || '');
                    
                    // Learning outcome
                    setLearningOutcome(data.learningOutcome || '');
                } else {
                    console.log("No user data found for ID:", userIdToFetch);
                    toast.error("User profile not found");
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to load user data");
            } finally {
                setInitialLoading(false);
            }
        };
        
        verifyAuth();
    }, [userId, navigate]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploadingImage(true);
        try {
            const storage = getStorage();
            const fileRef = storageRef(storage, `profile-pictures/${userId || auth.currentUser.uid}/${Date.now()}_${file.name}`);
            
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            
            setProfilePicture(downloadURL);
            toast.success("Profile picture uploaded successfully");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSaveChanges = async () => {
        // Basic validation based on current section
        if (currentSection === 1) {
            if (!title || !firstName || !lastName || !gender || !dateOfBirth || !trainingFund) {
                toast.error("Please fill in all required fields in Basic Details");
                return;
            }
        } else if (currentSection === 2) {
            if (!email || !contactNumber || !country) {
                toast.error("Please fill in all required fields in Contact Details");
                return;
            }
        } else if (currentSection === 3) {
            if (!experience) {
                toast.error("Please fill in all required fields in Professional Details");
                return;
            }
        } else if (currentSection === 4) {
            if (!education) {
                toast.error("Please fill in all required fields in Academic Details");
                return;
            }
        } else if (currentSection === 5) {
            if (!learningOutcome) {
                toast.error("Please fill in all4 required fields in Learning Outcome");
                return;
            }
        }
        
        setSaveLoading(true);
        try {
            const database = getDatabase();
            // Get the current user to determine which profile to update
            const currentUser = auth.currentUser;
            // If userId param is provided, use it; otherwise use current user's ID
            const profileToUpdate = userId || currentUser.uid;
            
            const userRef = ref(database, `users/${profileToUpdate}`);
            
            const updatedData = {
                // Basic details
                title,
                firstName,
                lastName,
                gender,
                dateOfBirth,
                profilePicture,
                linkedinProfile,
                trainingFund,
                
                // Contact details
                email,
                contactNumber,
                country,
                state,
                city,
                address,
                
                // Professional details
                experience,
                industry,
                
                // Academic details
                education,
                
                // Learning outcome
                learningOutcome,
                
                // Metadata
                updatedAt: new Date().toISOString()
            };
            
            console.log("Updating user profile with data:", updatedData);
            
            await update(userRef, updatedData);
            
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile: " + error.message);
        } finally { 
            setSaveLoading(false);
        }
    };

    const nextSection = () => {
        if (currentSection < 5) {
            setCurrentSection(currentSection + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevSection = () => {
        if (currentSection > 1) {
            setCurrentSection(currentSection - 1);
            window.scrollTo(0, 0);
        }
    };

    // Calculate progress percentage
    const getProgress = () => {
        return (currentSection / 5) * 100;
    };

    // Page transitions
    const pageVariants = {
        initial: { opacity: 0, x: 100 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -100 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.5
    };

    // List of countries for dropdown
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
        "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
        "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
        "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", 
        "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", 
        "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", 
        "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", 
        "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", 
        "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
        "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
        "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", 
        "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
        "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", 
        "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", 
        "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
        "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
        "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", 
        "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", 
        "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", 
        "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    if (initialLoading) {
        return (
            <Fragment>
                <Header />
                <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
                    <div className="text-center">
                        <svg className="animate-spin h-12 w-12 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <p className="mt-4 text-lg">Loading your profile...</p>
                    </div>
                </div>
                <Footer />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Header />
            
            <div className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left sidebar */}
                        <div className="md:col-span-1 pt-24">
                            <div className="sticky top-24">
                                <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
                                
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-2">Profile section</p>
                                    <Progress value={getProgress()} className="h-2" />
                                </div>
                                
                                <div className="space-y-3">
                                    <div 
                                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentSection === 1 ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
                                        onClick={() => setCurrentSection(1)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentSection >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                            1
                                        </div>
                                        <div>
                                            <p className="font-medium">Basic Details</p>
                                            <p className="text-xs text-gray-500">Personal information</p>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentSection === 2 ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
                                        onClick={() => setCurrentSection(2)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentSection >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                            2
                                        </div>
                                        <div>
                                            <p className="font-medium">Contact Details</p>
                                            <p className="text-xs text-gray-500">How to reach you</p>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentSection === 3 ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
                                        onClick={() => setCurrentSection(3)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentSection >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                            3
                                        </div>
                                        <div>
                                            <p className="font-medium">Professional Details</p>
                                            <p className="text-xs text-gray-500">Work experience</p>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentSection === 4 ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
                                        onClick={() => setCurrentSection(4)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentSection >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                            4
                                        </div>
                                        <div>
                                            <p className="font-medium">Academic Details</p>
                                            <p className="text-xs text-gray-500">Education information</p>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentSection === 5 ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
                                        onClick={() => setCurrentSection(5)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentSection >= 5 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                            5
                                        </div>
                                        <div>
                                            <p className="font-medium">Learning Outcome</p>
                                            <p className="text-xs text-gray-500">Your goals and objectives</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Last updated information */}
                                {userData && userData.updatedAt && (
                                    <div className="mt-6 text-xs text-gray-500">
                                        Last updated: {new Date(userData.updatedAt).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Form content */}
                        <div className="md:col-span-2 pt-28">
                            <Card className="shadow-md border-0">
                                <CardContent className="p-6">
                                    <AnimatePresence mode="wait">
                                        {/* Section 1: Basic Details */}
                                        {currentSection === 1 && (
                                            <motion.div
                                                key="section1"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h2 className="text-xl font-bold">Basic Details</h2>
                                                    <p className="text-sm text-gray-500">Your personal information</p>
                                                </div>
                                                
                                                <div className="space-y-6">
                                                    {/* Profile picture */}
                                                    <div className="flex items-center space-x-4">
                                                        <Avatar className="h-20 w-20">
                                                            {profilePicture ? (
                                                                <AvatarImage src={profilePicture} alt="Profile" />
                                                            ) : (
                                                                <AvatarFallback>
                                                                    {firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'User'}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="profilePicture">Upload your picture*</Label>
                                                            <Input
                                                                id="profilePicture"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                disabled={uploadingImage}
                                                            />
                                                            {uploadingImage && (
                                                                <p className="text-xs text-blue-600">Uploading image...</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="title">Title*</Label>
                                                        <Select value={title} onValueChange={setTitle} required>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
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
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="firstName">First name*</Label>
                                                            <Input
                                                                id="firstName"
                                                                value={firstName}
                                                                onChange={(e) => setFirstName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="lastName">Last name*</Label>
                                                            <Input
                                                                id="lastName"
                                                                value={lastName}
                                                                onChange={(e) => setLastName(e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="gender">Gender*</Label>
                                                        <Select value={gender} onValueChange={setGender} required>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Female">Female</SelectItem>
                                                                <SelectItem value="Male">Male</SelectItem>
                                                                <SelectItem value="Non binary">Non binary</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="dateOfBirth">Date of birth*</Label>
                                                        <Input
                                                            id="dateOfBirth"
                                                            type="date"
                                                            value={dateOfBirth}
                                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="linkedinProfile">LinkedIn profile link (optional)</Label>
                                                        <Input
                                                            id="linkedinProfile"
                                                            type="url"
                                                            placeholder="https://linkedin.com/in/yourprofile"
                                                            value={linkedinProfile}
                                                            onChange={(e) => setLinkedinProfile(e.target.value)}
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label>How is your training funded?*</Label>
                                                        <RadioGroup value={trainingFund} onValueChange={setTrainingFund} className="flex space-x-4">
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="Self" id="self" />
                                                                <Label htmlFor="self">Self</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="Organisation" id="organisation" />
                                                                <Label htmlFor="organisation">Organisation</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between">
                                                    <div></div>
                                                    <div className="space-x-2">
                                                        <Button 
                                                            onClick={handleSaveChanges} 
                                                            className="bg-green-600 hover:bg-green-700"
                                                            disabled={saveLoading}
                                                        >
                                                            {saveLoading ? (
                                                                <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                                </svg>
                                                            ) : (
                                                                <span>Save Changes</span>
                                                            )}
                                                        </Button>
                                                        <Button 
                                                            onClick={nextSection} 
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        
                                        {/* Section 2: Contact Details */}
                                        {currentSection === 2 && (
                                            <motion.div
                                                key="section2"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h2 className="text-xl font-bold">Contact Details</h2>
                                                    <p className="text-sm text-gray-500">Your contact information</p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">Email*</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="contactNumber">Contact number*</Label>
                                                        <Input
                                                            id="contactNumber"
                                                            type="tel"
                                                            value={contactNumber}
                                                            onChange={(e) => setContactNumber(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="country">Country of residence*</Label>
                                                        <Select value={country} onValueChange={setCountry} required>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your country" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {countries.map((countryName) => (
                                                                    <SelectItem key={countryName} value={countryName}>
                                                                        {countryName}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="state">State</Label>
                                                            <Input
                                                                id="state"
                                                                value={state}
                                                                onChange={(e) => setState(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="city">City</Label>
                                                            <Input
                                                                id="city"
                                                                value={city}
                                                                onChange={(e) => setCity(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="address">Correspondence address</Label>
                                                        <Textarea
                                                            id="address"
                                                            value={address}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between">
                                                    <Button 
                                                        onClick={prevSection} 
                                                        className="bg-gray-500 hover:bg-gray-600"
                                                    >
                                                        Previous
                                                    </Button>
                                                    <div className="space-x-2">
                                                        <Button 
                                                            onClick={handleSaveChanges} 
                                                            className="bg-green-600 hover:bg-green-700"
                                                            disabled={saveLoading}
                                                        >
                                                            {saveLoading ? (
                                                                <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                                </svg>
                                                            ) : (
                                                                <span>Save Changes</span>
                                                            )}
                                                        </Button>
                                                        <Button 
                                                            onClick={nextSection} 
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                                                                {/* Section 3: Professional Details */}
                                                                                {currentSection === 3 && (
                                            <motion.div
                                                key="section3"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h2 className="text-xl font-bold">Professional Details</h2>
                                                    <p className="text-sm text-gray-500">Your work experience</p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="experience">Total years of experience*</Label>
                                                        <Input
                                                            id="experience"
                                                            type="number"
                                                            value={experience}
                                                            onChange={(e) => setExperience(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <Label htmlFor="industry">Industry (optional)</Label>
                                                        <Input
                                                            id="industry"
                                                            value={industry}
                                                            onChange={(e) => setIndustry(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between">
                                                    <Button 
                                                        onClick={prevSection} 
                                                        className="bg-gray-500 hover:bg-gray-600"
                                                    >
                                                        Previous
                                                    </Button>
                                                    <div className="space-x-2">
                                                        <Button 
                                                            onClick={handleSaveChanges} 
                                                            className="bg-green-600 hover:bg-green-700"
                                                            disabled={saveLoading}
                                                        >
                                                            {saveLoading ? (
                                                                <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                                </svg>
                                                            ) : (
                                                                <span>Save Changes</span>
                                                            )}
                                                        </Button>
                                                        <Button 
                                                            onClick={nextSection} 
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                                                                {/* Section 4: Academic Details */}
                                                                                {currentSection === 4 && (
                                            <motion.div
                                                key="section4"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h2 className="text-xl font-bold">Academic Details</h2>
                                                    <p className="text-sm text-gray-500">Your education information</p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="education">Highest level of education*</Label>
                                                        <Select value={education} onValueChange={setEducation} required>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="High School">High School</SelectItem>
                                                                <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                                                <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                                                <SelectItem value="PhD">PhD</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between">
                                                    <Button 
                                                        onClick={prevSection} 
                                                        className="bg-gray-500 hover:bg-gray-600"
                                                    >
                                                        Previous
                                                    </Button>
                                                    <div className="space-x-2">
                                                        <Button 
                                                            onClick={handleSaveChanges} 
                                                            className="bg-green-600 hover:bg-green-700"
                                                            disabled={saveLoading}
                                                        >
                                                            {saveLoading ? (
                                                                <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                                </svg>
                                                            ) : (
                                                                <span>Save Changes</span>
                                                            )}
                                                        </Button>
                                                        <Button 
                                                            onClick={nextSection} 
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                                                                {/* Section 5: Learning Outcome */}
                                                                                {currentSection === 5 && (
                                            <motion.div
                                                key="section5"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h2 className="text-xl font-bold">Learning Outcome</h2>
                                                    <p className="text-sm text-gray-500">Your goals and objectives</p>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="learningOutcome">What is your desired learning outcome?*</Label>
                                                        <Textarea
                                                            id="learningOutcome"
                                                            value={learningOutcome}
                                                            onChange={(e) => setLearningOutcome(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between">
                                                    <Button 
                                                        onClick={prevSection} 
                                                        className="bg-gray-500 hover:bg-gray-600"
                                                    >
                                                        Previous
                                                    </Button>
                                                    <div className="space-x-2">
                                                        <Button 
                                                            onClick={handleSaveChanges} 
                                                            className="bg-green-600 hover:bg-green-700"
                                                            disabled={saveLoading}
                                                        >
                                                            {saveLoading ? (
                                                                <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                                </svg>
                                                            ) : (
                                                                <span>Save Changes</span>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </Fragment>
    );
};

export default ProfilePage;