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
    MdShare,
} from "react-icons/md";
import moment from "moment";
import Link from "next/link";
import { deleteLikeItem, isItemLiked, likeItem } from "@/services/item_service";
import { useSelector } from "react-redux";

export const MarkItItemDisplay = (props: {
    item: MarkItItem;
    isPreview: boolean | undefined;
}) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [useSmallLayout] = useMediaQuery("(max-width: 1100px)");
    const loggedIn = useSelector((state) => state.account.loggedIn);
    return (
        <Card flex={1} overflow={"hidden"} w={"full"} h={"full"}>
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
                        ></Image>
                    </Box>
                    {!props.isPreview && (
                        <IconButton
                            as={Link}
                            href={"/"}
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
                                    index === selectedImage && "brightness(90%)"
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
                    <VStack align={"flex-start"} spacing={1} height={"100%"}>
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
                            {loggedIn && (
                                <LikeButton itemID={props.item.itemID} />
                            )}
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
                        <VStack w={"full"}>
                            <Button
                                w={"full"}
                                colorScheme={"messenger"}
                                isDisabled={props.isPreview}
                            >
                                Make an Offer
                            </Button>
                            <Button w={"full"} isDisabled={props.isPreview}>
                                Message Seller
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            </Stack>
        </Card>
    );
};

const LikeButton = (props: { itemID: string }) => {
    const [isLiked, setIsLiked] = useState<boolean | null>(null);
    const loggedIn = useSelector((state) => state.account.loggedIn);

    const checkIsLiked = async () => {
        const initLiked = await isItemLiked(props.itemID);
        setIsLiked(initLiked);
    };
    useEffect(() => {
        if (loggedIn) checkIsLiked();
    }, [props.itemID, loggedIn]);

    const handleLike = async () => {
        setIsLiked(true);
        await likeItem(props.itemID);
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
const ItemActionButton = (props: {
    active?: boolean;
    children?: ReactNode | string;
    icon?: any;
    onClick?: any;
    fit?: any;
}) => {
    return (
        <Button
            variant={"solid"}
            onClick={props.onClick}
            leftIcon={<Icon as={props.icon} />}
            colorScheme={props.active ? "messenger" : "gray"}
            flex={!props.fit ? 1 : 0}
            size={"md"}
        >
            {props.children}
        </Button>
    );
};
export default MarkItItemDisplay;
