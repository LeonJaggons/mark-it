import {
    Button,
    Input,
    Heading,
    Icon,
    VStack,
    Text,
    Box,
    HStack,
    Card,
    Divider,
    RadioGroup,
    Radio,
    CheckboxGroup,
    Checkbox,
    Collapse,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import Link from "next/link";
import { CategoriesList } from "./CategoriesButton";

export const BrowseFilters = () => {
    return (
        <Card
            shadow={"none"}
            border={"1px solid rgba(0,0,0,.1)"}
            position={"sticky"}
            top={"86px"}
            flex={"0 1 300px"}
            borderRadius={5}
            overflow={"hidden"}
            // maxH={"calc(100vh - 170px)"}
            // h={"calc(100vh - 170px)"}
            h={"calc(100vh - 96px)"}
        >
            {/* <Box p={4} borderBottom={"1px solid rgba(0,0,0,.1)"}>
                <Heading size={"md"}>Filters</Heading>
            </Box> */}
            <Box overflowY={"scroll"} flex={1}>
                <VStack
                    p={2}
                    align={"flex-start"}
                    spacing={1}
                    h={"full"}
                    overflowY={"scroll"}
                >
                    <Heading size={"sm"} py={2} pl={2}>
                        Categories
                    </Heading>
                    <CategoriesList />
                    <Box>
                        <Heading size={"xs"} p={2} pr={0}>
                            Price Range
                        </Heading>
                        <HStack px={4}>
                            <Input flex={1} />
                            <Text>to</Text>
                            <Input flex={1} />
                        </HStack>
                    </Box>
                    <Box>
                        <Heading size={"xs"} p={2} pr={0}>
                            Delivery Method
                        </Heading>
                        <VStack>
                            <RadioGroup size={"sm"}>
                                <VStack align={"flex-start"}>
                                    <Radio value={"0"}>All</Radio>
                                    <Radio value={"1"}>Local Pickup</Radio>
                                    <Radio value={"2"}>Delivery</Radio>
                                    <Radio value={"3"}>Shipping</Radio>
                                </VStack>
                            </RadioGroup>
                        </VStack>
                    </Box>

                    <Box>
                        <Heading size={"xs"} p={2} pr={0}>
                            Conditions
                        </Heading>
                        <VStack px={6}>
                            <CheckboxGroup value="0" size={"sm"}>
                                <VStack align={"flex-start"}>
                                    <Checkbox>New</Checkbox>
                                    <Checkbox>Used - Like New</Checkbox>
                                    <Checkbox>Used</Checkbox>
                                    <Checkbox>For Parts</Checkbox>
                                </VStack>
                            </CheckboxGroup>
                        </VStack>
                    </Box>
                </VStack>
            </Box>
            <Box w={"full"} p={4} borderTop={"1px solid rgba(0,0,0,.1)"}>
                <Button
                    w={"full"}
                    colorScheme={"messenger"}
                    variant={"outline"}
                >
                    Apply
                </Button>
            </Box>
        </Card>
    );
};
export const PostButton = () => {
    return (
        <Button
            as={Link}
            href="/post"
            size={"lg"}
            colorScheme={"messenger"}
            id={"mi-post-btn"}
            leftIcon={<Icon as={MdAdd} />}
        >
            Post an item
        </Button>
    );
};
