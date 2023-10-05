import { Inter } from "next/font/google";
import { SimpleGrid, Box, HStack, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MarkItItem } from "@/redux/reducer/itemSlice";
import { getAllItems } from "@/services/item_service";
import { useDispatch, useSelector } from "react-redux";
import { BrowseFilters, PostButton } from "../components/BrowseFilters";
import { BrowseItem } from "@/components/BrowseItem";
import { setAppLocation } from "@/redux/reducer/appSlice";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.push("/browse");
    }, []);
    return <></>;
}
