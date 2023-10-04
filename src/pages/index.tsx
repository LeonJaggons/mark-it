import { Inter } from "next/font/google";
import {
    Button,
    Input,
    Heading,
    Icon,
    SimpleGrid,
    VStack,
    Image,
    Center,
    Spinner,
    Text,
    Box,
    HStack,
    Card,
    Divider,
    RadioGroup,
    Radio,
    Skeleton,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MarkItItem } from "@/redux/reducer/itemSlice";
import { getAllItems } from "@/services/item_service";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [items, setItems] = useState<MarkItItem[]>([]);
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const loadItems = async () => {
        const newItems = await getAllItems();
        setItems([...newItems]);
    };
    useEffect(() => {
        loadItems();
    }, []);
    return (
        <HStack
            align={"flex-start"}
            style={{ padding: "18px 7vw", height: "100%" }}
            position={"relative"}
            spacing={4}
        >
            <Box flex={"0 1 280px"} h={"full"} position={"relative"}>
                <BrowseFilters />
            </Box>
            <Box flex={1}>
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
                    {items.map((i) => (
                        <BrowseItem item={i} />
                    ))}
                </SimpleGrid>
            </Box>
            {loggedIn && <PostButton />}
        </HStack>
    );
}

const BrowseFilters = () => {
    return (
        <Card
            borderWidth={0.5}
            borderColor={"rgba(0,0,0,.1)"}
            position={"sticky"}
            top={"140px"}
            maxH={"calc(100vh - 160px)"}
            h={"calc(100vh - 160px)"}
        >
            <Box p={4} borderBottom={"1px solid rgba(0,0,0,.05)"}>
                <Heading size={"md"}>Filters</Heading>
            </Box>
            <VStack
                align={"flex-start"}
                p={4}
                spacing={2}
                h={"full"}
                overflow={"scroll"}
            >
                <Box>
                    <Heading size={"xs"} mb={2}>
                        Price Range
                    </Heading>
                    <HStack>
                        <Input flex={1} />
                        <Text>to</Text>
                        <Input flex={1} />
                    </HStack>
                </Box>
                <Divider my={4} />
                <Box>
                    <Heading size={"xs"} mb={2}>
                        Delivery Method
                    </Heading>
                    <VStack>
                        <RadioGroup>
                            <VStack align={"flex-start"}>
                                <Radio value={"0"}>All</Radio>
                                <Radio value={"1"}>Local Pickup</Radio>
                                <Radio value={"2"}>Delivery</Radio>
                                <Radio value={"3"}>Shipping</Radio>
                            </VStack>
                        </RadioGroup>
                    </VStack>
                </Box>

                <Divider my={4} />
                <Box>
                    <Heading size={"xs"} mb={2}>
                        Conditions
                    </Heading>
                    <VStack>
                        <RadioGroup value="0">
                            <VStack align={"flex-start"}></VStack>
                        </RadioGroup>
                    </VStack>
                </Box>
            </VStack>
            <Box w={"full"} p={4} borderTop={"1px solid rgba(0,0,0,.05)"}>
                <Button
                    w={"full"}
                    colorScheme={"messenger"}
                    variant={"outline"}
                >
                    Apply
                </Button>
            </Box>
        </Card>
    );
};
export const BrowseItem = (props: { item: MarkItItem }) => {
    const router = useRouter();
    const handleClick = () => {
        if (router.isReady) {
            router.replace({
                pathname: "/item",
                query: { id: props.item.itemID },
            });
        }
    };
    return (
        <VStack
            as={Link}
            href={`/item?id=${props.item.itemID}`}
            w={"full"}
            align={"flex-start"}
            spacing={1}
            cursor={router.isReady ? "pointer" : "auto"}
            onClick={handleClick}
        >
            {props.item.images && (
                <Image
                    src={props.item.images[0]}
                    aspectRatio={1}
                    w={"full"}
                    objectFit={"cover"}
                    fallback={
                        // <Skeleton w={"full"} h={"full"} isLoaded={false} />
                        <Center w={"full"} height={"full"} aspectRatio={1}>
                            <Spinner color={"blackAlpha.400"} />
                        </Center>
                    }
                    borderRadius={5}
                />
            )}
            <Box>
                <Heading size={"xs"}>${props.item.price}</Heading>
                <Text fontSize={"sm"}>{props.item.title}</Text>
            </Box>
        </VStack>
    );
};

export const PostButton = () => {
    return (
        <Button
            as={Link}
            href="/post"
            size={"lg"}
            colorScheme={"messenger"}
            id={"mi-post-btn"}
            leftIcon={<Icon as={MdAdd} />}
        >
            Post an item
        </Button>
    );
};
