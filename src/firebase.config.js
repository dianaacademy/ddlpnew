import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMgD92jWYxvkeSYkElx7DkCqh3a3OlK30",
  authDomain: "ddlp-456ce.firebaseapp.com",
  projectId: "ddlp-456ce",
  storageBucket: "ddlp-456ce.appspot.com",
  messagingSenderId: "133537517881",
  appId: "1:133537517881:web:7f41d03e7deed4c0ed98e8",
  measurementId: "G-VXJGENCYD1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Create a separate instance of auth
const auth = getAuth(app);

export { auth };
export const db = getFirestore(app);
const storage = getStorage(app);
export { storage, analytics };