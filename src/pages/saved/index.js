import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getLikedItems } from "../../services/item_service";
import { BrowseItem } from "../index";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
const Saved = () => {
    const router = useRouter();
    const isLoggedIn = useSelector((state) => state.account.loggedIn);

    const [likedItems, setLikedItems] = useState([]);
    const loadLikedItems = async () => {
        const liked = await getLikedItems();
        console.log(liked);
        setLikedItems([...liked]);
    };
    useEffect(() => {
        loadLikedItems();
    }, []);
    useEffect(() => {
        !isLoggedIn && router.push("/");
    }, [isLoggedIn]);
    return (
        isLoggedIn && (
            <Box px={"7vw"} py={"12px"}>
                <Heading mb={4}>Saved</Heading>
                <SimpleGrid columns={4} spacing={4}>
                    {likedItems.map((i) => (
                        <BrowseItem item={i} />
                    ))}
                </SimpleGrid>
            </Box>
        )
    );
};

export default Saved;
