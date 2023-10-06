import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserItems } from "@/services/item_service";
import {
    Box,
    Button,
    Card,
    HStack,
    Heading,
    Icon,
    Image,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import {
    MdDone,
    MdFavorite,
    MdMouse,
    MdPassword,
    MdRocketLaunch,
    MdShare,
    MdShoppingCartCheckout,
    MdViewList,
    MdVisibility,
} from "react-icons/md";
import { useRouter } from "next/router";
import Link from "next/link";
const Sell = () => {
    const router = useRouter();
    const user = useSelector((state) => state.account.user);
    const [items, setItems] = useState();

    const loadItems = async () => {
        const newItems = await getUserItems();
        setItems([...newItems]);
    };
    useEffect(() => {
        if (user) {
            loadItems();
        } else {
            router.replace("/browse");
        }
    }, [user]);
    return (
        <Box px={"7vw"} py={"18px"}>
            <Heading mb={4}>Selling</Heading>
            <SimpleGrid columns={[1, null, 2, null]} spacing={[4, 4]}>
                {items?.map((item) => (
                    <Card
                    // as={Link} href={`/item?id=${item.itemID}`}
                    >
                        {item}
                        <HStack p={4} spacing={4}>
                            <Image
                                src={item.images[0]}
                                borderRadius={5}
                                boxSize={"100px"}
                                objectFit={"cover"}
                            />
                            <VStack flex={1} spacing={0} align={"flex-start"}>
                                <Heading size={"sm"}>{item.title}</Heading>
                                <Text>${item.price}</Text>

                                <HStack>
                                    <Text fontSize={12}>Listed on</Text>
                                </HStack>
                                <HStack mt={"4px"}>
                                    <Icon
                                        as={MdVisibility}
                                        color={"messenger.200"}
                                    />
                                    <Text fontSize={12}>
                                        X views on this listing
                                    </Text>
                                </HStack>
                                <HStack>
                                    <Icon
                                        as={MdFavorite}
                                        color={"messenger.200"}
                                    />
                                    <Text fontSize={12}>X favorites</Text>
                                </HStack>
                            </VStack>
                            <VStack flex={1} h={"full"}>
                                <Button
                                    w={"full"}
                                    size={"sm"}
                                    leftIcon={<Icon as={MdRocketLaunch} />}
                                >
                                    Boost Listing
                                </Button>
                                <Button
                                    leftIcon={<Icon as={MdShare} />}
                                    w={"full"}
                                    size={"sm"}
                                >
                                    Share
                                </Button>
                                <Button
                                    w={"full"}
                                    size={"sm"}
                                    leftIcon={<Icon as={MdDone} />}
                                    colorScheme={"messenger"}
                                >
                                    Mark as sold
                                </Button>
                            </VStack>
                        </HStack>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default Sell;
