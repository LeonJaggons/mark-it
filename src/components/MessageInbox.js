import {
    Box,
    Card,
    HStack,
    Heading,
    VStack,
    Text,
    Spinner,
    Image,
    Input,
    Button,
    IconButton,
    Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
    getFocusedMessages,
    getInboxMessages,
    sendMessage,
} from "../services/message_service";
import { getItemByID } from "../services/item_service";
import { useDispatch, useSelector } from "react-redux";
import { MdMoreHoriz, MdSend } from "react-icons/md";
import { setFocusedMessage } from "@/redux/reducer/itemSlice";
import { filter } from "lodash";

export const Messager = () => {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const user = useSelector((state) => state.account.user);
    const focusedMessage = useSelector((state) => state.item.focusedMessage);
    const loadFocusedMessages = async () => {
        const newMsgs = await getFocusedMessages();
        setMessages([...newMsgs]);
    };
    useEffect(() => {
        focusedMessage && loadFocusedMessages();
    }, [focusedMessage]);
    const handleSendMessage = async () => {
        const to = filter(
            messages[0].participants,
            (e) => e !== user.userID
        )[0];
        const itemID = messages[0].itemID;
        const newMessage = await sendMessage(to, itemID, content);
        setMessages([...messages, newMessage]);
        setContent("");
    };
    const handleUpdateContent = (e) => setContent(e.target.value);
    return (
        <Box flex={1} h={"full"}>
            <Card height={"full"} w={"full"}>
                <VStack w={"full"} h={"full"} align={"flex-start"} spacing={1}>
                    <Box
                        p={4}
                        w={"full"}
                        borderBottom={"1px solid rgba(0,0,0,.05)"}
                    >
                        <HStack align={"center"} justify={"space-between"}>
                            <span />
                            <IconButton icon={<Icon as={MdMoreHoriz} />} />
                        </HStack>
                    </Box>
                    <VStack
                        w={"full"}
                        p={4}
                        flex={1}
                        overflowY={"scroll"}
                        maxH={"100vh"}
                    >
                        {messages.map((m) => (
                            <Chatbox message={m} />
                        ))}
                    </VStack>
                    <Box
                        p={4}
                        w={"full"}
                        borderTop={"1px solid rgba(0,0,0,.05)"}
                    >
                        <HStack>
                            <Input
                                value={content}
                                onChange={handleUpdateContent}
                                variant={"unstyled"}
                                placeholder="Type your message.."
                            />
                            <IconButton
                                variant={"ghost"}
                                colorScheme={"messenger"}
                                icon={<Icon as={MdSend} />}
                                onClick={handleSendMessage}
                            />
                        </HStack>
                    </Box>
                </VStack>
            </Card>
        </Box>
    );
};
const Chatbox = (props) => {
    const user = useSelector((state) => state.account.user);
    const [isSent, setIsSent] = useState(false);
    useEffect(() => {
        setIsSent(user.userID === props.message.from);
    }, [props.message, user]);
    return (
        <HStack w={"full"} justify={isSent ? "flex-end" : "flex-start"}>
            <Box
                p={3}
                px={4}
                backgroundColor={isSent ? "messenger.500" : "gray.200"}
                borderRadius={10}
            >
                <Text color={isSent ? "whiteAlpha.900" : "black"}>
                    {props.message.content}
                </Text>
            </Box>
        </HStack>
    );
};
export const MessageInbox = () => {
    const [messages, setMessages] = useState([]);
    const loadMessages = async () => {
        const msgs = await getInboxMessages();
        setMessages([...msgs]);
    };
    useEffect(() => {
        loadMessages();
    }, []);
    return (
        <Card height={"full"} padding={0} w={"300px"}>
            <VStack w={"full"} p={4} align={"flex-start"}>
                <HStack justify={"space-between"} w={"full"}>
                    <Heading size={"md"}>Messages</Heading>
                    <IconButton
                        icon={<Icon as={MdMoreHoriz} />}
                        variant={"ghost"}
                    />
                </HStack>
                <Input />
            </VStack>
            <VStack w={"full"} spacing={1} p={2}>
                {messages.map((m) => (
                    <InboxItem message={m} />
                ))}
            </VStack>
        </Card>
    );
};
const InboxItem = (props) => {
    const [item, setItem] = useState();
    const focusedMessage = useSelector((state) => state.item.focusedMessage);
    const [focused, setFocused] = useState(false);
    const loadItem = async () => {
        const itemData = await getItemByID(props.message.itemID);
        console.log(itemData);
        setItem({ ...itemData });
    };
    const user = useSelector((state) => state.account.user);
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(setFocusedMessage(props.message));
    };
    useEffect(() => {
        loadItem();
    }, []);
    useEffect(() => {
        setFocused(
            focusedMessage &&
                focusedMessage.to === props.message.to &&
                focusedMessage.from === props.message.from &&
                focusedMessage.itemID === props.message.itemID
        );
    }, [focusedMessage]);
    return (
        <Box
            as={Button}
            onClick={handleClick}
            colorScheme={"gray"}
            color={"black"}
            variant={"ghost"}
            p={2}
            px={4}
            borderRadius={5}
            w={"full"}
            display={"flex"}
            h={"auto"}
            background={focused && "messenger.50"}
        >
            {item ? (
                <HStack flex={1} spacing={3} h={"60px"} align={"center"}>
                    <Image
                        src={item.images[0]}
                        w={"60px"}
                        objectFit={"cover"}
                        borderRadius={"30px"}
                        aspectRatio={1}
                    />

                    <VStack
                        h={"full"}
                        justify={"center"}
                        align={"flex-start"}
                        spacing={0}
                    >
                        <Heading size={"xs"}>{item.title}</Heading>
                        <Box my={0.5}></Box>
                        <Text fontWeight={400} fontSize={13}>
                            {props.message.from === user.userID ? "You: " : ""}
                            {props.message.content}
                        </Text>
                    </VStack>
                </HStack>
            ) : (
                <VStack h={"48px"}>
                    <Spinner color={"gray.400"} />
                </VStack>
            )}
        </Box>
    );
};
