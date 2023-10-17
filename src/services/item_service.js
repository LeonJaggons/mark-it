import { fireStorage, fireStore } from "@/firebase/firebase-init";
import { store } from "@/redux/store";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const postNewItem = async (originalItem = null) => {
    if (!originalItem) {
        originalItem = store.getState().item.postItem;
    }
    let postItem = { ...originalItem };
    const user = store.getState().account.user;
    const images = postItem.images;

    delete postItem.images;
    postItem;
    for (let key of Object.keys(postItem)) {
        if (postItem[key] === undefined) {
            delete postItem[key];
        }
    }
    const itemCollection = collection(fireStore, "item");
    const itemDoc = await addDoc(itemCollection, postItem).catch((err) => err);
    if (itemDoc) {
        const newItemID = itemDoc.id;
        const dlURLs = [];
        if (images) {
            let i = 0;
            for (let img of images) {
                i++;
                if (typeof img !== "string") {
                    const imgRef = ref(
                        fireStorage,
                        `item/${newItemID}/imgs/img-${i}.jpg`
                    );
                    const imgRes = await fetch(img).catch((err) => err);
                    const imgBlob = await imgRes.blob();
                    const imgStoreRef = await uploadBytes(
                        imgRef,
                        imgBlob
                    ).catch((err) => err);
                    if (imgStoreRef) {
                        const dlURL = await getDownloadURL(imgStoreRef.ref);
                        dlURLs.push(dlURL);
                    }
                } else {
                    dlURLs.push(img);
                }
            }
        }

        await updateDoc(itemDoc, {
            itemID: itemDoc.id,
            images: dlURLs,
        });
    }
};

function getRandomUSLocation() {
    const minLat = 24.396308;
    const maxLat = 49.384358;
    const minLng = -125.0;
    const maxLng = -66.93457;

    const randomLat = Math.random() * (maxLat - minLat) + minLat;
    const randomLng = Math.random() * (maxLng - minLng) + minLng;

    const location = {
        latitude: randomLat,
        longitude: randomLng,
    };

    return location;
}

export const postRandomItem = async () => {
    const userID = store.getState().account.user?.userID;
    if (!userID) return;
    const categories = await getItemCategories();
    const catIndex = Math.floor(Math.random() * categories.length);
    const randomItem = {
        userID: userID,
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        condition: "Used - Like New",
        category: categories[catIndex].name,
        location: getRandomUSLocation(),
        images: [],
    };

    for (let i = 0; i < 3; i++) {
        const image = faker.image.urlLoremFlickr({
            width: 400,
            height: 400,
        });
        randomItem.images.push(image);
    }
    await postNewItem(randomItem);
};
export const getItemsByCategory = async (category) => {
    const userID = store.getState().account.user?.userID;
    const res = await axios.get(`/api/item`, {
        params: { category: category, userID: userID },
    });
    const items = res.data;
    return items;
};
export const getUserItems = async () => {
    const userID = store.getState().account.user?.userID;
    const res = await axios.get(`/api/item`, {
        params: { userID: userID, onlyUser: "true" },
    });
    const items = res.data;
    return items;
};

export const getAllItems = async () => {
    const userID = store.getState().account.user?.userID;
    let res;
    if (userID) {
        res = await axios.get("/api/item", {
            params: { userID: userID ?? "none" },
        });
    } else {
        res = await axios.get("/api/item");
    }
    const items = res.data;

    return items;
};

export const getItemByID = async (itemID) => {
    const res = await axios.get(`/api/item?id=${itemID}`);
    return res.data;
};

export const getLikedItems = async () => {
    const userID = store.getState().account.user.userID;
    const likedItems = await axios.get(`/api/favorite`, {
        params: {
            userID: userID,
        },
    });

    return likedItems.data;
};
export const isItemLiked = async (itemID) => {
    const likedItems = await getLikedItems();
    return likedItems?.map((i) => i.itemID).includes(itemID);
};
export const likeItem = async (itemID) => {
    const userID = store.getState().account.user.userID;
    await axios.post(`/api/favorite?itemID=${itemID}&userID=${userID}`, {
        params: {
            itemID: itemID,
            userID: userID,
        },
    });
};
export const deleteLikeItem = async (itemID) => {
    const userID = store.getState().account.user.userID;
    await axios.delete(`/api/favorite?itemID=${itemID}&userID=${userID}`);
};

export const getItemCategories = async () => {
    const res = await axios.get("/api/category");
    return [...res.data];
};
