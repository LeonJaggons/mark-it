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
        ("RUN 1");
        const catQuery = query(
            itemCollection,
            where("category", "==", category),
            where("userID", "!=", userID)
        );
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
        ("RUN 4");
        const itemsQry = query(itemCollection, where("userID", "==", userID));
        const itemDocs = await getDocs(itemsQry);
        items = itemDocs.docs.map((itemDc) => {
            return {
                ...itemDc.data(),
                itemID: itemDc.id,
            };
        });
    }
    if (items) {
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

function getDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = (Math.PI / 180) * lat1;
    const lon1Rad = (Math.PI / 180) * lon1;
    const lat2Rad = (Math.PI / 180) * lat2;
    const lon2Rad = (Math.PI / 180) * lon2;

    // Calculate the differences between the latitudes and longitudes
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;

    // Haversine formula
    const a =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance in kilometers
    const distance = earthRadius * c;

    return distance;
}
