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
import { MdArrowBackIos, MdSearchOff } from "react-icons/md";
import { useEffect, useState } from "react";
import { setSelectedCategory } from "@/redux/reducer/itemSlice";
import { getAllItems, getItemsByCategory } from "@/services/item_service";
import { useDispatch, useSelector } from "react-redux";
import { BrowseFilters, PostButton } from "@/components/BrowseFilters";
import { BrowseItem } from "@/components/BrowseItem";
import { setAppLocation } from "@/redux/reducer/appSlice";
import { useRouter } from "next/router";
import Head from "next/head";
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
        if (router.isReady) {
            loadItems(router.query.category);
        }
        return () => {
            setItems(null);
            setCategory(null);
            dispatch(setSelectedCategory());
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
            setItems(null);
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
            <Box ml={4} pt={0} h={"full"}>
                {loading ? (
                    <LoadingScreen />
                ) : (
                    <VStack h={"full"} flex={1} align={"flex-start"}>
                        {/* {category && (
                            <Heading size={"lg"} mb={2}>
                                {category}
                            </Heading>
                        )} */}
                        {items && items.length > 0 ? (
                            <Box flex={1}>
                                <ItemsGrid items={items} />
                            </Box>
                        ) : (
                            <NoResultsScreen />
                        )}
                    </VStack>
                )}
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
            <SimpleGrid columns={[1, 2, 4, 5]} spacing={4} w={"full"}>
                {items.map((i) => (
                    <BrowseItem item={i} fromSaved={false} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

const NoResultsScreen = ({}) => {
    const router = useRouter();
    return (
        <VStack alignItems={"flex-start"} flex={1} w={"full"}>
            <Center flex={1} w={"full"} pb={"10px"}>
                <VStack>
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
                            Try adjusting your search or filter to find what
                            you're looking for.
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
        </VStack>
    );
};
const LoadingScreen = () => {
    return (
        <Center flex={1} height={"full"}>
            <Spinner />
        </Center>
    );
};
