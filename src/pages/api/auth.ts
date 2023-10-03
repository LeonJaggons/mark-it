// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
    User,
    UserCredential,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { fireAuth, fireStore } from "@/firebase/firebase-init";
import { collection, doc, getDoc } from "firebase/firestore";
import { getUserFromFBUser } from "@/services/auth_services";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    switch (req.method) {
        case "POST":
            handleUserLogin(req, res);
            break;
        default:
            res.status(200).json({ name: "John Doe" });
            break;
    }
}

const handleUserLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<any>
) => {
    let error = null;
    const email = req.body.email;
    const password = req.body.password;
    const userCreds = await signInWithEmailAndPassword(
        fireAuth,
        email,
        password
    ).catch((err) => {
        error = err;
    });

    if (!error) {
        const user = await getUserFromFBUser(userCreds?.user);
        res.status(200).json(user);
    } else {
        res.status(400).json(error);
    }
};
