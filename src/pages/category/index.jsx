import { BrowseItem } from "@/components/BrowseItem";
import { getItemsByCategory } from "@/services/item_service";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Category = () => {
    const router = useRouter();
    const [category, setCategory] = useState();
    const [items, setItems] = useState();

    useEffect(() => {
        if (router.isReady) {
            setCategory(router.query.category);
        }
    }, [router]);

    useEffect(() => {
        if (category) {
            loadItems(category);
        }
    }, [category]);

    const loadItems = async () => {
        const newItems = await getItemsByCategory(category);
        setItems([...newItems]);
    };
    return (
        <Box px={"7vw"} py={"18px"}>
            <Heading size={"md"} mb={4}>
                {category}
            </Heading>
            <SimpleGrid columns={5}>
                {items?.map((i) => (
                    <BrowseItem item={i} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default Category;
