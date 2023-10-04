import "@/firebase/firebase-init";
import "@/styles/app.css";
import { Box, ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import MarkItHeader from "./components/MarkItHeader";
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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [onPost, setOnPost] = useState<boolean>(false);
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
        }
    }, [router]);
    return (
        <ReduxProvider store={store}>
            <ChakraProvider>
                <div id={"mi-app-container"}>
                    {!onPost && <MarkItHeader />}
                    <Box id={"mi-content"} padding={"0px !important"}>
                        <Component {...pageProps} />
                    </Box>
                </div>
            </ChakraProvider>
        </ReduxProvider>
    );
}
