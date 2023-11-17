import { getItemByID } from "@/services/item_service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MarkItItemDisplay } from "../../components/MarkItItemDisplay";
import { Center, Spinner } from "@chakra-ui/react";

const index = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState();
    const loadItem = async (itemID) => {
        setLoading(true);

        const i = await getItemByID(itemID);
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
        <Center h={"100vh"}>
            {item && !loading ? (
                <MarkItItemDisplay item={item} />
            ) : (
                <Spinner size={"lg"} color={"blackAlpha.500"} />
            )}
        </Center>
    );
};

export default index;
