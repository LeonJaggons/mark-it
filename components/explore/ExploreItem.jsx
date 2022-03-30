import {
    Box,
    Text,
    Heading,
    VStack,
    HStack,
    Avatar,
    Center,
    Button,
    Collapse,
    IconButton,
    Divider,
} from "native-base";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Collapsible from "react-native-collapsible";
import { MarkItColors } from "../util/MarkItTheme";

const ExploreItem = () => {
    const [showDetails, setShowDetails] = React.useState(false);
    const toggleShowDetails = () => {
        setShowDetails(!showDetails);
    };
    return (
        <VStack w={"50%"} p={2}>
            <ExploreItemPriceTag />
            <Box
                shadow={1}
                zIndex={3}
                width={"100%"}
                bg={"muted.50"}
                style={{ aspectRatio: 1 }}
                borderRadius={10}
            ></Box>
            <Collapse
                isOpen={showDetails}
                borderColor={"muted.100"}
                borderBottomRadius={10}
                borderWidth={1}
            >
                <ExploreItemDetails />
            </Collapse>
            <ExploreDetailToggle handleToggle={toggleShowDetails} />
        </VStack>
    );
};

const ExploreItemDetails = () => {
    return (
        <VStack p={3} pb={2} pt={3} borderBottomRadius={10} space={2}>
            <Heading bold size={"md"} alignSelf={"center"}>
                Item Title
            </Heading>
            <Divider />
            <HStack alignItems={"center"} space={2}>
                <MaterialCommunityIcons name={"calendar"} size={16} />
                <Text fontSize={12}>POSTED DATE</Text>
            </HStack>
            <HStack alignItems={"center"} space={2}>
                <MaterialCommunityIcons name={"map-marker"} size={16} />
                <Text fontSize={12}>LOCATION</Text>
            </HStack>
            <HStack alignItems={"center"} space={2}>
                <MaterialCommunityIcons name={"eye"} size={16} />
                <Text fontSize={12}>ITEM VIEWS</Text>
            </HStack>
            <HStack
                alignItems={"center"}
                justifyContent={"flex-end"}
                mt={2}
            ></HStack>
        </VStack>
    );
};

const ExploreDetailToggle = ({ handleToggle }) => {
    return (
        <Button variant={"unstyled"} onPress={handleToggle} p={0}>
            <HStack
                justifyContent={"center"}
                borderBottomRadius={10}
                bg={"muted.100"}
                px={6}
                pb={2}
                bottom={0}
                alignItems={"flex-start"}
                borderColor={"muted.100"}
                borderWidth={1}
                borderTop={null}
            >
                <MaterialCommunityIcons
                    name={"menu"}
                    size={15}
                    style={{
                        color: "black",
                    }}
                />
            </HStack>
        </Button>
    );
};
const ExploreItemPriceTag = () => {
    return (
        <Box
            bg={MarkItColors.primary}
            position={"absolute"}
            left={0}
            top={0}
            zIndex={1}
            px={3}
            py={1.5}
            shadow={4}
            borderRadius={"full"}
            borderBottomRightRadius={0}
        >
            <Text bold color={"muted.50"} fontSize={12}>
                $15
            </Text>
        </Box>
    );
};

export default ExploreItem;
