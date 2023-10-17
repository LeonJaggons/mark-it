// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fireAuth } from "@/firebase/firebase-init";
import { getUserFromFBUser } from "@/services/auth_services";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            const result = await handleUserLogin(req, res);
            if (result.userID) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }

            break;
        default:
            res.status(200).json({ name: "John Doe" });
            break;
    }
}

const handleUserLogin = async (req, res) => {
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
        return user;
    } else {
        return error;
    }
};
