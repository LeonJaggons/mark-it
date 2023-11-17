import { setSelectedCategory } from "@/redux/reducer/itemSlice";
import { getItemCategories } from "@/services/item_service";
import { Box, Button, Center, Icon, Spinner, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    MdAdfScanner,
    MdApps,
    MdCameraAlt,
    MdCarRepair,
    MdCheckroom,
    MdConstruction,
    MdDevices,
    MdDomain,
    MdFavorite,
    MdHouse,
    MdLuggage,
    MdPalette,
    MdPets,
    MdShelves,
    MdSportsEsports,
    MdSportsTennis,
    MdTempleBuddhist,
    MdToys,
    MdVideoChat,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export const CategoriesList = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const categories = useSelector((state) => state.item.categories);
    const [catSelected, setCatSelected] = useState(false);

    useEffect(() => {
        const selectedCat = router.query.category;
        setCatSelected(selectedCat != null);
    }, [router]);
    return (
        <VStack w={"full"} spacing={1}>
            <CategoryMenuItem label={"All"} key={"CAT-ALL"} />
            {loading ? (
                <Center w={"full"}>
                    <Spinner size={"md"} color="gray.500" />
                </Center>
            ) : (
                <>
                    {categories.map((c) => (
                        <CategoryMenuItem
                            label={c.name}
                            key={"CAT-" + c.name}
                        />
                    ))}
                </>
            )}
        </VStack>
    );
};

const CategoryMenuItem = ({ href, label }) => {
    const router = useRouter();
    const selectedCategory = useSelector(
        (state) => state.item.selectedCategory
    );
    const dispatch = useDispatch();
    const handleNav = () => {
        if (label === "All") {
            router.push("/browse");
            dispatch(setSelectedCategory(null));
        } else {
            router.push({
                pathname: "/browse",
                query: { category: label },
            });
        }
    };
    useEffect(() => {
        dispatch(setSelectedCategory(router.query.category));
    }, [router.pathname]);

    const categoryIcon = {
        All: MdApps,
        "Animals & Pet Supplies": MdPets,
        "Apparel & Accessories": MdCheckroom,
        "Arts & Entertainment": MdPalette,
        "Baby & Toddler": MdToys,
        "Business & Industrial": MdDomain,
        "Cameras & Optics": MdCameraAlt,
        Electronics: MdDevices,
        Furniture: MdShelves,
        Hardware: MdConstruction,
        "Health & Beauty": MdFavorite,
        "Home & Garden": MdHouse,
        "Luggage & Bags": MdLuggage,
        Media: MdVideoChat,
        "Office Supplies": MdAdfScanner,
        "Religious & Ceremonial": MdTempleBuddhist,
        "Sporting Goods": MdSportsTennis,
        "Toys & Games": MdSportsEsports,
        "Vehicles & Parts": MdCarRepair,
    };
    return (
        Object.keys(categoryIcon).includes(label) && (
            <Button
                cursor={"pointer"}
                variant={selectedCategory === label ? "solid" : "ghost"}
                colorScheme={"messenger"}
                w={"full"}
                height={"52px"}
                px={2}
                leftIcon={
                    <Center
                        w={"36px"}
                        borderRadius={5}
                        bg={"gray.300"}
                        aspectRatio={1}
                    >
                        <Icon
                            as={categoryIcon[label]}
                            boxSize={"22px"}
                            color={"black"}
                        />
                    </Center>
                }
                color={selectedCategory === label ? "white" : "black"}
                justifyContent={"flex-start"}
                onClick={handleNav}
                fontWeight={selectedCategory === label ? 600 : 400}
                fontSize={"14px"}
                borderRadius={5}
            >
                <Box>{label}</Box>
            </Button>
        )
    );
};
