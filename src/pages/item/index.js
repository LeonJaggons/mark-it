import { getItemByID } from "@/services/item_service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MarkItItemDisplay } from "../../components/MarkItItemDisplay";
import { Center, Spinner } from "@chakra-ui/react";

const index = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState();
    const [fromSaved, setFromSaved] = useState(false);
    const loadItem = async (itemID) => {
        setLoading(true);

        const i = await getItemByID(itemID);
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
