import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAVW1TyvvIVYZTal4HLutX2jj4ldgEw40A",
    authDomain: "iitk-stamatics-tradeathon.firebaseapp.com",
    projectId: "iitk-stamatics-tradeathon",
    storageBucket: "iitk-stamatics-tradeathon.firebasestorage.app",
    messagingSenderId: "786426697189",
    appId: "1:786426697189:web:63a899f51a5d7a402f0b0c",
    measurementId: "G-JW61YVCWH9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };