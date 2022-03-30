import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
    Box,
    Button,
    Center,
    Divider,
    Heading,
    HStack,
    Input,
    Progress,
    Text,
    VStack,
} from "native-base";
import React from "react";
import { MarkItColors } from "../util/MarkItTheme";

const Sell = () => {
    const Stack = createStackNavigator();

    return (
        <Box bg={"white"} flex={1} p={4} pt={2}>
            <Box flex={1}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name={"Categories"}
                        component={SellUploadImage}
                    />
                </Stack.Navigator>
            </Box>
            <HStack alignItems={"center"} mt={5} space={2}>
                <Progress flex={1} size={"sm"} colorScheme={"green"} />
                <Button bg={MarkItColors.primary}>
                    <HStack alignItems={"center"} space={1}>
                        <Text bold color={"white"}>
                            Continue
                        </Text>
                        <MaterialCommunityIcons
                            name={"check"}
                            style={{ color: "white" }}
                        />
                    </HStack>
                </Button>
            </HStack>
        </Box>
    );
};

const NoContent = () => {
    return (
        <Box flex={1} bg={"white"}>
            <Heading>No Sell Content</Heading>
        </Box>
    );
};

const SellUploadImage = () => {
    return (
        <Box flex={1} bg={"white"}>
            <Input
                fontSize={35}
                variant={"unstyled"}
                fontWeight={"bold"}
                placeholder={"Item Title"}
                _focus={{
                    borderColor: MarkItColors.secondary,
                }}
                textAlign={"center"}
            />
            <SellCoverPhoto />
            <SellImageButtons />
        </Box>
    );
};

const SellCoverPhoto = () => {
    return (
        <Center
            flex={1}
            mb={3}
            mt={1}
            borderWidth={2}
            borderStyle={"dashed"}
            borderColor={"muted.200"}
            borderRadius={15}
        >
            <VStack alignItems={"center"} space={3}>
                <Heading size={"md"} color={"muted.500"}>
                    No Cover Image
                </Heading>
            </VStack>
        </Center>
    );
};

const SellImageButtons = () => {
    return (
        <VStack space={2}>
            <Button
                borderRadius={"full"}
                variant={"outline"}
                borderColor={MarkItColors.primary}
            >
                <HStack alignItems={"center"} space={2}>
                    <MaterialCommunityIcons
                        name={"camera"}
                        style={{ color: MarkItColors.primary }}
                        size={18}
                    />

                    <Text bold color={MarkItColors.primary} fontSize={16}>
                        Take a Photo
                    </Text>
                </HStack>
            </Button>
            <Button
                borderRadius={"full"}
                variant={"outline"}
                borderColor={MarkItColors.primary}
            >
                <HStack alignItems={"center"} space={2}>
                    <MaterialCommunityIcons
                        name={"image-plus"}
                        style={{ color: MarkItColors.primary }}
                        size={18}
                    />

                    <Text bold color={MarkItColors.primary} fontSize={16}>
                        Upload Image
                    </Text>
                </HStack>
            </Button>
        </VStack>
    );
};
export default Sell;
