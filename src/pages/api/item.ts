import { fireStore } from "@/firebase/firebase-init";
import { store } from "@/redux/store";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const userID: string = req.query.userID ? (req.query.userID as string) : "";
    const itemID: string = req.query.id as string;
    const category: string = req.query.category as string;
    const itemCollection = collection(fireStore, "item");
    if (category) {
        const catQuery = query(
            itemCollection,
            where("category", "==", category),
            where("userID", "!=", userID)
        );
        const itemDocs = await getDocs(catQuery);
        res.status(200).json(
            itemDocs.docs.map((itemDc) => {
                return {
                    ...itemDc.data(),
                    itemID: itemDc.id,
                };
            })
        );
    } else if (userID) {
        const userItemQry = query(
            itemCollection,
            where("userID", "==", userID)
        );
        const itemDocs = await getDocs(userItemQry);
        res.status(200).json(
            itemDocs.docs.map((itemDc) => {
                return {
                    ...itemDc.data(),
                    itemID: itemDc.id,
                };
            })
        );
    } else if (itemID) {
        const itemDoc = await getDoc(doc(fireStore, "item", itemID));
        const item = {
            ...itemDoc.data(),
            itemID: itemDoc.id,
        };

        res.status(200).json(item);
    } else {
        const itemsQry = query(itemCollection, where("userID", "!=", userID));
        const itemDocs = await getDocs(itemsQry);
        res.status(200).json(
            itemDocs.docs.map((itemDc) => {
                return {
                    ...itemDc.data(),
                    itemID: itemDc.id,
                };
            })
        );
    }
}
