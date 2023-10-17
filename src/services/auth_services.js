import { fireAuth, fireStorage, fireStore } from "@/firebase/firebase-init";
import { setLoggedIn, setUser } from "@/redux/reducer/accountSlice";
import { store } from "@/redux/store";
import Axios from "axios";
import {
    User,
    UserCredential,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import {
    Timestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
export const createAccount = async (img) => {
    const newUserCreds = store.getState().account.newUserCreds;
    const userCreds = await createUserWithEmailAndPassword(
        fireAuth,
        newUserCreds.email,
        newUserCreds.password
    );
    const firebaseID = userCreds.user.uid;
    let profileImgURL;
    const imgRef = ref(fireStorage, `user/${firebaseID}/profile_pic.jpg`);
    const imgRes = await fetch(img).catch((err) => err);
    const imgBlob = await imgRes.blob();
    const imgStoreRef = await uploadBytes(imgRef, imgBlob).catch((err) => err);
    if (imgStoreRef) {
        const dlURL = await getDownloadURL(imgStoreRef.ref);
        profileImgURL = dlURL;
    }
    const userData = {
        userID: firebaseID,
        firstName: newUserCreds.firstName,
        lastName: newUserCreds.lastName,
        email: newUserCreds.email,
        createdDate: Timestamp.now(),
        img: profileImgURL,
    };

    const userDoc = doc(collection(fireStore, "user"), firebaseID);
    await setDoc(userDoc, userData);
};
export const loginUser = async (withSaved = false) => {
    let creds;
    if (withSaved) {
        const ISSERVER = typeof window === "undefined";
        if (!ISSERVER) {
            if (!localStorage.getItem("email")) {
                return;
            }
            creds = {
                email: localStorage.getItem("email"),
                password: localStorage.getItem("password"),
            };
        }
    } else {
        creds = store.getState().account.loginCreds;
    }
    const user = (await Axios.post("/api/auth", creds)).data;
    updateLoginState(user);
};

export const updateLoginState = (user) => {
    if (user.userID !== null) {
        store.dispatch(setUser(user));
        store.dispatch(setLoggedIn(true));
    } else {
        store.dispatch(setLoggedIn(false));
    }
};

export const getUserFromFBUser = async (user) => {
    const userCollection = collection(fireStore, "user");
    const userDoc = doc(userCollection, user?.uid);
    const userDocSnap = await getDoc(userDoc);
    return {
        userID: user?.uid,
        ...userDocSnap.data(),
        createdDate: userDocSnap.data().createdDate?.toDate(),
    };
};
