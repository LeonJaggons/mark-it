import {
    Heading,
    VStack,
    Image as CkImage,
    Center,
    Spinner,
    Text,
    Box,
    Card,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const BrowseItem = (props) => {
    const router = useRouter();
    const [imgReady, setImgReady] = useState(false);
    const handleClick = () => {
        if (router.isReady) {
            router.replace({
                pathname: "/item",
                query: { id: props.item.itemID },
            });
        }
    };
    useEffect(() => {
        if (props.item && props.item.images) {
            for (let img of props.item.images) {
                const imgElement = new Image();
                imgElement.onload = () => {
                    setImgReady(true);
                };
                imgElement.src = img;
            }
        }
    }, []);
    return (
        <Card
            shadow={"none"}
            border={"1px solid rgba(0,0,0,.1)"}
            _hover={{
                shadow: "sm",
            }}
        >
            <VStack
                as={Link}
                href={`/item?id=${props.item.itemID}&fromSaved=${props.fromSaved}`}
                w={"full"}
                align={"flex-start"}
                spacing={1}
                cursor={router.isReady ? "pointer" : "auto"}
                onClick={handleClick}
            >
                {props.item.images && (
                    <CkImage
                        // opacity={0.2}
                        src={props.item.images[0]}
                        aspectRatio={1}
                        w={"full"}
                        objectFit={"cover"}
                        display={""}
                        fallback={
                            // <Skeleton w={"full"} h={"full"} isLoaded={false} />
                            <Center w={"full"} height={"full"} aspectRatio={1}>
                                <Spinner color={"blackAlpha.400"} />
                            </Center>
                        }
                        loading={!imgReady}
                        is
                        borderRadius={5}
                        borderBottomRadius={0}
                        borderBottom={"1px solid rgba(0,0,0,.05)"}
                    />
                )}
                <Box p={2} pt={1}>
                    <Heading size={"xs"}>${props.item.price}</Heading>
                    <Text fontSize={"sm"}>{props.item.title}</Text>
                    <Text fontSize={"12px"} color={"gray.600"}>
                        {parseInt(props.item.distance)} mi
                    </Text>
                </Box>
            </VStack>
        </Card>
    );
};
