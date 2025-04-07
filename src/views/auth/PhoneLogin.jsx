import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber, signInAnonymously, updateProfile } from "firebase/auth";
import { getDatabase, ref, get, update, set } from "firebase/database";
import toast, { Toaster } from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import logo from "../../assets/images/logo/01.png";

const PhoneLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0);
  const [useTwilio, setUseTwilio] = useState(true);
  const [verificationId, setVerificationId] = useState("");
  const [userUid, setUserUid] = useState(null);
  const [userData, setUserData] = useState(null);
  const [sessionId, setSessionId] = useState(null); // Store Twilio session ID
  
  const navigate = useNavigate();

  // Worker URL
  const WORKER_URL = "https://otp-service.kkbharti555.workers.dev/";

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendTimeout > 0) {
      timer = setTimeout(() => {
        setResendTimeout(resendTimeout - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendTimeout]);

  // Function to format timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Find user by phone number
  const findUserByPhoneNumber = async (phone) => {
    try {
      const database = getDatabase();
      const usersRef = ref(database, 'users');
      
      // Get all users (consider implementing server-side query for large databases)
      const snapshot = await get(usersRef);
      const users = snapshot.val();
      
      if (!users) return null;
      
      // Find user with matching phone number
      const matchingUserEntry = Object.entries(users).find(([_, userData]) => 
        userData.phoneNumber === phone
      );
      
      if (matchingUserEntry) {
        return { uid: matchingUserEntry[0], ...matchingUserEntry[1] };
      }
      
      return null;
    } catch (error) {
      console.error("Error finding user by phone number:", error);
      return null;
    }
  };

  // Send OTP via Twilio Cloudflare Worker
  const sendOtpViaTwilio = async (number, isResend = false) => {
    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: isResend ? "resend" : "send",
          phoneNumber: number
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store session ID if provided by the API
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
        return { success: true, message: "OTP sent successfully" };
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Worker Error:", error);
      throw error;
    }
  };

  // Verify OTP via Twilio Cloudflare Worker
  const verifyOtpViaTwilio = async (number, code) => {
    try {
      // Include sessionId in the verification request if available
      const requestBody = {
        action: "verify",
        phoneNumber: number,
        otpCode: code
      };
      
      // Add session ID if available (important for verification)
      if (sessionId) {
        requestBody.sessionId = sessionId;
      }
      
      console.log("Sending verification request with:", requestBody);
      
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      console.log("Verification response:", data);
      
      if (data.success) {
        return { success: true };
      } else {
        throw new Error(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verification Error:", error);
      throw error;
    }
  };

  // Configure reCAPTCHA verifier for Firebase
  const configureCaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': () => {
        toast.success("reCAPTCHA verified");
      },
      'expired-callback': () => {
        toast.error("reCAPTCHA expired. Please verify again.");
      }
    });
  };

  // Create default user data if needed
  const createDefaultUserData = async (uid, phoneNumber) => {
    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${uid}`);
      
      // Default user data with Student role
      const defaultUserData = {
        phoneNumber,
        role: "Student", // Default role
        registrationComplete: false,
        emailVerified: false,
        firstName: "",
        lastName: "",
        createdAt: new Date().toISOString()
      };
      
      // Set the data in the database
      await set(userRef, defaultUserData);
      
      return defaultUserData;
    } catch (error) {
      console.error("Error creating default user data:", error);
      throw error;
    }
  };

  // Send OTP to phone number
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!phoneNumber || phoneNumber.length < 10) {
        toast.error("Please enter a valid phone number");
        setLoading(false);
        return;
      }

      // Check if the phone number is associated with an account
      const user = await findUserByPhoneNumber(phoneNumber);
      
      if (!user) {
        toast.error("No account found with this phone number. Redirecting to registration page...");
        setTimeout(() => {
          navigate('/signup');
        }, 2000);
        setLoading(false);
        return;
      }
      
      // Store the user data for later use
      setUserUid(user.uid);
      setUserData(user);

      // Use Twilio for all numbers as the primary method
      setUseTwilio(true);
      
      try {
        // First try with Twilio
        const result = await sendOtpViaTwilio(phoneNumber);
        setOtpSent(true);
        setResendTimeout(120); // 2 minutes timeout before resend
        toast.success("OTP sent successfully!");
      } catch (twilioError) {
        // If Twilio fails, fall back to Firebase
        console.error("Twilio Error:", twilioError);
        toast.error("Twilio service unavailable. Falling back to Firebase...");
        
        setUseTwilio(false);
        configureCaptcha();
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setVerificationId(confirmationResult);
        setOtpSent(true);
        setResendTimeout(120); // 2 minutes timeout before resend
        toast.success("OTP sent successfully via Firebase!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.message || "Failed to send OTP. Please try again.");
      // Reset reCAPTCHA if needed
      if (!useTwilio && window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimeout > 0) return;
    
    setLoading(true);
    
    try {
      if (useTwilio) {
        const result = await sendOtpViaTwilio(phoneNumber, true);
        toast.success("OTP resent successfully!");
      } else {
        // For Firebase
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
        configureCaptcha();
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setVerificationId(confirmationResult);
        toast.success("OTP resent successfully!");
      }
      
      setResendTimeout(120); // Reset the timeout
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sign in anonymously then link to the user account
  const signInAnonymouslyAndLink = async () => {
    try {
      // Sign in anonymously
      const anonymousCred = await signInAnonymously(auth);
      
      // Update the anonymous user with data from our registered user
      // This effectively "impersonates" the user after verification
      if (userData) {
        const displayName = userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`
          : "User";
            
        await updateProfile(anonymousCred.user, {
          displayName: displayName
        });
        
        // Store auth state in localStorage or a cookie for persistence
        localStorage.setItem('authUser', JSON.stringify({
          uid: userUid,
          displayName: displayName,
          email: userData.email || "",
          phoneNumber: userData.phoneNumber
        }));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error signing in anonymously:", error);
      throw error;
    }
  };

  // Handle redirection based on user role
  const handleRedirection = (userData) => {
    console.log("Redirecting with user data:", userData);
    
    // Check if userData has required fields
    if (!userData) {
      console.error("User data is null or undefined");
      toast.error("User data not found. Please try again or contact support.");
      return;
    }
    
    // Set a default role if none exists
    const role = userData.role || "Student";
    const registrationComplete = userData.registrationComplete !== undefined 
      ? userData.registrationComplete 
      : false;

    // Check registration completion status for Student role
    if (role === "Student" && registrationComplete === false) {
      navigate(`/complete-profile/${userUid}`);
      return;
    }

    // Redirect based on role
    if (role === "Admin") {
      navigate('/admin');
    } else if (role === "Instructor") {
      navigate('/instructor');
    } else if (role === "Creator") {
      navigate('/creator');
    } else {
      // Default to student route
      navigate('/student');
    }
  };

  // Verify OTP and login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Verifying OTP:", otp, "with method:", useTwilio ? "Twilio" : "Firebase");
      
      // Verify OTP
      if (useTwilio) {
        try {
          // Verify OTP via Twilio
          await verifyOtpViaTwilio(phoneNumber, otp);
          console.log("Twilio verification successful");
          
          // Sign in anonymously and link to the user account
          await signInAnonymouslyAndLink();
        } catch (error) {
          console.error("Twilio verification failed:", error);
          throw error; // Re-throw so we catch it below
        }
      } else {
        // For Firebase
        try {
          await verificationId.confirm(otp);
          console.log("Firebase verification successful");
        } catch (error) {
          console.error("Firebase verification failed:", error);
          throw error;
        }
      }

      // If we have userData from the send OTP step, use it directly
      if (userData) {
        console.log("Using cached user data for redirection");
        toast.success("Login successful! Redirecting...");
        
        // Use a timeout to ensure the toast is seen before redirect
        setTimeout(() => {
          handleRedirection(userData);
        }, 1500);
      } else {
        // Fallback to get user data again if needed
        console.log("Fetching user data for redirection");
        const database = getDatabase();
        const userRef = ref(database, `users/${userUid}`);
        const snapshot = await get(userRef);
        let fetchedUserData = snapshot.val();

        if (fetchedUserData) {
          toast.success("Login successful! Redirecting...");
          
          // Use a timeout to ensure the toast is seen before redirect
          setTimeout(() => {
            handleRedirection({...fetchedUserData, uid: userUid});
          }, 1500);
        } else {
          // If user data doesn't exist, create default data
          console.log("User data not found. Creating default data.");
          try {
            fetchedUserData = await createDefaultUserData(userUid, phoneNumber);
            toast.success("Account created! Please complete your profile.");
            
            setTimeout(() => {
              navigate(`/complete-profile/${userUid}`);
            }, 1500);
          } catch (createError) {
            console.error("Error creating default user data:", createError);
            toast.error("Failed to create user data. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="login-section">
        <div className="container mx-auto max-w-md">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <img src={logo} alt="Logo" className="h-12" />
              </div> 
              <CardTitle className="text-2xl text-center font-bold">Phone Login</CardTitle>
              <CardDescription className="text-center">
                Login with your registered phone number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="phone" className="w-full">
                <TabsContent value="phone">
                  {!otpSent ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="font-medium text-gray-700">Mobile Number*</Label>
                        <div className="phone-input-container relative">
                          <PhoneInput
                            international
                            countryCallingCodeEditable={true}
                            defaultCountry="IN"
                            className="w-full bg-white rounded-md shadow-sm ring-1 ring-gray-300 focus-within:ring-1 focus-within:ring-gray-900 px-3 py-2"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            required
                            disabled={loading}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          We'll send a verification code to this number.
                        </p>
                      </div>

                      {/* Only show recaptcha container if needed for Firebase fallback */}
                      <div id="recaptcha-container" className="mt-4"></div>
                      
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !phoneNumber}
                      >
                        {loading ? (
                          <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="otp" className="font-medium text-gray-700">Enter 6-digit OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          OTP sent to {phoneNumber} {useTwilio ? "(via Twilio)" : "(via Firebase)"}
                        </p>
                        
                        {/* Show resend timer/button */}
                        <div className="text-xs text-gray-600 mt-2">
                          {resendTimeout > 0 ? (
                            <span>Resend OTP in {formatTime(resendTimeout)}</span>
                          ) : (
                            <button 
                              type="button" 
                              onClick={handleResendOTP}
                              className="text-blue-600 hover:text-blue-800"
                              disabled={loading}
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-1/2"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp("");
                            setSessionId(null);
                            if (!useTwilio && window.recaptchaVerifier) {
                              window.recaptchaVerifier.clear();
                            }
                          }}
                          disabled={loading}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="w-1/2"
                          disabled={loading || otp.length !== 6}
                        >
                          {loading ? (
                            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                          ) : (
                            "Verify OTP"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-gray-600">
              <p>
                By continuing, you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </CardFooter>
          </Card>
          <Toaster position="top-center" />
        </div>
      </div>
      <style jsx>{`
        /* Fix flag display issue */
        .phone-input-container .PhoneInputCountryIcon--border {
          box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
          margin-right: 0.5rem;
        }
        .PhoneInputCountrySelectArrow {
          margin-right: 0.5rem;
          opacity: 0.6;
        }
        .PhoneInputInput {
          border: none;
          background: none;
          padding-left: 0.5rem;
          outline: none;
          width: 100%;
        }
      `}</style>
    </Fragment>
  );
};

export { PhoneLoginPage };