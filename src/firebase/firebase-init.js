import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCg3RUV27XtkE4R5DV0-rvQcvAC9MjsCpI",
    authDomain: "markit-63b00.firebaseapp.com",
    projectId: "markit-63b00",
    storageBucket: "markit-63b00.appspot.com",
    messagingSenderId: "641710364027",
    appId: "1:641710364027:web:03b357f69d368dbc25d9de",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const fireStore = getFirestore(app);
export const fireStorage = getStorage(app);
export const fireAuth = getAuth(app);
