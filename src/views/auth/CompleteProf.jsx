import { Fragment, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getDatabase, ref, get, update } from "firebase/database";
import PhoneInput from 'react-phone-number-input'; // Make sure to import this
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Footer from "../../components/footer";
import Header from "../../components/header";
import 'react-phone-number-input/style.css'; // Import phone input styles
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

const CompleteProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);

    // Form fields
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');

    const [dateOfBirth, setDateOfBirth] = useState('');
    const [linkedinProfile, setLinkedinProfile] = useState('');
    const [education, setEducation] = useState('');
    const [experience, setExperience] = useState('');
    const [industry, setIndustry] = useState('');
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
                console.log("Profile to complete:", profileUserId);

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

                // Now fetch the user data for the profile to be completed
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
                    console.log("Registration complete status:", data.registrationComplete);

                    // Only redirect if registration is explicitly true
                    if (data.registrationComplete === true) {
                        console.log("Registration is complete, redirecting to student dashboard");
                        navigate('/student/default', { replace: true });
                        return;
                    }

                    // Pre-fill form fields if data exists
                    setFirstName(data.firstName || '');
                    setLastName(data.lastName || '');
                    setTitle(data.title || '');
                    setPhoneNumber(data.phoneNumber || '');
                    setGender(data.gender || '');
                    setDateOfBirth(data.dateOfBirth || '');
                    setLinkedinProfile(data.linkedinProfile || '');
                    setEducation(data.education || '');
                    setExperience(data.experience || '');
                    setIndustry(data.industry || '');
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

    const handleFormSubmit = async () => {
        // Basic validation
        if (!title || !firstName || !lastName || !phoneNumber || !gender || !dateOfBirth || !education || !experience || !industry || !learningOutcome) {
            if (!phoneNumber) {
                toast.error("Please provide a valid mobile number");
            } else {
                toast.error("Please fill in all required fields");
            }
            return;
        }
        

        setLoading(true);
        try {
            const database = getDatabase();
            // Get the current user to determine which profile to update
            const currentUser = auth.currentUser;
            // If userId param is provided, use it; otherwise use current user's ID
            const profileToUpdate = userId || currentUser.uid;

            const userRef = ref(database, `users/${profileToUpdate}`);

            const updatedData = {
                title,
                firstName,
                lastName,
                phoneNumber,
                gender,
                dateOfBirth,
                linkedinProfile,
                education,
                experience,
                industry,
                learningOutcome,
                registrationComplete: true, // Mark registration as complete
                updatedAt: new Date().toISOString()
            };

            console.log("Updating user profile with data:", updatedData);

            await update(userRef, updatedData);

            toast.success("Profile completed successfully!");
            console.log("Profile updated, redirecting to student dashboard");
            // Use replace to prevent back navigation to this form
            navigate('/student/default', { replace: true });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep === 1) {
            // Validate first step
            if (!title || !firstName || !lastName || !phoneNumber || !gender || !dateOfBirth) {
                toast.error("Please fill in all required fields");
                return;
            }
        } else if (currentStep === 2) {
            // Validate second step
            if (!education || !experience || !industry) {
                toast.error("Please fill in all required fields");
                return;
            }
        }

        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    // Calculate progress percentage
    const getProgress = () => {
        return (currentStep / 3) * 100;
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

    if (initialLoading) {
        return (
            <Fragment>
                <Header />
                <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 mx-auto text-blue-600 animate-spin" />
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
            <Toaster position="top-right" />

            <div className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left sidebar */}
                        <div className="md:col-span-1 pt-24">
                            <div className="sticky top-24">
                                <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-2">Profile completion</p>
                                    <Progress value={getProgress()} className="h-2" />
                                </div>

                                <div className="space-y-3">
                                    <div
                                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentStep === 1 ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
                                        onClick={() => setCurrentStep(1)}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                            {currentStep > 1 ? '✓' : '1'}
                                        </div>
                                        <div>
                                            <p className="font-medium">Demographic Details</p>
                                            <p className="text-xs text-gray-500">Personal information</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentStep === 2 ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
                                        onClick={() => currentStep > 1 ? setCurrentStep(2) : null}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                            {currentStep > 2 ? '✓' : '2'}
                                        </div>
                                        <div>
                                            <p className="font-medium">Academic & Professional</p>
                                            <p className="text-xs text-gray-500">Education and work experience</p>
                                        </div>
                                    </div>

                                    <div
                                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer ${currentStep === 3 ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-100'}`}
                                        onClick={() => currentStep > 2 ? setCurrentStep(3) : null}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                            3
                                        </div>
                                        <div>
                                            <p className="font-medium">Learning Outcome</p>
                                            <p className="text-xs text-gray-500">Your goals and objectives</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form content */}
                        <div className="md:col-span-2 pt-28">
                            <Card className="shadow-md border-0">
                                <CardContent className="p-6">
                                    <AnimatePresence mode="wait">
                                        {currentStep === 1 && (
                                            <motion.div
                                                key="step1"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h2 className="text-xl font-bold">Demographic Details</h2>
                                                    <p className="text-sm text-gray-500">Step 1 of 3</p>
                                                </div>

                                                <div className="space-y-4"> 
                                                <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col space-y-2">
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

        <div className="flex flex-col space-y-2">
            <Label htmlFor="firstName">First name*</Label>
            <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
        </div>

        <div className="flex flex-col space-y-2">
            <Label htmlFor="lastName">Last name*</Label>
            <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
        </div>
    </div>
    <p className="text-xs text-gray-500">The name you enter will be used for communications and certificates (if applicable).</p>
</div>




<div className="grid grid-cols-3 gap-4">
    {/* Mobile Number */}
    <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="font-medium text-gray-700">Mobile Number*</Label>
        <div className="relative flex items-center bg-white rounded-md shadow-sm ring-1 ring-gray-300 focus-within:ring-1 focus-within:ring-gray-900 px-3 py-2 h-10">
            <PhoneInput
                international
                countryCallingCodeEditable={true}
                defaultCountry="IN"
                className="w-full bg-transparent focus:ring-0 outline-none text-gray-900 text-sm px-3 py-[10px]"
                value={phoneNumber}
                onChange={setPhoneNumber}
                required
                disabled={loading}
            />
        </div>
        <p className="text-xs text-gray-500">Please provide a valid phone number to keep your account safe and secure.</p>
    </div>

    {/* Gender */}
    <div className="space-y-2">
        <Label htmlFor="gender" className="font-medium text-gray-700">Gender*</Label>
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

    {/* Date of Birth */}
    <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="font-medium text-gray-700">Date of birth*</Label>
        <Input
            id="dateOfBirth"
            type="date"
            className="w-full rounded-md shadow-sm ring-1 ring-gray-300 focus:ring-1 focus:ring-gray-900 px-3 py-2"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
        />
    </div>
</div><div className="space-y-2">
                                                        <Label htmlFor="linkedinProfile">LinkedIn profile (optional)</Label>
                                                        <Input
                                                            id="linkedinProfile"
                                                            type="url"
                                                            placeholder="https://linkedin.com/in/yourprofile"
                                                            value={linkedinProfile}
                                                            onChange={(e) => setLinkedinProfile(e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <Button
                                                        onClick={nextStep}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        Continue
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {currentStep === 2 && (
                                            <motion.div
                                                key="step2"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h2 className="text-xl font-bold">Academic & Professional Details</h2>
                                                    <p className="text-sm text-gray-500">Step 2 of 3</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="education">Highest level of education*</Label>
                                                        <Select value={education} onValueChange={setEducation} required>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="High school">High school</SelectItem>
                                                                <SelectItem value="Diploma / Secondary School Certificate">Diploma / Secondary School Certificate</SelectItem>
                                                                <SelectItem value="Associate's Degree / Diploma">Associate's Degree / Diploma</SelectItem>
                                                                <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                                                <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                                                <SelectItem value="Doctorate (PhD) / Professional Degree (MD, JD etc)">Doctorate (PhD) / Professional Degree (MD, JD etc)</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="experience">Professional experience*</Label>
                                                        <Select value={experience} onValueChange={setExperience} required>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="No experience">No experience</SelectItem>
                                                                <SelectItem value="0-1 years">0-1 years</SelectItem>
                                                                <SelectItem value="1-3 years">1-3 years</SelectItem>
                                                                <SelectItem value="3-5 years">3-5 years</SelectItem>
                                                                <SelectItem value="5-8 years">5-8 years</SelectItem>
                                                                <SelectItem value="8-15 years">8-15 years</SelectItem>
                                                                <SelectItem value="I am still studying">I am still studying</SelectItem>
                                                                <SelectItem value="15+ years">15+ years</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="industry">Industry*</Label>
                                                        <Select value={industry} onValueChange={setIndustry} required>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Banking/Financial Services">Banking/Financial Services</SelectItem>
                                                                <SelectItem value="Aviation/Aerospace">Aviation/Aerospace</SelectItem>
                                                                <SelectItem value="Healthcare/Pharmaceuticals">Healthcare/Pharmaceuticals</SelectItem>
                                                                <SelectItem value="Entertainment/Media">Entertainment/Media</SelectItem>
                                                                <SelectItem value="Fashion/Apparel">Fashion/Apparel</SelectItem>
                                                                <SelectItem value="Automotive">Automotive</SelectItem>
                                                                <SelectItem value="Information Technology/Software">Information Technology/Software</SelectItem>                                                                <SelectItem value="Consumer Goods">Consumer Goods</SelectItem>
                                                                <SelectItem value="Education/E-learning">Education/E-learning</SelectItem>
                                                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                                <SelectItem value="Energy/Utilities">Energy/Utilities</SelectItem>
                                                                <SelectItem value="Agriculture">Agriculture</SelectItem>
                                                                <SelectItem value="Government/Public Sector">Government/Public Sector</SelectItem>
                                                                <SelectItem value="Hospitality/Tourism">Hospitality/Tourism</SelectItem>
                                                                <SelectItem value="Insurance">Insurance</SelectItem>
                                                                <SelectItem value="Transportation/Logistics">Transportation/Logistics</SelectItem>
                                                                <SelectItem value="Media & Advertising">Media & Advertising</SelectItem>
                                                                <SelectItem value="Mining/Metals">Mining/Metals</SelectItem>
                                                                <SelectItem value="Non-Profit/NGO">Non-Profit/NGO</SelectItem>
                                                                <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                                                                <SelectItem value="Real Estate">Real Estate</SelectItem>
                                                                <SelectItem value="Retail">Retail</SelectItem>
                                                                <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                                                                <SelectItem value="Construction">Construction</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between">
                                                    <Button
                                                        onClick={prevStep}
                                                        className="bg-gray-400 hover:bg-gray-500"
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        onClick={nextStep}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        Continue
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {currentStep === 3 && (
                                            <motion.div
                                                key="step3"
                                                initial="initial"
                                                animate="in"
                                                exit="out"
                                                variants={pageVariants}
                                                transition={pageTransition}
                                                className="space-y-6"
                                            >
                                                <div>
                                                    <h2 className="text-xl font-bold">Learning Outcome</h2>
                                                    <p className="text-sm text-gray-500">Step 3 of 3</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="learningOutcome">What is your desired learning outcome?*</Label>
                                                        <Select value={learningOutcome} onValueChange={setLearningOutcome} required>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Skill Enhancement">Skill Enhancement</SelectItem>
                                                                <SelectItem value="Obtaining a certificate">Obtaining a certificate</SelectItem>
                                                                <SelectItem value="Career Advancement (Pay Raise or Promotion)">Career Advancement (Pay Raise or Promotion)</SelectItem>
                                                                <SelectItem value="Start a New Career or Shift Career">Start a New Career or Shift Career</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between">
                                                    <Button
                                                        onClick={prevStep}
                                                        className="bg-gray-400 hover:bg-gray-500"
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        onClick={handleFormSubmit}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <Loader2 className="h-5 w-5 mx-auto text-white animate-spin" />
                                                        ) : (
                                                            <span>Complete Registration</span>
                                                        )}
                                                    </Button>
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

export default CompleteProfilePage;