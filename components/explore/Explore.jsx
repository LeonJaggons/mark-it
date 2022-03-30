import {
    Box,
    Text,
    Heading,
    Input,
    HStack,
    IconButton,
    Icon,
    ScrollView,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import ExploreItem from "./ExploreItem";
import { MarkItColors } from "../util/MarkItTheme";

const Explore = () => {
    return (
        <Box flex={1} px={4} py={3} bg={"white"}>
            <HStack alignItems={"center"} space={2}>
                <Input
                    flex={1}
                    fontSize={15}
                    borderRadius={"full"}
                    colorScheme={"blue"}
                    px={6}
                    _focus={{
                        borderColor: MarkItColors.primary,
                    }}
                    placeholder={"Search MarkIt Items.."}
                />
                <IconButton
                    variant={"solid"}
                    borderRadius={"full"}
                    bg={MarkItColors.primary}
                    colorScheme={"green"}
                    icon={
                        <MaterialCommunityIcons
                            name={"apps-box"}
                            size={18}
                            style={{ color: "white" }}
                        />
                    }
                />
                <IconButton
                    variant={"solid"}
                    borderRadius={"full"}
                    bg={MarkItColors.primary}
                    colorScheme={"green"}
                    icon={
                        <MaterialCommunityIcons
                            name={"sort"}
                            size={18}
                            style={{ color: "white" }}
                        />
                    }
                />
            </HStack>
            <ScrollView>
                <HStack mt={4} flexWrap={"wrap"} pr={2}>
                    <ExploreItem />
                    <ExploreItem />
                    <ExploreItem />
                </HStack>
            </ScrollView>
        </Box>
    );
};

export default Explore;
