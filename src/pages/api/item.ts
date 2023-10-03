import { fireStore } from "@/firebase/firebase-init";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const itemID: string = req.query.id as string;
    const itemCollection = collection(fireStore, "item");
    if (itemID) {
        const itemDoc = await getDoc(doc(fireStore, "item", itemID));
        const item = {
            ...itemDoc.data(),
            itemID: itemDoc.id,
        };

        res.status(200).json(item);
    } else {
        const itemDocs = await getDocs(itemCollection);
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
