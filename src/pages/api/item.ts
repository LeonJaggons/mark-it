import { fireStore } from "@/firebase/firebase-init";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDistance } from "./geo_helpers";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const userID: string = req.query.userID ? (req.query.userID as string) : "";
    const itemID: string = req.query.id as string;
    const onlyUser: string = req.query.onlyUser as string;
    const category: string = req.query.category as string;
    const itemCollection = collection(fireStore, "item");
    let items;
    if (category) {
        const catQuery = userID
            ? query(
                  itemCollection,
                  where("category", "==", category),
                  where("userID", "!=", userID)
              )
            : query(itemCollection, where("category", "==", category));
        const itemDocs = await getDocs(catQuery);
        items = itemDocs.docs.map((itemDc) => {
            return {
                ...itemDc.data(),
                itemID: itemDc.id,
            };
        });
    } else if (userID && !onlyUser && onlyUser !== "true") {
        const userItemQry = query(
            itemCollection,
            where("userID", "!=", userID)
        );
        const itemDocs = await getDocs(userItemQry);
        items = itemDocs.docs.map((itemDc) => {
            return {
                ...itemDc.data(),
                itemID: itemDc.id,
            };
        });
    } else if (itemID) {
        ("RUN 3");
        const itemDoc = await getDoc(doc(fireStore, "item", itemID));
        const item = {
            ...itemDoc.data(),
            itemID: itemDoc.id,
        };

        res.status(200).json(item);
    } else {
        const itemsQry = query(itemCollection);
        const itemDocs = await getDocs(itemsQry);
        items = itemDocs.docs.map((itemDc) => {
            return {
                ...itemDc.data(),
                itemID: itemDc.id,
            };
        });
    }
    if (items) {
        if (userID) {
            const userDoc = doc(collection(fireStore, "user"), userID);
            const userLoc = (await getDoc(userDoc)).data().location;
            if (userLoc) {
                items = items.map((i) => {
                    return {
                        ...i,
                        distance: getDistance(i.location, userLoc),
                    };
                });
            }
        }

        res.status(200).json(items);
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
