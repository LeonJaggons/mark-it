import { Inter } from "next/font/google";
import {
    SimpleGrid,
    Box,
    HStack,
    Skeleton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MarkItItem } from "@/redux/reducer/itemSlice";
import { getAllItems } from "@/services/item_service";
import { useSelector } from "react-redux";
import { BrowseFilters, PostButton } from "../components/BrowseFilters";
import { BrowseItem } from "@/components/BrowseItem";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [items, setItems] = useState([]);
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


