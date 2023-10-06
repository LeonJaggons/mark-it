import { store } from "@/redux/store";
import axios from "axios";
import { groupBy } from "lodash";

export const getInboxMessages = async () => {
    const messages = await getMessages();
    let inboxMessages = [];
    for (let message of messages) {
        if (inboxMessages.length === 0) {
            inboxMessages.push(message);
        } else {
            let alreadyHasMessageType = false;
            for (let inbMessage of inboxMessages) {
                if (
                    inbMessage.itemID == message.itemID &&
                    inbMessage.participants.includes(message.to) &&
                    inbMessage.participants.includes(message.from)
                ) {
                    alreadyHasMessageType = true;
                    break;
                }
            }
            if (!alreadyHasMessageType) {
                inboxMessages.push(message);
            }
        }
    }
    inboxMessages;
    return inboxMessages;
};
export const getFocusedMessages = async () => {
    const { to, from, itemID } = store.getState().item.focusedMessage;
    const res = await axios.get(
        `/api/message?to=${to}&from=${from}&itemID=${itemID}`
    );
    res.data;
    return res.data;
};
export const getMessages = async () => {
    const userID = store.getState().account.user.userID;
    userID;
    const res = await axios.get(`/api/message?userID=${userID}`);
    res.data;
    return res.data;
};
export const sendMessage = async (
    to: string,
    itemID: string,
    content: string
) => {
    const userID = store.getState().account.user.userID;
    const res = await axios.post(
        `/api/message?to=${to}&from=${userID}&content=${content}&itemID=${itemID}`
    );
    return res.data;
};
