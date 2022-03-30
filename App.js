import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, Box } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import MarkItNavigation from "./components/nav/MarkItNavigation";
import MarkItItem from "./js/MarkItItem";

export default function App() {
    let markItItem = new MarkItItem(
        { firstName: "Leon" },
        "My First Item",
        "Lorem ipsum sdsad sfsaf asfa.",
        90,
        ["My", "First", "Item"]
    );
    return (
        <NativeBaseProvider>
            <Box flex={1} bg={"white"}>
                <MarkItNavigation />
                <StatusBar style="light" />
            </Box>
        </NativeBaseProvider>
    );
}
