import { BrowseItem } from "@/components/BrowseItem";
import { setAppLocation } from "@/redux/reducer/appSlice";
import { setSelectedCategory } from "@/redux/reducer/itemSlice";
import { BrowseFilters } from "@/components/BrowseFilters";
import { getAllItems, getItemsByCategory } from "@/services/item_service";
import {
    Box,
    Button,
    Center,
    HStack,
    Heading,
    Icon,
    SimpleGrid,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdArrowBackIos, MdSearchOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
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
        newItems;
        setItems([...newItems]);
        setLoading(false);
    };
    const requestLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                pos;
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
    }, []);
    const user = useSelector((state) => state.account.user);
    useEffect(() => {
        // setItems(null);
        loadItems(category);
    }, [user, category]);

    useEffect(() => {
        if (router.isReady) {
            const cat = router.query.category;
            setCategory(cat);
        }
    }, [router]);

    useEffect(() => {
        if (category) {
            dispatch(setSelectedCategory(category));

            loadItems(category);
        }
    }, [category]);
    return (
        <>
            <Head>
                <title>
                    Browse {category && "•"} {category}
                </title>
            </Head>
            <Box pt={0} h={"full"} w={"full"}>
                <HStack alignItems={"flex-start"} w={"full"}>
                    <BrowseFilters />
                    <VStack h={"full"} flex={1} align={"flex-start"}>
                        {items && !loading ? (
                            <Box flex={1} w={"full"}>
                                {items.length > 0 ? (
                                    <ItemsGrid items={items} />
                                ) : (
                                    <NoResultsScreen />
                                )}
                            </Box>
                        ) : (
                            <LoadingScreen />
                        )}
                    </VStack>
                </HStack>
            </Box>
        </>
    );
}

// {items && category && (
//     <Heading size={"lg"} mb={4}>
//         {category}
//     </Heading>
// )}

const ItemsGrid = ({ items }) => {
    return (
        <Box flex={1} w={"full"}>
            <SimpleGrid columns={[1, 1, 3, 4]} spacing={4} w={"full"}>
                {items.map((i) => (
                    <BrowseItem item={i} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

const NoResultsScreen = ({}) => {
    const router = useRouter();
    return (
        <Center flex={1} w={"full"} p={8} h={"80vh"}>
            <VStack textAlign={"center"}>
                <Center
                    w={"200px"}
                    aspectRatio={1}
                    bg={"gray.100"}
                    mb={8}
                    borderRadius={"100px"}
                >
                    <Icon
                        as={MdSearchOff}
                        boxSize={"130px"}
                        color={"gray.500"}
                    />
                </Center>
                <VStack spacing={4}>
                    <Heading fontWeight={600}>No results found</Heading>
                    <Heading size={"sm"} fontWeight={400}>
                        Try adjusting your search or filter to find what you're
                        looking for.
                    </Heading>
                    <Button
                        onClick={() => router.push("/browse")}
                        mt={2}
                        leftIcon={<Icon as={MdArrowBackIos} />}
                        variant={"link"}
                        size={"md"}
                        colorScheme="messenger"
                    >
                        Back to Browse
                    </Button>
                </VStack>
            </VStack>
        </Center>
    );
};
const LoadingScreen = () => {
    return (
        <Center height={"80vh"} w={"full"}>
            <Spinner />
        </Center>
    );
};
