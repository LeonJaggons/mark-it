import { HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { getMessages } from "../../services/message_service";
import { useSelector } from "react-redux";
import { MessageInbox, Messager } from "../../components/MessageInbox";
import Head from "next/head";

const Message = () => {
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const focusedMessage = useSelector((state) => state.item.focusedMessage);
    return loggedIn ? (
        <>
            <Head>
                <title> Message</title>
            </Head>
            <VStack
                paddingX={"7vw"}
                paddingY={"18px"}
                height={"full"}
                w={"full"}
                align={"flex-start"}
            >
                <HStack flex={1} w={"full"}>
                    <MessageInbox />
                    {focusedMessage && <Messager />}
                </HStack>
            </VStack>
        </>
    ) : (
        <></>
    );
};
export default Message;
