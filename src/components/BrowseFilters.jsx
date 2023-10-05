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
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import Link from "next/link";

export const BrowseFilters = () => {
    return (
        <Card
            borderWidth={0.5}
            borderColor={"rgba(0,0,0,.1)"}
            position={"sticky"}
            top={"140px"}
            maxH={"calc(100vh - 160px)"}
            h={"calc(100vh - 160px)"}
        >
            <Box p={4} borderBottom={"1px solid rgba(0,0,0,.05)"}>
                <Heading size={"md"}>Filters</Heading>
            </Box>
            <Box overflowY={"scroll"} flex={1}>
                <VStack
                    align={"flex-start"}
                    p={4}
                    spacing={1}
                    h={"full"}
                    overflowY={"scroll"}
                >
                    <Box>
                        <Heading size={"xs"} mb={2}>
                            Price Range
                        </Heading>
                        <HStack>
                            <Input flex={1} />
                            <Text>to</Text>
                            <Input flex={1} />
                        </HStack>
                    </Box>
                    <Divider my={2} />
                    <Box>
                        <Heading size={"xs"} mb={2}>
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

                    <Divider my={2} />
                    <Box>
                        <Heading size={"xs"} mb={2}>
                            Conditions
                        </Heading>
                        <VStack pl={2}>
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
            <Box w={"full"} p={4} borderTop={"1px solid rgba(0,0,0,.05)"}>
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
