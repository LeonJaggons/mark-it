import MarkItHeader from "@/components/MarkItHeader";
import "@/firebase/firebase-init";
import { fireAuth, fireStore } from "@/firebase/firebase-init";
import { RootState, store } from "@/redux/store";
import { getUserFromFBUser, updateLoginState } from "@/services/auth_services";
import "@/styles/app.css";
import { Box, ChakraProvider, Stack } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider as ReduxProvider, useSelector } from "react-redux";

import { BrowseFilters } from "@/components/BrowseFilters";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [onPost, setOnPost] = useState<boolean>(false);
    const [onBrowse, setOnBrowse] = useState<boolean>(false);
    useEffect(() => {
        // loginUser(true);
        onAuthStateChanged(fireAuth, (fbUser) => {
            if (fbUser?.uid) {
                getUserFromFBUser(fbUser).then((user) => {
                    updateLoginState(user);
                });
            }
        });

        // return () => {
        //     unsub();
        // };
    }, []);
    useEffect(() => {
        if (router.isReady) {
            setOnPost(router.pathname.includes("post"));
            setOnBrowse(router.pathname.includes("browse"));
        }
    }, [router]);

    return (
        <ReduxProvider store={store}>
            <LocationProvider>
                <ChakraProvider>
                    <div id={"mi-app-container"}>
                        {!onPost && <MarkItHeader />}
                        <Stack
                            direction={onBrowse ? "row" : "column"}
                            px={!onPost && "5vw"}
                            py={!onPost && "16px"}
                            height={!onPost ? "fit-content" : "100vh"}
                            flex={1}
                        >
                            {onBrowse && <BrowseFilters></BrowseFilters>}
                            <Box
                                id={"mi-content"}
                                flex={1}
                                h={"100%"}
                                // overflowY={"scroll"}
                            >
                                <Component {...pageProps} />
                            </Box>
                        </Stack>
                        {/* <Box bg={"messenger.500"} px={"5vw"} py={"12px"}>
                        <Heading>Footer</Heading>
                    </Box> */}
                    </div>
                </ChakraProvider>
            </LocationProvider>
        </ReduxProvider>
    );
}

const LocationProvider = (props) => {
    const user = useSelector((state: RootState) => state.account.user);
    const updateUserLocation = () => {
        if ("geolocation" in navigator) {
            // Geolocation is available
            navigator.geolocation.getCurrentPosition(
                async function (position) {
                    // The user's current position is available in the `position` object
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    const userCollection = collection(fireStore, "user");
                    const userDoc = doc(userCollection, user.userID);
                    await updateDoc(userDoc, {
                        location: {
                            latitude: latitude,
                            longitude: longitude,
                        },
                    });
                },
                function (error) {
                    // Handle any errors that may occur when trying to get the user's location
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error(
                                "User denied the request for Geolocation."
                            );
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error(
                                "Location information is unavailable."
                            );
                            break;
                        case error.TIMEOUT:
                            console.error(
                                "The request to get user location timed out."
                            );
                            break;
                    }
                }
            );
        } else {
            // Geolocation is not available in this browser
            console.error("Geolocation is not available in this browser.");
        }
    };

    useEffect(() => {
        user && updateUserLocation();
    }, [user]);
    return <>{props.children}</>;
};
