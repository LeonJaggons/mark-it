import {
    Heading, VStack,
    Image,
    Center,
    Spinner,
    Text,
    Box
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const BrowseItem = (props) => {
    const router = useRouter();
    const handleClick = () => {
        if (router.isReady) {
            router.replace({
                pathname: "/item",
                query: { id: props.item.itemID },
            });
        }
    };
    return (
        <VStack
            as={Link}
            href={`/item?id=${props.item.itemID}`}
            w={"full"}
            align={"flex-start"}
            spacing={1}
            cursor={router.isReady ? "pointer" : "auto"}
            onClick={handleClick}
        >
            {props.item.images && (
                <Image
                    src={props.item.images[0]}
                    aspectRatio={1}
                    w={"full"}
                    objectFit={"cover"}
                    fallback={
                        // <Skeleton w={"full"} h={"full"} isLoaded={false} />
                        <Center w={"full"} height={"full"} aspectRatio={1}>
                            <Spinner color={"blackAlpha.400"} />
                        </Center>}
                    borderRadius={5} />
            )}
            <Box>
                <Heading size={"xs"}>${props.item.price}</Heading>
                <Text fontSize={"sm"}>{props.item.title}</Text>
            </Box>
        </VStack>
    );
};
