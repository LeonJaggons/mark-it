// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fireStore } from "@/firebase/firebase-init";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default async function handler(req, res) {
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
