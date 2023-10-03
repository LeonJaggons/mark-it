import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getItemByID } from "@/services/item_service";
import { MarkItItemDisplay } from "../components/MarkItItemDisplay";
import { Box, Center, Spinner } from "@chakra-ui/react";
const index = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState();
    const loadItem = async (itemID) => {
        setLoading(true);
        console.log("GET ITEM ID: ", itemID);

        const i = await getItemByID(itemID);
        console.log(i);
        setItem(i);
        setLoading(false);
    };
    useEffect(() => {
        if (router.isReady) {
            const { id } = router.query;
            loadItem(id);
        }
    }, [router.query]);
    return (
        <Center px={"7vw"} py={"12px"} h={"full"}>
            {item && !loading ? (
                <MarkItItemDisplay item={item} />
            ) : (
                <Spinner size={"lg"} color={"blackAlpha.500"} />
            )}
        </Center>
    );
};

export default index;
