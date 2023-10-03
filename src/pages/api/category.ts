// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { categories } from "@/constants/product_categories.js";
import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { fireStore } from "@/firebase/firebase-init";
type Data = {
    name: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // const cats = Array.from(categories);
    // const catCollection = collection(fireStore, "category");
    // for (let cat of cats) {
    //     const existsQuery =query(catCollection, where("name", "==", cat))
    //     await addDoc(catCollection, { name: cat });
    // }
    const catCollection = collection(fireStore, "category");
    let catDocs = await getDocs(query(catCollection, orderBy("name", "asc")));
    catDocs = catDocs.docs.map((catDc) => {
        return {
            ...catDc.data(),
            id: catDc.id,
        };
    });

    res.status(200).json(catDocs);
}
