import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowseItem } from "../../components/BrowseItem";
import { getLikedItems } from "../../services/item_service";

const Saved = () => {
    const router = useRouter();
    const isLoggedIn = useSelector((state) => state.account.loggedIn);
    const user = useSelector((state) => state.account.user);
    const [likedItems, setLikedItems] = useState([]);
    const loadLikedItems = async () => {
        const liked = await getLikedItems();
        liked;
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
                <Box>
                    <Heading mb={4}>Saved</Heading>
                    <SimpleGrid columns={[2, 2, 3, 4]} spacing={4}>
                        {likedItems.map((i) => (
                            <BrowseItem item={i} />
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </>
    );
};

export default Saved;
