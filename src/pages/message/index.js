import { HStack, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { MessageInbox, Messager } from "../../components/MessageInbox";

const Message = () => {
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const focusedMessage = useSelector((state) => state.item.focusedMessage);
    return loggedIn ? (
        <>
            <Head>
                <title> Message</title>
            </Head>
            <VStack height={"full"} w={"full"} align={"flex-start"}>
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
