import { Fragment, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { auth } from "../../firebase.config";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from "firebase/auth";
import toast, { Toaster } from 'react-hot-toast';
import { getDatabase, ref, set, get, update } from "firebase/database";
import { updateProfile } from "firebase/auth";
import logo from "../../assets/images/logo/01.png";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const SignupPage = () => {
    const [loading, setLoading] = useState(false);
    
    // Basic registration data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const navigate = useNavigate();

    const handleSignupForm = async (event) => {
        event.preventDefault();
        
        if (!agreedToTerms) {
            toast.error("Please agree to the Terms and Conditions and Privacy Policy");
            return;
        }
        
        setLoading(true);   
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            toast.success("Verification email sent! Please check your inbox before logging in.");

            // Update user profile with full name
            const fullName = `${firstName} ${lastName}`;
            await updateProfile(user, { displayName: fullName });

            // Get database reference
            const database = getDatabase();
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            // Default user data
            const userData = {
                firstName,
                lastName,
                email,
                phoneNumber,
                registrationComplete: false, // Default to false
                role: 'Student', // Default role
                emailVerified: false, // Track verification status
            };

            // If user already exists, merge existing data with new data
            if (snapshot.exists()) {
                const existingData = snapshot.val();
                await update(userRef, { ...existingData, ...userData });
            } else {
                // If user doesn't exist, set new data
                await set(userRef, userData);
            }

            console.log("User Registered:", user);
            toast.success("Account created! Please complete your profile.");
            
            // Navigate to profile completion page with the user's ID
            navigate(`/login`);
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                toast.error("User already exists.");
            } else {
                console.error(err);
                toast.error("Registration failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        if (!agreedToTerms) {
            toast.error("Please agree to the Terms and Conditions and Privacy Policy");
            return;
        }
        
        const provider = new GoogleAuthProvider();
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Extract first and last name from displayName
            const nameParts = user.displayName ? user.displayName.split(' ') : ['', ''];
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            
            const database = getDatabase();
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            // Default user data
            const userData = {
                firstName,
                lastName,
                email: user.email,
                registrationComplete: false, // Default to false
                role: 'Student', // Default role
            };

            // If user already exists, merge existing data with new data
            if (snapshot.exists()) {
                const existingData = snapshot.val();
                await update(userRef, { ...existingData, ...userData });
            } else {
                // If user doesn't exist, set new data
                await set(userRef, userData);
            }

            console.log("User Registered with Google:", user);
            toast.success("Account created! Please complete your profile.");
            
            // Navigate to profile completion page with the user's ID
            navigate(`/complete-profile/${user.uid}`);
        } catch (err) {
            console.error(err);
            toast.error("Google signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <Header />

            <div className="pt-[120px] pb-16 min-h-screen bg-gray-50">
                <div className="max-w-lg mx-auto px-4">
                    <Card className="border-0">
                        <CardContent className="pt-10">
                            <div className="flex justify-center mb-6">
                                <img className="h-12 w-auto" src={logo} alt="logo" />
                            </div>
                            <h3 className="text-2xl font-bold text-center mb-6">Create Account</h3>
                            
                            <form onSubmit={handleSignupForm} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                
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
                                
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="terms" 
                                        checked={agreedToTerms}
                                        onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                                        disabled={loading}
                                    />
                                    <Label htmlFor="terms" className="text-sm text-gray-600">
                                        Agree to{" "}
                                        <Link to="/terms-and-conditions" className="text-blue-600 hover:underline">
                                            Terms
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                                            Privacy
                                        </Link>
                                    </Label>
                                </div>
                                
                                <Button
                                    type="submit"
                                    className={`w-full p-2 rounded bg-orange-500 text-white ${
                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <svg
                                            className="animate-spin h-5 w-5 mx-auto text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    ) : (
                                        <span>Signup</span>
                                    )}
                                </Button>
                            </form>
                            
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link></p>
                                
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>
                                
                                <Button
                                    type="button" 
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={handleGoogleSignup}
                                    disabled={loading}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512">
                                        <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" />
                                        <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" />
                                        <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" />
                                        <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" />
                                        <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" />
                                        <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" />
                                    </svg>
                                    Sign up with Google
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster position="top-center" />
            <Footer />
        </Fragment>
    );
}

export default SignupPage;