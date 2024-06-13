import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBMgD92jWYxvkeSYkElx7DkCqh3a3OlK30",
  authDomain: "ddlp-456ce.firebaseapp.com",
  projectId: "ddlp-456ce",
  storageBucket: "ddlp-456ce.appspot.com",
  messagingSenderId: "133537517881",
  appId: "1:133537517881:web:7f41d03e7deed4c0ed98e8",
  measurementId: "G-VXJGENCYD1",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, db, storage, analytics, database, app };
