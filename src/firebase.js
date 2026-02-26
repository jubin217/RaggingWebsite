import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBxBla4ND-cpMTt5ifCpdhutFqTy1RXT8M",
    authDomain: "raggingsystem.firebaseapp.com",
    projectId: "raggingsystem",
    storageBucket: "raggingsystem.firebasestorage.app",
    messagingSenderId: "907844542564",
    appId: "1:907844542564:web:d3b8fe84731766d83ebf71",
    measurementId: "G-LYLKWNBWL4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const db_realtime = getDatabase(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
