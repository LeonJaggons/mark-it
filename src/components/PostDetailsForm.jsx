import { setPostItem } from "@/redux/reducer/itemSlice";
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
    MdArrowBack,
    MdClose,
    MdDone,
    MdLocationOn,
    MdPublish,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { postNewItem } from "@/services/item_service";
import { MarkItItemDisplay } from "./MarkItItemDisplay";

export const PostPreview = () => {
    const postItem = useSelector((state) => state.item.postItem);
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
    const [photos, setPhotos] = useState([]);
    const postItem = useSelector((state) => state.item.postItem);
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
const UploadImage = (props) => {
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
export const PostDetailsForm = () => {
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();
    const postItem = useSelector((state) => state.item.postItem);
    const user = useSelector((state) => state.account.user);
    const getCategories = async () => {
        const res = await axios.get("/api/category");
        setCategories([...res.data]);
    };

    useEffect(() => {
        updateUserID();
        getCategories();
    }, []);
    useEffect(() => {
        postItem;
    }, [postItem]);
    const updatePostItem = (field, newValue) => {
        const newPostItem = {
            ...postItem,
            [field]: newValue,
        };
        dispatch(setPostItem(newPostItem));
    };
    const updateUserID = () => updatePostItem("userID", user?.userID);
    const updateTitle = (e) => updatePostItem("title", e.target.value);
    const updatePrice = (e) => updatePostItem("price", e.target.value);
    const updateDescription = (e) =>
        updatePostItem("description", e.target.value);
    const updateCategory = (e) => updatePostItem("category", e.target.value);
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
    const postItem = useSelector((state) => state.item.postItem);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const requestLocation = () => {
        if ("geolocation" in navigator) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition((pos) => {
                pos;
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
