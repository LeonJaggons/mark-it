import { fireStore } from "@/firebase/firebase-init";
import { setLoggedIn, setUser } from "@/redux/reducer/accountSlice";
import { store } from "@/redux/store";
import Axios from "axios";
import { User, UserCredential } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";

export const loginUser = async () => {
    const loginCreds = store.getState().account.loginCreds;
    const user = (await Axios.post("/api/auth", loginCreds)).data;
    updateLoginState(user);
};

export const updateLoginState = (user: any) => {
    if (user.userID !== null) {
        store.dispatch(setUser(user));
        store.dispatch(setLoggedIn(true));
    } else {
        store.dispatch(setLoggedIn(false));
    }
};
export const getUserFromFBUser = async (user: User | void) => {
    const userCollection = collection(fireStore, "user");
    const userDoc = doc(userCollection, user?.uid);
    const userDocSnap = await getDoc(userDoc);
    return {
        userID: user?.uid,
        ...userDocSnap.data(),
    };
};
