import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo/01.png";
import { useAuth  } from "@/auth/hooks/useauth";

const phoneNumber = "+44 7441441208";
const address = "40 Bank street, London, E14 5NR, United Kingdom ";

let socialList = [
    {
        iconName: 'icofont-facebook-messenger',
        siteLink: '#',
    },
    {
        iconName: 'icofont-twitter',
        siteLink: '#',
    },
    {
        iconName: 'icofont-vimeo',
        siteLink: '#',
    },
    {
        iconName: 'icofont-skype',
        siteLink: '#',
    },
    {
        iconName: 'icofont-rss-feed',
        siteLink: '#',
    },
];

const Header = () => {
    const { currentUser, role } = useAuth();
    const [menuToggle, setMenuToggle] = useState(false);
    const [socialToggle, setSocialToggle] = useState(false);
    const [headerFixed, setHeaderFixed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 200) {
                setHeaderFixed(true);
            } else {
                setHeaderFixed(false);
            }
        });

        return () => {
            window.removeEventListener("scroll", () => {});
        };
    }, []);

    useEffect(() => {
        if (currentUser) {
            switch (role) {
                case 'admin':
                    navigate('/admin/default');
                    break;
                case 'Creator':
                    navigate('/creator/default');
                    break;
                case 'Instructor':
                    navigate('/instructor/default');
                    break;    
                case 'student':
                    navigate('/student/default');
                    break;
                default:
                    break;
            }
        }
    }, [currentUser, role, navigate]);

    return (
        <header className={`header-section text-black ${headerFixed ? "header-fixed  fadeInUp" : ""}`}>
            <div className={`header-top ${socialToggle ? "open" : ""}`}>
                <div className="container">
                    <div className="header-top-area">
                        <ul className="lab-ul left">
                            <li><i className="icofont-ui-call"></i> <span>{phoneNumber}</span></li>
                            <li><i className="icofont-location-pin"></i> {address}</li>
                        </ul>
                        <ul className="lab-ul social-icons d-flex align-items-center">
                            <li><p>Find us on : </p></li>
                            {socialList.map((val, i) => (
                                <li key={i}><a href={val.siteLink}><i className={val.iconName}></i></a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="backdrop-filter backdrop-blur-lg  bg-opacity-30  shadow-lg rounded-lg p-4 px-0 py-0">
                <div className="container">
                    <div className="header-wrapper">
                        <div className="logo">
                            <Link to="/">
                                <img src={logo} alt="logo" style={{ width: '60%' }} />
                            </Link>
                        </div>
                        <div className="menu-area">
                            <div className="menu">
                                <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                                    <li><NavLink to="/">Home</NavLink></li>
                                    <li><NavLink to="/course">Courses</NavLink></li>
                                    <li><NavLink to="/contact">Contact</NavLink></li>
                                </ul>
                            </div>
                            {currentUser ? (
                                <Link to={role === 'Student' ? "/student/default" : "/admin/default"} className="login">
                                    <i className="icofont-user"></i>
                                    <span>{role === 'Student' ? "My Learning" : "Dashboard"}</span>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="login">
                                        <i className="icofont-user"></i>
                                        <span>LOG IN</span>
                                    </Link>
                                    <Link to="/signup" className="signup">
                                        <i className="icofont-users"></i>
                                        <span>SIGN UP</span>
                                    </Link>
                                </>
                            )}
                            <div className={`header-bar d-lg-none ${menuToggle ? "active" : ""}`} onClick={() => setMenuToggle(!menuToggle)}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="ellepsis-bar d-lg-none" onClick={() => setSocialToggle(!socialToggle)}>
                                <i className="icofont-info-square"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
