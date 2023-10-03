// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fireStore } from "@/firebase/firebase-init";
import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { itemID, userID } = req.query;
    const userDoc = doc(fireStore, "user", userID as string);
    const user = (await getDoc(userDoc)).data();
    const likedItems = user?.likedItems ? user.likedItems : [];
    switch (req.method) {
        case "GET":
            if (likedItems.length === 0) {
                res.status(200).json([]);
            } else {
                const likeQuery = query(
                    collection(fireStore, "item"),
                    where("itemID", "in", likedItems)
                );
                const likedDocs = await getDocs(likeQuery);
                const likeItems = likedDocs.docs.map((i) => {
                    return { ...i.data(), itemID: i.id };
                });
                res.status(200).json(likeItems);
            }
            break;
        case "DELETE":
            if (itemID) {
                console.log(itemID);
                updateDoc(userDoc, {
                    likedItems: arrayRemove(itemID),
                });
            }
            res.status(200).json({ message: "User likes updated" });

            break;
        case "POST":
            if (itemID) {
                console.log(itemID);
                updateDoc(userDoc, {
                    likedItems: arrayUnion(itemID),
                });
            }
            res.status(200).json({ message: "User likes updated" });
            break;
        default:
            res.status(200).json({});
            break;
    }
}
