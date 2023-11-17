import {
    Heading,
    VStack,
    Image as CkImage,
    Center,
    Spinner,
    Text,
    Box,
    Card,
    HStack,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const BrowseItem = (props) => {
    const router = useRouter();
    const [city, setCity] = useState();
    const [imgReady, setImgReady] = useState(false);
    const handleClick = () => {
        if (router.isReady) {
            router.replace({
                pathname: "/item",
                query: { id: props.item.itemID },
            });
        }
    };
    const loadCityName = async () => {
        const res = await axios.get(`/api/city/closest`, {
            params: {
                lat: props.item.location.latitude,
                lng: props.item.location.longitude,
            },
        });
        setCity(res.data);
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
    useEffect(() => {
        props.item && loadCityName();
    }, [props.item]);
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
                href={`/item?id=${props.item.itemID}`}
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
                    <Heading size={"xs"} noOfLines={1}>
                        ${parseInt(props.item.price)}
                    </Heading>
                    <Text fontSize={"sm"} noOfLines={1}>
                        {props.item.title}
                    </Text>

                    <Text fontSize={"12px"} color={"gray.600"} noOfLines={1}>
                        {city && `${city.name}, ${city.abbrev}`}
                        {/* <span style={{ margin: "0px 4px" }}>&#183;</span> */}
                        {/* {city && `${parseInt(city.distance)} mi`} */}
                    </Text>
                </Box>
            </VStack>
        </Card>
    );
};
