import { Fragment, useState,  } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Header from "../../components/header";
import PageHeader from "./pageheader";
import { auth } from "../../firebase.config";
import { signInWithEmailAndPassword, } from "firebase/auth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, child, get } from "firebase/database";
import { useAuth } from "../../auth/hooks/useauth";
// Create a context for user authentication

const title = "Login";
const socialTitle = "Login With Social Media";

const socialList = [
    {
        link: '#',
        iconName: 'icofont-facebook',
        className: 'facebook',
    },
    {
        link: '#',
        iconName: 'icofont-twitter',
        className: 'twitter',
    },
    {
        link: '#',
        iconName: 'icofont-linkedin',
        className: 'linkedin',
    },
    {
        link: '#',
        iconName: 'icofont-instagram',
        className: 'instagram',
    },
    {
        link: '#',
        iconName: 'icofont-pinterest',
        className: 'pinterest',
    },
]

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {setCurrentUser} = useAuth();

    const handlelogin = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User Logged In:", user);
            // Fetch user data from the Realtime Database
            const database = getDatabase();
            const userRef = child(ref(database), `users/${user.uid}`);
            const snapshot = await get(userRef);
            const userData = snapshot.val();
            setCurrentUser(userData);
            console.log(userData);
            if (userData) {
                // Check the user's role
                if (userData.role === "Admin") {
                    // Redirect to /dashboard if the user's role is "Admin"
                    navigate('/admin');
                } else {
                    // Redirect to /my-learning for other roles
                    navigate('/student');
                }
            } else {
                console.error("User data not found in the database");
            }
    
            // Show success notification
            toast.success("You have successfully logged in!");
        } catch (err) {
            console.error(err);
        }
    }

    // useEffect(() => {
    //     // Check if user is already logged in from cookies
    //     const userFromCookie = Cookies.get('user');
    //     if (userFromCookie) {
    //         // Redirect to dashboard if user is logged in
    //         navigate('/dashboard');
    //     }
    // }, [user]);

    return (
        <Fragment>
            <Header />
            <PageHeader title={'Login Page'} curPage={'Login'} />
                <div className="login-section padding-tb section-bg">
                    <div className="container">
                        <div className="account-wrapper">
                            <h3 className="title">{title}</h3>
                            <form onSubmit={handlelogin} className="account-form">
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                                        <div className="checkgroup">
                                            <input type="checkbox" name="remember" id="remember" />
                                            <label htmlFor="remember">Remember Me</label>
                                        </div>
                                        <Link to="/forgetpass">Forget Password?</Link>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="lab-btn"><span>Login Now</span></button>
                                </div>
                            </form>
                            <div className="account-bottom">
                                <span className="d-block cate pt-10">Don’t Have any Account?  <Link to="/signup">Sign Up</Link></span>
                                <span className="or"><span>or</span></span>
                                <h5 className="subtitle">{socialTitle}</h5>
                                <ul className="lab-ul social-icons justify-content-center">
                                    {socialList.map((val, i) => (
                                        <li key={i}>
                                            <a href={val.link} className={val.className}><i className={val.iconName}></i></a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            <Footer />
        </Fragment>
    );
}



export { LoginPage };
