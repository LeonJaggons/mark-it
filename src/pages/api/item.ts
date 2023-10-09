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
        console.log("RUN 1");
        console.log(userID ? 1 : 0);
        console.log(category);
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
        console.log("RUN 4");
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
        console.log(items);
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

function getDistance(loc1, loc2) {
    const lat1 = loc1.latitude;
    const lat2 = loc2.latitude;

    const lon1 = loc1.longitude;
    const lon2 = loc2.longitude;
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

    return distance / 1.609;
}
