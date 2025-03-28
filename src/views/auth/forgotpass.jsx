import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import logo from "../../assets/images/logo/01.png";

const ForgetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (event) => {
        event.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }
        
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setResetSent(true);
            toast.success("Password reset email sent! Please check your inbox.");
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                toast.error("No account exists with this email address");
            } else {
                toast.error("Failed to send reset email. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleBackToLogin = () => {
        navigate('/login');
    }

    return (
        <Fragment>
            <div className="login-section pt-[50px] pb-[250px] section-bg">
                <div className="container">
                    <div className="account-wrapper">
                        <div className="flex justify-center">
                            <img height={80} width={80} src={logo} alt="logo" />
                        </div>
                        <h3 className="pt-2">Forgot Password</h3>
                        
                        {!resetSent ? (
                            <>
                                <p className="text-center text-gray-600 mb-4">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                                <form onSubmit={handleResetPassword} className="account-form">
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="p-2 my-2 border rounded w-full"
                                            required
                                        />
                                    </div>
                                    <div className="mt-4">
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
                                                <span>Send Reset Link</span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="mb-4 p-2 bg-green-50 text-green-700 rounded-md">
                                    <p className="font-medium">Password reset email sent!</p>
                                    <p className="text-sm mt-1">Please check your inbox at {email} and follow the instructions to reset your password.</p>
                                </div>
                                <Button
                                    onClick={handleBackToLogin}
                                    className="mt-2 bg-blue-600 text-white"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        )}
                        
                        <div className="account-bottom">
                            <span className="d-block pt-2">Remember your password? <Link to="/login">Login</Link></span>
                        </div>
                        <Toaster position="top-center" />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export { ForgetPasswordPage };