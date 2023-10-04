import { fireStore } from "@/firebase/firebase-init";
import {
    Timestamp,
    addDoc,
    collection,
    getDocs,
    query,
    updateDoc,
    orderBy,
    where,
} from "firebase/firestore";
import { filter, sortBy, uniqBy } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { userID, to, from, itemID, content } = req.query;
    const messageCollection = collection(fireStore, "message");
    switch (req.method) {
        case "GET":
            if (userID) {
                const msgQry = query(
                    messageCollection,
                    where("participants", "array-contains", userID),
                    orderBy("createdDate", "desc")
                );
                const msgDocs = await getDocs(msgQry);
                console.log(msgDocs.docs.length);
                const msgDocSnap = msgDocs.docs.map((i) => {
                    return { ...i.data(), messageID: i.id };
                });
                res.status(200).json(msgDocSnap);
            } else if (to && from && itemID) {
                const toMsgQry = query(
                    messageCollection,
                    where("participants", "array-contains", to),
                    where("itemID", "==", itemID),
                    orderBy("createdDate", "asc")
                );
                const fromMsgQry = query(
                    messageCollection,
                    where("participants", "array-contains", from),
                    where("itemID", "==", itemID),
                    orderBy("createdDate", "asc")
                );
                const toMsgs = await getDocs(toMsgQry);
                const fromMsgs = await getDocs(fromMsgQry);
                const toMsgsDocSnap = toMsgs.docs.map((i) => {
                    return {
                        ...i.data(),
                        messageID: i.id,
                        createdDate: i.data().createdDate.toDate(),
                    };
                });
                const allMsgs = fromMsgs.docs
                    .map((i) => {
                        return {
                            ...i.data(),
                            createdDate: i.data().createdDate.toDate(),
                            messageID: i.id,
                        };
                    })
                    .concat(toMsgsDocSnap);
                let filtered = filter(allMsgs, (msg) => {
                    const participants = msg.participants;
                    return (
                        participants.includes(to) && participants.includes(from)
                    );
                });

                filtered = uniqBy(filtered, "messageID");
                filtered = sortBy(filtered, function (o) {
                    return new Date(o.createdDate);
                });
                res.status(200).json(filtered);
            } else {
                res.status(200).json([]);
            }
            break;
        case "POST":
            if (to && from) {
                const messageData = {
                    to: to,
                    from: from,
                    participants: [to, from],
                    itemID: itemID,
                    content: content,
                    createdDate: Timestamp.now(),
                };
                const newMsgRef = await addDoc(messageCollection, messageData);
                await updateDoc(newMsgRef, { messageID: newMsgRef.id });

                res.status(200).json(messageData);
            }
            res.status(200).json({});
            break;
    }
}
