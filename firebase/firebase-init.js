// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcTBKTQQx5IhNWsh1y9PfUPfPVrVCUxO0",
    authDomain: "mark-it-com.firebaseapp.com",
    projectId: "mark-it-com",
    storageBucket: "mark-it-com.appspot.com",
    messagingSenderId: "114334935335",
    appId: "1:114334935335:web:09192b5f4503158f9da102",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const fireStorage = getStorage(app);
