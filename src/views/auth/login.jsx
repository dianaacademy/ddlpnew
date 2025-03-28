import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { auth } from "../../firebase.config";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast, { Toaster } from 'react-hot-toast';
import { getDatabase, ref, child, get, update } from "firebase/database";
import { Button,  } from "@/components/ui/button";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const title = "Login";
import logo from "../../assets/images/logo/01.png"
import { PhoneLoginPage } from "./PhoneLogin";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Refresh user data to get the latest email verification status
            await user.reload();

            if (!user.emailVerified) {
                toast.error("Please verify your email before logging in.");
                setLoading(false);
                return;
            }

            const database = getDatabase();
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            if (userData) {
                // Update emailVerified in the database
                if (!userData.emailVerified) {
                    await update(userRef, { emailVerified: true });
                }

                // Check registration completion status for Student role
                if (userData.role === "Student" && userData.registrationComplete === false) {
                    navigate(`/complete-profile/${user.uid}`);
                    return;
                }

                // Redirect based on role
                if (userData.role === "Admin" || userData.role === "Instructor") {
                    navigate('/admin');
                } else if (userData.role === "Creator") {
                    navigate('/creator');
                } else {
                    navigate('/student');
                }
            } else {
                console.error("User data not found in the database");
                toast.error("User data not found in the database");
            }
        } catch (err) {
            console.error(err);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const database = getDatabase();
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);
            const userData = snapshot.val();

            if (userData) {
                if (!userData.emailVerified && user.emailVerified) {
                    await update(userRef, { emailVerified: true });
                }

                // Check registration completion status for Student role
                if (userData.role === "Student" && userData.registrationComplete === false) {
                    navigate(`/complete-profile/${user.uid}`);
                    return;
                }

                if (userData.role === "Admin") {
                    navigate('/admin');
                } else if (userData.role === "Instructor") {
                    navigate('/instructor');
                } else if (userData.role === "Creator") {
                    navigate('/creator');
                } else {
                    navigate('/student');
                }
            } else {
                console.error("User data not found in the database");
                toast.error("User data not found in the database");
            }

            toast.success("You have successfully logged in with Google!");
        } catch (err) {
            console.error(err);
            toast.error("Google login failed. Please try again.");
        }
    }

    return (
        <Fragment>
            <div className="login-section pt-[50px] pb-[50px] section-bg">
                <div className="container">
                    <div className="account-wrapper">
                        <div className="flex justify-center">
                            <img height={80} width={80} src={logo} alt="logo" />
                        </div>
                        <h3 className="pt-2">{title}</h3>
                        <form onSubmit={handleLogin} className="account-form">
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-2 my-2 border rounded w-full"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-2  border rounded w-full"
                                />
                            </div>
                            <div className="form-group flex justify-between items-center">
                                <div className="checkgroup flex items-center">
                                    
                                    
                                        
                                </div>
                                <Link to="/forgot-password" className="text-sm text-blue-500">Forget Password?</Link>
                            </div>
                            <div className="">
                                <Button
                                    type="submit"
                                    className={`lab-btn w-full p-2 rounded bg-blue-600 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                    ) : (
                                        <span>Login Now</span>
                                    )}
                                </Button>
                            </div>
                        </form>
                        <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>
                                
                                <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <img 
            src="https://ik.imagekit.io/growthx100/icon(7).svg" 
            alt="Icon" 
            className="w-5 h-5"
          />
          Mobile Number
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 text-center">
        <PhoneLoginPage />
      </DialogContent>
    </Dialog>
  <div className="mt-2">
                                <Button
                                    type="button" 
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={handleGoogleLogin}
                                    
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512">
                                        <path fill="#fbbd00" d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z" />
                                        <path fill="#0f9d58" d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z" />
                                        <path fill="#31aa52" d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z" />
                                        <path fill="#3c79e6" d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z" />
                                        <path fill="#cf2d48" d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z" />
                                        <path fill="#eb4132" d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z" />
                                    </svg>
                                    Login with Google
                                </Button>
                                </div>
                            
                        <div className="account-bottom">
                            <span className="d-block pt-2 ">Don't Have an Account? <Link to="/signup">Sign Up</Link></span>
                            
                            
                        </div>
                        <Toaster position="top-center" />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export { LoginPage };