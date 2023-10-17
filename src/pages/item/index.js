import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getItemByID } from "@/services/item_service";
import { MarkItItemDisplay } from "../../components/MarkItItemDisplay";
import { Box, Center, Spinner } from "@chakra-ui/react";

const index = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState();
    const [fromSaved, setFromSaved] = useState(false);
    const loadItem = async (itemID) => {
        setLoading(true);
        "GET ITEM ID: ", itemID;

        const i = await getItemByID(itemID);
        i;
        setItem(i);
        setLoading(false);
    };
    useEffect(() => {
        if (router.isReady) {
            const { id, fromSaved } = router.query;
            loadItem(id);
            setFromSaved(fromSaved);
        }
    }, [router.query]);
    return (
        <Center h={"full"}>
            {item && !loading ? (
                <MarkItItemDisplay item={item} fromSaved={fromSaved} />
            ) : (
                <Spinner size={"lg"} color={"blackAlpha.500"} />
            )}
        </Center>
    );
};

export default index;
