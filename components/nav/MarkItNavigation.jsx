import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
    Avatar,
    Box,
    Center,
    Heading,
    HStack,
    IconButton,
    Text,
} from "native-base";
import React from "react";
import Explore from "../explore/Explore";
import uuid from "react-native-uuid";
import { MarkItColors } from "../util/MarkItTheme";
import Sell from "../sell/Sell";
class MarkItTab {
    constructor(title, component, icon) {
        this.title = title;
        this.component = component;
        this.icon = icon;
    }
    getIcon(color) {
        return (
            <MaterialCommunityIcons name={this.icon} color={color} size={20} />
        );
    }
}

const MarkItNavigation = () => {
    const Tab = createBottomTabNavigator();
    const markItTabs = [
        new MarkItTab("Explore", Explore, "compass"),
        new MarkItTab("Delivery", NoContent, "truck-delivery"),
        new MarkItTab("Sell", Sell, "plus-box"),
        new MarkItTab("Message", NoContent, "message"),
        new MarkItTab("Meet Up", NoContent, "map-marker"),
    ];
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: { paddingBottom: 5, paddingTop: 4 },
                    header: () => (
                        <HStack
                            safeArea
                            p={3}
                            px={4}
                            bg={MarkItColors.primary}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Heading color={"white"}>MarkIt</Heading>
                            <HStack space={2} alignItems={"center"}>
                                <Avatar size={"sm"} bg={"white"}>
                                    LJ
                                </Avatar>
                                <IconButton
                                    variant={"outline"}
                                    borderRadius={"full"}
                                    borderColor={"white"}
                                    colorScheme={"green"}
                                    icon={
                                        <MaterialCommunityIcons
                                            name={"bell"}
                                            size={18}
                                            style={{ color: "white" }}
                                        />
                                    }
                                />
                            </HStack>
                        </HStack>
                    ),
                }}
            >
                {markItTabs.map((tab) => (
                    <Tab.Screen
                        key={uuid.v4()}
                        name={tab.title}
                        component={tab.component}
                        options={{
                            tabBarIcon: ({ color }) => tab.getIcon(color),
                            tabBarActiveTintColor: MarkItColors.primary,
                        }}
                    />
                ))}
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const NoContent = () => {
    return (
        <Center flex={1} bg={"white"}>
            <Heading>No Content</Heading>
        </Center>
    );
};
export default MarkItNavigation;
