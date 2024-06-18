import { Fragment, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { auth } from "../../firebase.config";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, set, get, child } from "firebase/database";
import { updateProfile } from "firebase/auth";
import logo from "../../assets/images/logo/01.png";
import { Button } from '@/components/ui/button';



const title = "Register Now";

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignupForm = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            const database = getDatabase();
            const userRef = ref(database, `users/${user.uid}`);
            await set(userRef, {
                name,
                email,
                role: 'Student',
            });

            console.log("User Registered:", user);
            toast.success("You have successfully registered!");
            navigate('/login');
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                toast.error("User already exists.");
            } else {
                console.error(err);
                toast.error("Registration failed.");
            }
        }finally{
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const database = getDatabase();
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(child(userRef, `users/${user.uid}`));
            if (snapshot.exists()) {
                toast.error("User already exists.");
                navigate('/login');
            } else {
                await set(userRef, {
                    name: user.displayName,
                    email: user.email,
                    role: 'Student',
                });

                console.log("User Registered with Google:", user);
                toast.success("You have successfully registered with Google!");
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
            toast.error("Google signup failed. Please try again.");
        }
    };

    return (
        <Fragment className="mt-6">
            <Header />

            <div className="pt-[150px] section-bg">
                <div className="">
                    <div className="account-wrapper pt-4 ">
                    <div className="flex   justify-center">
                          <img  
                            height={80}
                            width={80} src={logo} alt="logo" />
                            
                          </div>
                        <h3 className="title pt-2">{title}</h3>
                        <form onSubmit={handleSignupForm} className="account-form">
                            <div className="form-group">
                                <input
                                className='px-2 py-2'
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    className='px-2 py-2'
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    className='px-2 py-2'
                                    type="text"
                                    name="name"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <Button
                                    variant=""
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
                                            <span>Signup</span>
                                        )}
                                    </Button>
                            {/* <div className="form-group">
                                <button type="submit" className="lab-btn"><span>Get Started Now</span></button>
                            </div> */}
                        </form>
                        <div className="">
                            <span className="">Are you a member? <Link to="/login">Login</Link></span>
                            <span className="or"><span>or</span></span>                        
                            <button onClick={handleGoogleSignup} className="google-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40px" className="inline" viewBox="0 0 512 512">
                                    <path fill="#fbbd00"
                                        d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                                        data-original="#fbbd00" />
                                    <path fill="#0f9d58"
                                        d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                                        data-original="#0f9d58" />
                                    <path fill="#31aa52"
                                        d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                                        data-original="#31aa52" />
                                    <path fill="#3c79e6"
                                        d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                                        data-original="#3c79e6" />
                                    <path fill="#cf2d48"
                                        d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                                        data-original="#cf2d48" />
                                    <path fill="#eb4132"
                                        d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                                        data-original="#eb4132" />
                                </svg> Register with Google
                            </button>
                        </div>
                        <ToastContainer />
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}

export default SignupPage;
