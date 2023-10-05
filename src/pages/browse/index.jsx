import { Inter } from "next/font/google";
import {
    SimpleGrid,
    Box,
    HStack,
    Skeleton,
    Center,
    Spinner,
    Heading,
    VStack,
    Icon,
    Button,
} from "@chakra-ui/react";
import { MdSearchOff } from "react-icons/md";
import { useEffect, useState } from "react";
import { setSelectedCategory } from "@/redux/reducer/itemSlice";
import { getAllItems, getItemsByCategory } from "@/services/item_service";
import { useDispatch, useSelector } from "react-redux";
import { BrowseFilters, PostButton } from "@/components/BrowseFilters";
import { BrowseItem } from "@/components/BrowseItem";
import { setAppLocation } from "@/redux/reducer/appSlice";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState();
    const [items, setItems] = useState([]);
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const dispatch = useDispatch();
    const loadItems = async (newCategory = null) => {
        setLoading(true);
        let newItems;
        if (newCategory) {
            newItems = await getItemsByCategory(newCategory);
        } else {
            newItems = await getAllItems();
        }
        console.log(newItems);
        setItems([...newItems]);
        setLoading(false);
    };
    const requestLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                console.log(pos);
                dispatch(
                    setAppLocation({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    })
                );
            });
        }
    };
    useEffect(() => {
        requestLocation();
        if (router.isReady) {
            loadItems(router.query.category);
        }
        return () => {
            setItems(null);
        };
    }, []);
    const user = useSelector((state) => state.account.user);
    useEffect(() => {
        setItems(null);
        loadItems(category);
    }, [user, category]);

    useEffect(() => {
        if (router.isReady) {
            setCategory(router.query.category);
        }
    }, [router]);

    useEffect(() => {
        if (category) {
            dispatch(setSelectedCategory(category));

            loadItems(category);
        }
    }, [category]);
    return (
        <HStack
            align={"flex-start"}
            style={{ padding: "18px 7vw", height: "100%" }}
            position={"relative"}
            spacing={4}
        >
            {items && items.length > 0 && (
                <Box flex={"0 1 280px"} h={"full"} position={"relative"}>
                    <BrowseFilters />
                </Box>
            )}
            {loading ? (
                <Center flex={1} height={"full"}>
                    <Spinner />
                </Center>
            ) : items && items.length > 0 ? (
                <Box flex={1}>
                    {items && category && (
                        <Heading size={"lg"} mb={4}>
                            {category}
                        </Heading>
                    )}
                    <SimpleGrid columns={[1, 2, 4, 5]} spacing={4}>
                        {items.map((i) => (
                            <BrowseItem item={i} fromSaved={false} />
                        ))}
                    </SimpleGrid>
                </Box>
            ) : (
                <VStack
                    alignItems={"flex-start"}
                    flex={1}
                    w={"full"}
                    h={"full"}
                >
                    {items && category && (
                        <Heading size={"lg"} mb={4}>
                            {category}
                        </Heading>
                    )}
                    <Center flex={1} w={"full"} pb={"150px"}>
                        <VStack>
                            <Icon as={MdSearchOff} boxSize={20} />
                            <Heading>No search results</Heading>
                            <Button
                                onClick={() => router.push("/browse")}
                                mt={2}
                                variant={"link"}
                                size={"lg"}
                                colorScheme="messenger"
                            >
                                Back to browse
                            </Button>
                        </VStack>
                    </Center>
                </VStack>
            )}
            {loggedIn && <PostButton />}
        </HStack>
    );
}
