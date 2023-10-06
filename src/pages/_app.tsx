import "@/firebase/firebase-init";
import "@/styles/app.css";
import { Box, ChakraProvider, HStack, Stack } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import MarkItHeader from "@/components/MarkItHeader";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "@/firebase/firebase-init";
import {
    getUserFromFBUser,
    loginUser,
    updateLoginState,
} from "@/services/auth_services";
import { useRouter } from "next/router";

import Scrollbars from "react-custom-scrollbars-2";
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
                        px={"7vw"}
                        py={"12px"}
                        height={"calc(100vh - 68px)"}
                    >
                        {onBrowse && <BrowseFilters></BrowseFilters>}
                        <Box
                            id={"mi-content"}
                            padding={"0px !important"}
                            overflowY={"scroll"}
                        >
                            <Component {...pageProps} />
                        </Box>
                    </Stack>
                    {/* <Scrollbars></Scrollbars> */}
                </div>
            </ChakraProvider>
        </ReduxProvider>
    );
}
