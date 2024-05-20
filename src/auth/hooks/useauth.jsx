// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import {  onAuthStateChanged, signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { auth } from '../../firebase.config';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);

    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
            Cookies.remove('authUser');
            navigate('/login');
        } catch (error) {
            setError(error.message);
            console.error('Error signing out:', error);
        }
    };

    const value = { currentUser, setCurrentUser, logout, error };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
}