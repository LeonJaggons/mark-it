import { fireStorage, fireStore } from "@/firebase/firebase-init";
import { MarkItItem } from "@/redux/reducer/itemSlice";
import { store } from "@/redux/store";
import axios from "axios";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const postNewItem = async () => {
    const originalItem = store.getState().item.postItem;
    let postItem = { ...originalItem };
    const user = store.getState().account.user;
    const images = postItem.images;

    delete postItem.images;
    console.log(postItem);
    for (let key of Object.keys(postItem)) {
        if (postItem[key] === undefined) {
            delete postItem[key];
        }
    }
    const itemCollection = collection(fireStore, "item");
    const itemDoc = await addDoc(itemCollection, postItem).catch((err) =>
        console.log(err)
    );
    if (itemDoc) {
        const newItemID = itemDoc.id;
        const dlURLs = [];
        if (images) {
            let i = 0;
            for (let img of images) {
                i++;
                const imgRef = ref(
                    fireStorage,
                    `item/${newItemID}/imgs/img-${i}.jpg`
                );
                const imgRes = await fetch(img).catch((err) =>
                    console.log(err)
                );
                const imgBlob = await imgRes.blob();
                const imgStoreRef = await uploadBytes(imgRef, imgBlob).catch(
                    (err) => console.log(err)
                );
                if (imgStoreRef) {
                    const dlURL = await getDownloadURL(imgStoreRef.ref);
                    dlURLs.push(dlURL);
                }
            }
        }

        await updateDoc(itemDoc, {
            itemID: itemDoc.id,
            images: dlURLs,
        });
    }
};

export const getItemsByCategory = async (category) => {
    const userID = store.getState().account.user?.userID;
    const res = await axios.get(`/api/item`, {
        params: { category: category, userID: userID },
    });
    const items = res.data;
    return items;
};
export const getAllItems = async () => {
    const userID = store.getState().account.user?.userID;
    const res = await axios.get("/api/item", { params: { userID: userID } });
    const items = res.data;
    return items;
};

export const getItemByID = async (itemID) => {
    const res = await axios.get(`/api/item?id=${itemID}`);
    return res.data;
};

export const getLikedItems = async () => {
    const userID = store.getState().account.user.userID;
    const likedItems = await axios.get(`api/favorite?userID=${userID}`);

    return likedItems.data;
};
export const isItemLiked = async (itemID) => {
    const likedItems = await getLikedItems();
    return likedItems?.map((i) => i.itemID).includes(itemID);
};
export const likeItem = async (itemID) => {
    const userID = store.getState().account.user.userID;
    await axios.post(`/api/favorite?itemID=${itemID}&userID=${userID}`);
};
export const deleteLikeItem = async (itemID) => {
    const userID = store.getState().account.user.userID;
    await axios.delete(`/api/favorite?itemID=${itemID}&userID=${userID}`);
};
