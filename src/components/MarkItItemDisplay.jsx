import { MarkItItem } from "@/redux/reducer/itemSlice";
import GoogleMapReact from "google-map-react";
import {
    Box,
    HStack,
    VStack,
    Icon,
    Heading,
    Image,
    Button,
    Text,
    Card,
    Tag,
    IconButton,
    useMediaQuery,
    Stack,
    Modal,
    ModalBody,
    Textarea,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
import {
    MdApps,
    MdArrowBack,
    MdBookmark,
    MdBookmarkAdd,
    MdBookmarkRemove,
    MdIosShare,
    MdMoreHoriz,
    MdSend,
    MdShare,
} from "react-icons/md";
import moment from "moment";
import Link from "next/link";
import { deleteLikeItem, isItemLiked, likeItem } from "@/services/item_service";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "@/services/message_service";
import { toggleShowLogin } from "@/redux/reducer/appSlice";

export const MarkItItemDisplay = (props) => {
    const [showMessage, setShowMessage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [useSmallLayout] = useMediaQuery("(max-width: 1100px)");
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const user = useSelector((state) => state.account.user);
    const openMessage = () => setShowMessage(true);
    const closeMessage = () => setShowMessage(false);
    return (
        <Box>
            <Box
                flex={1}
                w={"full"}
                // border={"1px solid rgba(0,0,0,.1)"}
                shadow={"none"}
                h={"calc(100vh - 80px)"}
            >
                <Stack
                    direction={useSmallLayout ? "column" : "row"}
                    flex={2}
                    height={"100%"}
                >
                    <VStack
                        flex={3}
                        height={"100%"}
                        w={"full"}
                        align={"flex-start"}
                        position={"relative"}
                    >
                        <Box flexGrow={1} position={"relative"}>
                            <Image
                                src={props.item.images[selectedImage]}
                                objectFit={"cover"}
                                w={"full"}
                                height={"full"}
                                borderRadius={5}
                            ></Image>
                        </Box>
                        {!props.isPreview && (
                            <IconButton
                                as={Link}
                                href={
                                    props.fromSaved && props.fromSaved == "true"
                                        ? "/saved"
                                        : "/"
                                }
                                aria-label="Back to browse"
                                icon={<Icon as={MdArrowBack} />}
                                position={"absolute"}
                                top={2}
                                left={2}
                            />
                        )}
                        <HStack
                            position={"absolute"}
                            bottom={2}
                            alignSelf={"center"}
                            overflowX={"scroll"}
                            padding={2}
                            backgroundColor={"blackAlpha.600"}
                            borderRadius={5}
                        >
                            {props.item.images.map((i, index) => (
                                <Image
                                    filter={
                                        index === selectedImage &&
                                        "brightness(90%)"
                                    }
                                    borderWidth={index === selectedImage && 2}
                                    borderColor={"messenger.600"}
                                    borderStyle={"solid"}
                                    borderRadius={5}
                                    src={i}
                                    cursor={"pointer"}
                                    height={"55px"}
                                    aspectRatio={1}
                                    objectFit={"cover"}
                                    onClick={() => setSelectedImage(index)}
                                />
                            ))}
                        </HStack>
                    </VStack>
                    <Box flex={2} padding={4} height={"100%"}>
                        <VStack
                            align={"flex-start"}
                            spacing={1}
                            height={"100%"}
                        >
                            <Heading size={"lg"}>
                                {props.item.title ? props.item.title : "Title"}
                            </Heading>
                            <Heading size={"md"} fontWeight={700} my={1}>
                                {props.item.price
                                    ? `$${props.item.price}`
                                    : `Price`}
                            </Heading>
                            <Heading
                                size={"xs"}
                                fontWeight={400}
                                color={"blackAlpha.800"}
                                mb={2}
                            >
                                Posted {moment().format("MMMM D, YYYY")}
                            </Heading>
                            {props.item.category && (
                                <Tag p={2} variant={"outline"}>
                                    <Icon as={MdApps} mr={2} />
                                    <Heading
                                        size={"xs"}
                                        fontWeight={600}
                                        color={"blackAlpha.800"}
                                    >
                                        {props.item.category}
                                    </Heading>
                                </Tag>
                            )}
                            <HStack my={4} w={"full"}>
                                <LikeButton itemID={props.item.itemID} />
                                <ShareButton />
                                <MoreButton />
                            </HStack>

                            <Heading size={"sm"}>Description</Heading>
                            <Text fontSize={14}>{props.item.description}</Text>

                            <Heading size={"sm"} mt={4}>
                                Location
                            </Heading>
                            {props.item.location && (
                                <div
                                    style={{
                                        height: 180,
                                        width: "100%",
                                        borderRadius: 5,
                                        overflow: "hidden",
                                    }}
                                >
                                    <GoogleMapReact
                                        defaultCenter={{
                                            lat: props.item.location.latitude,
                                            lng: props.item.location.longitude,
                                        }}
                                        options={{
                                            fullscreenControl: false,
                                            zoomControl: false,
                                            panControl: false,
                                            gestureHandling: "none",
                                        }}
                                        zoom={15}
                                    />
                                </div>
                            )}
                            <Box flex={1} />
                            {user && user.userID !== props.item.userID && (
                                <VStack w={"full"}>
                                    {/* <Button
                                    w={"full"}
                                    colorScheme={"messenger"}
                                    isDisabled={props.isPreview}
                                >
                                    Make an Offer
                                </Button> */}
                                    <Button
                                        w={"full"}
                                        isDisabled={props.isPreview}
                                        onClick={openMessage}
                                        colorScheme={"messenger"}
                                    >
                                        Message Seller
                                    </Button>
                                    <MessageSellerModal
                                        visible={showMessage}
                                        item={props.item}
                                        close={closeMessage}
                                    />
                                </VStack>
                            )}
                        </VStack>
                    </Box>
                </Stack>
            </Box>
            <Heading mt={6}>More Content</Heading>
        </Box>
    );
};

const MessageSellerModal = (props) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSendMessage = async () => {
        setLoading(true);
        const to = props.item.userID;
        const itemID = props.item.itemID;
        await sendMessage(to, itemID, content);
        setLoading(false);
        props.close();
    };
    useEffect(() => {
        props.item;
    }, []);
    const handleUpdateContent = (e) => {
        setContent(e.target.value);
    };
    return (
        <Modal isOpen={props.visible} onClose={props.close} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalBody p={0}>
                    <HStack
                        p={4}
                        borderBottom={"1px solid rgba(0,0,0,.05)"}
                        align={"center"}
                    >
                        <Heading size={"md"}>Message</Heading>
                    </HStack>
                    <VStack w={"full"} align={"flex-start"} p={4}>
                        <HStack mb={6}>
                            <Image
                                borderRadius={5}
                                src={props.item.images[0]}
                                w={"60px"}
                                objectFit={"cover"}
                                aspectRatio={1}
                            />
                            <VStack align={"flex-start"}>
                                <Heading size={"sm"}>
                                    {props.item.title}
                                </Heading>
                                <Heading size={"xs"} fontWeight={400}>
                                    ${props.item.price}
                                </Heading>
                            </VStack>
                        </HStack>
                        <Textarea
                            value={content}
                            onChange={handleUpdateContent}
                            placeholder={"Type your message..."}
                        />
                    </VStack>
                    <HStack
                        p={4}
                        borderTop={"1px solid rgba(0,0,0,.05)"}
                        align={"center"}
                        justify={"flex-end"}
                    >
                        <Button flex={1}>Cancel</Button>
                        <Button
                            onClick={handleSendMessage}
                            isDisabled={!content || content.trim() === ""}
                            isLoading={loading}
                            flex={1}
                            colorScheme={"messenger"}
                            rightIcon={<Icon as={MdSend} />}
                        >
                            Send message
                        </Button>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

const LikeButton = (props) => {
    const [isLiked, setIsLiked] = useState(null);
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const user = useSelector((state) => state.account.user);
    const dispatch = useDispatch();
    const checkIsLiked = async () => {
        const initLiked = await isItemLiked(props.itemID);
        setIsLiked(initLiked);
    };
    useEffect(() => {
        if (loggedIn) checkIsLiked();
    }, [props.itemID, loggedIn]);

    const handleLike = async () => {
        if (user) {
            setIsLiked(true);
            await likeItem(props.itemID);
        } else {
            dispatch(toggleShowLogin());
        }
    };
    const handleDislike = async () => {
        setIsLiked(false);
        await deleteLikeItem(props.itemID);
    };
    const toggleLiked = () => {
        if (isLiked == null) {
            handleLike();
        } else {
            if (isLiked) {
                handleDislike();
            } else {
                handleLike();
            }
        }
    };
    return (
        <ItemActionButton
            onClick={toggleLiked}
            icon={!isLiked ? MdBookmarkAdd : MdBookmarkRemove}
            active={isLiked}
        >
            Like
        </ItemActionButton>
    );
};

const ShareButton = () => {
    return <ItemActionButton icon={MdShare}>Share</ItemActionButton>;
};
const MoreButton = () => {
    return <ItemActionButton icon={MdMoreHoriz} fit />;
};
const ItemActionButton = (props) => {
    return (
        <Button
            variant={"solid"}
            onClick={props.onClick}
            leftIcon={<Icon as={props.icon} />}
            colorScheme={props.active ? "messenger" : "gray"}
            flex={!props.fit ? 1 : 0}
            size={"sm"}
        >
            {props.children}
        </Button>
    );
};
export default MarkItItemDisplay;
