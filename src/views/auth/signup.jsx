import { Fragment } from "react";
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import PageHeader from "./pageheader";
import { auth } from "../../firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, set } from "firebase/database";
import { updateProfile } from "firebase/auth";
import logo from "../../assets/images/logo/01.png"


const title = "Register Now";
const socialTitle = "Register With Social Media";

let socialList = [
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

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Student');
    const navigate = useNavigate();

   
const handlesignupform = async (event) => {
    event.preventDefault();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user's display name
        await updateProfile(user, { displayName: name });

        // Store user data in the Realtime Database
        const database = getDatabase();
        const userRef = ref(database, `users/${user.uid}`);
        await set(userRef, {
            name,
            email,
            role,
        });

        console.log("User Registered:", user);
        toast.success("You have successfully registered!");
        navigate('/login');
    } catch (err) {
        console.error(err);
    }
}

    return (
        <Fragment>
            {/* <Header />
            <PageHeader title={'Register Now'} curPage={'Sign Up'} /> */}
            <div className="login-section padding-tb section-bg">
                <div className="container">
                    <div className="account-wrapper">
                    <div className="flex   justify-center pb-2">
                          <img  
                            height={80}
                            width={80} src={logo} alt="logo" />
                            
                          </div>
                        <h3 className="title text-3xl font-bold">{title}</h3>
                        <form onSubmit={handlesignupform} className="account-form">
                            <div className="form-group">
                                <input className="p-2"
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input className="p-2"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input className="p-2"
                                    type="text"
                                    name="name"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <select className="p-2 hidden"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    {/* Add more roles as needed */}
                                </select>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="lab-btn "><span>Signup Now</span></button>
                            </div>
                        </form>
                        <div className="account-bottom">
                            <span className="d-block cate pt-10">Are you a member? <Link to="/login">Login</Link></span>
                            {/* <span className="or"><span>or</span></span>
                            <h5 className="subtitle">{socialTitle}</h5>
                            <ul className="lab-ul social-icons justify-content-center">
                                {socialList.map((val, i) => (
                                    <li key={i}>
                                        <a href={val.link} className={val.className}><i className={val.iconName}></i></a>
                                    </li>
                                ))}
                            </ul> */}
                        </div>
                        <ToastContainer />
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </Fragment>
    );
}

export default SignupPage;