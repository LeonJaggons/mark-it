import {
    EmptyItem,
    setPostItem,
} from "@/redux/reducer/itemSlice";
import {
    HStack,
    } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";
import { PostDetailsForm, PostPreview } from "../../components/PostDetailsForm";
const Post = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const user = useSelector((state) => state.account.user);
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            if (!loggedIn) {
                router.push("/");
            } else {
                console.log(user);
            }
        }
        return () => {
            dispatch(setPostItem(EmptyItem));
        };
    }, [router.pathname]);
    return (
        <HStack spacing={0}>
            <PostDetailsForm />
            <PostPreview />
        </HStack>
    );
};

export default Post;
