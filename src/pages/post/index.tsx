import {
    EmptyItem,
    Location,
    MarkItItem,
    setPostItem,
} from "@/redux/reducer/itemSlice";
import { RootState } from "@/redux/store";
import {
    Box,
    HStack,
    VStack,
    Input,
    Icon,
    Center,
    Heading,
    Image,
    SimpleGrid,
    Button,
    Text,
    Spinner,
    Divider,
    IconButton,
    Textarea,
    Card,
    CardBody,
    Select,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
    MdAddAPhoto,
    MdAddToPhotos,
    MdArrowBack,
    MdArrowForwardIos,
    MdCheck,
    MdCheckBox,
    MdClose,
    MdDelete,
    MdDone,
    MdHeight,
    MdLocationOn,
    MdLocationSearching,
    MdPublish,
    MdRemove,
    MdRemoveDone,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import Slider from "react-slick";
import axios from "axios";
import { useRouter } from "next/router";
import { postNewItem } from "@/services/item_service";
import { MarkItItemDisplay } from "../components/MarkItItemDisplay";
const Post = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const user = useSelector((state) => state.account.user);
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            if (!loggedIn) {
                router.push("/");
            } else {
                console.log(user);
            }
        }
        return () => {
            dispatch(setPostItem(EmptyItem));
        };
    }, [router.pathname]);
    return (
        <HStack spacing={0}>
            <PostDetailsForm />
            <PostPreview />
        </HStack>
    );
};

const PostPreview = () => {
    const postItem = useSelector<RootState, MarkItItem>(
        (state) => state.item.postItem
    );
    return (
        <Center flex={3} height={"100vh"} bg={"gray.100"}>
            <Card shadow={"lg"} w={"90%"} height={"80%"}>
                <CardBody
                    style={{ height: "100%" }}
                    display={"flex"}
                    flexFlow={"column nowrap"}
                >
                    <Heading size={"sm"} mb={4}>
                        Preview
                    </Heading>
                    <MarkItItemDisplay item={postItem} isPreview />
                </CardBody>
            </Card>
        </Center>
    );
};

const PostPhotoUpload = () => {
    const dispatch = useDispatch();
    const [photos, setPhotos] = useState<any[]>([]);
    const postItem = useSelector<RootState, MarkItItem>(
        (state) => state.item.postItem
    );
    let fileRef = useRef();

    const handleClick = () => {
        fileRef?.current?.click();
    };
    const handleChange = (e) => {
        const file = e.target.files[0];

        file && setPhotos([...photos, URL.createObjectURL(file)]);
    };

    useEffect(() => {
        dispatch(
            setPostItem({
                ...postItem,
                images: [...photos],
            })
        );
    }, [photos]);

    return (
        <Box w={"full"}>
            <Box mb={1}>
                <Text color={"blackAlpha.900"} fontSize={"sm"}>
                    Photos {photos.length}/10
                </Text>
            </Box>
            <SimpleGrid
                flexWrap={"wrap"}
                width={"full"}
                columns={photos.length > 0 ? 3 : 1}
                spacing={2}
            >
                {photos.map((p) => (
                    <UploadImage img={p} />
                ))}
                <Center
                    bg={"gray.100"}
                    padding={4}
                    width={"100%"}
                    onClick={handleClick}
                    borderRadius={5}
                    cursor={"pointer"}
                    aspectRatio={photos.length > 1 ? 1 : "auto"}
                    border={"1px dashed rgba(0,0,0,.1)"}
                >
                    <VStack>
                        <Icon as={MdAddAPhoto} />
                        <Heading fontSize={14}>Add Photos</Heading>
                    </VStack>
                </Center>
            </SimpleGrid>

            <Input
                ref={fileRef}
                onChange={handleChange}
                type={"file"}
                display={"none"}
            />
        </Box>
    );
};
const UploadImage = (props: { img: any }) => {
    return (
        <Box position={"relative"}>
            <Image
                fallback={
                    <Center w={"full"} height={"full"}>
                        <Spinner color={"blackAlpha.200"} />
                    </Center>
                }
                src={props.img}
                aspectRatio={1}
                width={"100%"}
                borderRadius={5}
                objectFit={"cover"}
            />
            <Button
                position={"absolute"}
                top={1}
                right={1}
                size={"xs"}
                aspectRatio={1}
                borderRadius={"full"}
                bg={"whiteAlpha.700"}
            >
                <Icon as={MdClose} boxSize={4} color={"blackAlpha.700"} />
            </Button>
        </Box>
    );
};
const PostDetailsForm = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const dispatch = useDispatch();
    const postItem = useSelector<RootState, MarkItItem>(
        (state) => state.item.postItem
    );
    const user = useSelector<RootState, MarkItItem>(
        (state) => state.account.user
    );
    const getCategories = async () => {
        const res = await axios.get("/api/category");
        setCategories([...res.data]);
    };

    useEffect(() => {
        updateUserID();
        getCategories();
    }, []);
    useEffect(() => {
        console.log(postItem);
    }, [postItem]);
    const updatePostItem = (field: string, newValue: any) => {
        const newPostItem = {
            ...postItem,
            [field]: newValue,
        };
        dispatch(setPostItem(newPostItem));
    };
    const updateUserID = () => updatePostItem("userID", user.userID);
    const updateTitle = (e: any) => updatePostItem("title", e.target.value);
    const updatePrice = (e: any) => updatePostItem("price", e.target.value);
    const updateDescription = (e: any) =>
        updatePostItem("description", e.target.value);
    const updateCategory = (e: any) =>
        updatePostItem("category", e.target.value);
    return (
        <VStack
            spacing={0}
            align={"flex-start"}
            shadow={"lg"}
            flex={"0 1 400px"}
            maxH={"100vh"}
        >
            <HStack
                w={"full"}
                padding={4}
                spacing={4}
                borderBottom={"1px solid rgba(0,0,0,.1)"}
            >
                <IconButton
                    as={Link}
                    href={"/"}
                    size={"sm"}
                    icon={<Icon as={MdArrowBack} />}
                    aria-label="Back to home"
                />

                <Heading size={"md"}>Post New Listing</Heading>
            </HStack>
            <Box flex={1} padding={4} overflowY={"scroll"} height={"100%"}>
                <VStack spacing={4}>
                    <Box w={"full"}>
                        <Box w={"full"}>
                            <Heading size={"sm"}>Product Images</Heading>
                        </Box>
                        <PostPhotoUpload />
                    </Box>
                    <Box w={"full"} mt={4}>
                        <Heading size={"sm"} mb={1}>
                            Basic Information
                        </Heading>
                        <Text fontSize={14} color={"blackAlpha.700"} mb={2}>
                            Please be as descriptive as possible and respect
                            MarkIt Community Guidelines.
                        </Text>
                        <VStack w={"full"}>
                            <Input
                                placeholder={"Title"}
                                value={postItem.title}
                                onChange={updateTitle}
                            ></Input>
                            <Input
                                onChange={updatePrice}
                                value={postItem.price}
                                placeholder={"Price"}
                                type={"number"}
                            ></Input>
                            <Input placeholder={"Condition"}></Input>
                            <Select
                                placeholder={"Category"}
                                onChange={updateCategory}
                            >
                                {categories.map((c) => (
                                    <option value={c.name}>{c.name}</option>
                                ))}
                            </Select>
                        </VStack>
                    </Box>
                    <Box w={"full"} mt={4}>
                        <Heading size={"sm"} mb={1}>
                            Location
                        </Heading>
                        <LocationButton />
                    </Box>

                    <Box w={"full"} mt={4}>
                        <Heading size={"sm"} mb={2}>
                            Additional Details
                        </Heading>
                        <VStack w={"full"}>
                            <Textarea
                                placeholder="Description"
                                size={"md"}
                                onChange={updateDescription}
                                value={postItem.description}
                            ></Textarea>
                            <Input placeholder={"SKU"}></Input>
                        </VStack>
                    </Box>
                </VStack>
            </Box>
            <Box padding={4} w={"100%"} borderTop={"1px solid rgba(0,0,0,.1)"}>
                <Button
                    size={"md"}
                    w={"100%"}
                    colorScheme={"messenger"}
                    leftIcon={<MdPublish />}
                    onClick={postNewItem}
                >
                    Publish
                </Button>
            </Box>
        </VStack>
    );
};

const LocationButton = () => {
    const dispatch = useDispatch();
    const postItem = useSelector<RootState, MarkItItem>(
        (state) => state.item.postItem
    );
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<Location | null>(null);
    const requestLocation = () => {
        if ("geolocation" in navigator) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition((pos) => {
                console.log(pos);
                setLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
                setLoading(false);
            });
        }
    };
    useEffect(() => {
        location &&
            dispatch(
                setPostItem({
                    ...postItem,
                    location: location,
                })
            );
    }, [location]);
    return (
        <Button
            variant={"solid"}
            w={"full"}
            leftIcon={<Icon as={!location ? MdLocationOn : MdDone} />}
            onClick={requestLocation}
            colorScheme={"gray"}
            isLoading={loading}
            size={"md"}
            fontWeight={500}
        >
            {location ? "Location Added" : "Allow Location"}
        </Button>
    );
};
export default Post;
