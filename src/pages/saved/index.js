import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getLikedItems } from "../../services/item_service";
import { BrowseItem } from "../../components/BrowseItem";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
const Saved = () => {
    const router = useRouter();
    const isLoggedIn = useSelector((state) => state.account.loggedIn);
    const user = useSelector((state) => state.account.user);
    const [likedItems, setLikedItems] = useState([]);
    const loadLikedItems = async () => {
        const liked = await getLikedItems();
        console.log(liked);
        setLikedItems([...liked]);
    };
    useEffect(() => {
        user && loadLikedItems();
    }, [user]);
    useEffect(() => {
        !isLoggedIn && router.push("/");
    }, [isLoggedIn]);
    return (
        <>
            <Head>
                <title>Saved</title>
            </Head>
            {isLoggedIn && (
                <Box px={"7vw"} py={"12px"}>
                    <Heading size={"lg"} mb={4}>
                        Saved
                    </Heading>
                    <SimpleGrid columns={4} spacing={4}>
                        {likedItems.map((i) => (
                            <BrowseItem item={i} fromSaved />
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </>
    );
};

export default Saved;
