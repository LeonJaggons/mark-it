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
    Center,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
    getFocusedMessages,
    getInboxMessages,
    sendMessage,
} from "../services/message_service";
import { getItemByID } from "../services/item_service";
import { useDispatch, useSelector } from "react-redux";
import { MdMoreHoriz, MdSearch, MdSend } from "react-icons/md";
import { setFocusedMessage } from "@/redux/reducer/itemSlice";
import { filter } from "lodash";
import Scrollbars from "react-custom-scrollbars-2";
import Link from "next/link";

export const Messager = () => {
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const user = useSelector((state) => state.account.user);
    const focusedMessage = useSelector((state) => state.item.focusedMessage);
    const loadFocusedMessages = async () => {
        setLoading(true);
        const newMsgs = await getFocusedMessages();
        if (newMsgs && newMsgs.length > 0) {
            const item = await getItemByID(newMsgs[0].itemID);
            setItem(item);
        }
        setMessages([...newMsgs]);
        setLoading(false);
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
    return loading ? (
        <Card height={"full"} flex={1}>
            <Center flex={1} h={"full"}>
                <Spinner />
            </Center>
        </Card>
    ) : (
        <Box flex={1} h={"full"}>
            <Card height={"full"} w={"full"}>
                <VStack w={"full"} h={"full"} align={"flex-start"} spacing={0}>
                    <Box
                        p={4}
                        w={"full"}
                        borderBottom={"1px solid rgba(0,0,0,.05)"}
                    >
                        <HStack align={"center"} justify={"space-between"}>
                            {item && (
                                <HStack
                                    borderRadius={5}
                                    as={Link}
                                    href={`/item?id=${item?.itemID}`}
                                >
                                    {/* <Image
                                        src={item?.images[0]}
                                        boxSize={"40px"}
                                        borderRadius={5}
                                        objectFit={"cover"}
                                        mr={1}
                                    /> */}
                                    <Box>
                                        <Heading
                                            size={"sm"}
                                            mb={1}
                                            fontWeight={700}
                                        >
                                            {item?.title}
                                        </Heading>
                                        <Heading
                                            size={"xs"}
                                            fontWeight={500}
                                            color={"gray.800"}
                                        >
                                            ${item?.price}
                                        </Heading>
                                    </Box>
                                </HStack>
                            )}
                            <IconButton
                                icon={<Icon as={MdMoreHoriz} />}
                                variant={"ghost"}
                                onClick={(e) => e.preventDefault()}
                            />
                        </HStack>
                    </Box>
                    <Box flex={"1 1 0px"} overflowY={"scroll"} w={"full"}>
                        <VStack w={"full"} p={4} spacing={1}>
                            {messages.map((m) => (
                                <Chatbox message={m} key={m.messageID} />
                            ))}
                        </VStack>
                    </Box>
                    <Box
                        p={4}
                        py={1}
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
                maxW={"55%"}
                p={2}
                px={4}
                backgroundColor={isSent ? "messenger.500" : "gray.200"}
                borderRadius={10}
            >
                <Text color={isSent ? "whiteAlpha.900" : "black"} fontSize={14}>
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
            <Box w={"full"} p={4} align={"flex-start"} pb={0}>
                <HStack justify={"space-between"} w={"full"}>
                    <Heading size={"md"}>Messages</Heading>
                    <IconButton
                        icon={<Icon as={MdMoreHoriz} />}
                        variant={"ghost"}
                    />
                </HStack>
                <InputGroup>
                    <Input
                        py={0}
                        fontSize={12}
                        size={"sm"}
                        placeholder={"Search"}
                        borderRadius={5}
                        variant={"filled"}
                        border={"none"}
                        _focus={{
                            border: "none",
                            backgroundColor: "gray.200",
                        }}
                    />
                </InputGroup>
            </Box>
            <VStack w={"full"} spacing={1} p={4} pt={2}>
                {messages.map((m) => (
                    <InboxItem message={m} key={"CHAT-" + m.messageID} />
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
            _hover={{
                backgroundColor: focused ? "messenger.400" : "gray.200",
            }}
            background={focused && "messenger.500"}
        >
            {item ? (
                <HStack
                    flex={1}
                    spacing={3}
                    h={"60px"}
                    align={"center"}
                    color={focused ? "white" : "black"}
                >
                    <Image
                        src={item.images[0]}
                        w={"50px"}
                        objectFit={"cover"}
                        borderRadius={"30px"}
                        aspectRatio={1}
                    />

                    <VStack
                        h={"full"}
                        justify={"center"}
                        align={"flex-start"}
                        spacing={0}
                        flex={1}
                        overflowX={"hidden"}
                    >
                        <Heading size={"xs"}>{item.title}</Heading>
                        <Box my={0.5}></Box>
                        <Text
                            w={"170px"}
                            fontWeight={400}
                            fontSize={12}
                            whiteSpace={"nowrap"}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            textAlign={"start"}
                        >
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
