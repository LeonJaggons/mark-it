import { fireStore } from "@/firebase/firebase-init";
import {
    Timestamp,
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { filter, find, sortBy, uniqBy } from "lodash";
import CitiesJSON from "../uscities.json";

export default async function handler(req, res) {
    const q = req.query.q;
    const zipCode = parseInt(req.query.zip);
    switch (req.method) {
        case "GET":
            if (q) {
                const results = filter(CitiesJSON, (o) =>
                    o.name.toUpperCase().includes(q.toUpperCase())
                );
                res.status(200).json(results);
            } else if (zipCode) {
                const results = filter(CitiesJSON, (o) =>
                    o.zips.includes(zipCode)
                );
                res.status(200).json(results);
            } else {
                res.status(200).json([]);
            }
    }
}
