import MarkItHeader from "@/components/MarkItHeader";
import "@/firebase/firebase-init";
import { fireAuth } from "@/firebase/firebase-init";
import { store } from "@/redux/store";
import { getUserFromFBUser, updateLoginState } from "@/services/auth_services";
import "@/styles/app.css";
import { Box, ChakraProvider, Stack } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { BrowseFilters } from "@/components/BrowseFilters";

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
            <ChakraProvider>
                <div id={"mi-app-container"}>
                    {!onPost && <MarkItHeader />}
                    <Stack
                        direction={onBrowse ? "row" : "column"}
                        px={!onPost && "5vw"}
                        py={!onPost && "16px"}
                        height={!onPost ? "fit-content" : "100vh"}
                    >
                        {onBrowse && <BrowseFilters></BrowseFilters>}
                        <Box
                            id={"mi-content"}
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
        </ReduxProvider>
    );
}
