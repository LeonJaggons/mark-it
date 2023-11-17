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
    RadioGroup,
    Radio,
    CheckboxGroup,
    Checkbox,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Select,
    InputGroup,
    InputRightAddon,
    InputRightElement,
    IconButton,
    Spinner,
} from "@chakra-ui/react";
import {
    MdAdd,
    MdLocationCity,
    MdLocationSearching,
    MdSearch,
} from "react-icons/md";
import Link from "next/link";
import { CategoriesList } from "./CategoriesButton";
import { MarkItSearch } from "./MarkItSearch";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { debounce, find } from "lodash";
import GoogleMapReact from "google-map-react";
export const BrowseFilters = () => {
    const router = useRouter();
    const [catSelected, setCatSelected] = useState();
    useEffect(() => {
        const selectedCat = router.query.category;
        setCatSelected(selectedCat ?? "Marketplace");
    }, [router]);
    return (
        <Card
            shadow={"none"}
            border={"1px solid rgba(0,0,0,.1)"}
            position={"sticky"}
            top={"86px"}
            flex={"0 1 340px"}
            borderRadius={5}
            overflow={"hidden"}
            // maxH={"calc(100vh - 170px)"}
            // h={"calc(100vh - 170px)"}
            h={"calc(100vh - 96px)"}
        >
            {/* <Box p={4} borderBottom={"1px solid rgba(0,0,0,.1)"}>
                <Heading size={"md"}>Filters</Heading>
            </Box> */}
            <Box p={4} borderBottom={"1px solid rgba(0,0,0,.1)"}>
                <Heading fontSize={"1.2rem"} mb={2}>
                    {catSelected}
                </Heading>
                <MarkItSearch />
                <LocationFilter />
            </Box>
            <Box overflowY={"scroll"} flex={1}>
                <VStack
                    p={2}
                    align={"flex-start"}
                    spacing={1}
                    h={"full"}
                    overflowY={"scroll"}
                >
                    <Heading size={"xs"} py={2} pl={2}>
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
            <Box w={"full"} p={2} borderTop={"1px solid rgba(0,0,0,.1)"}>
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

const LocationFilter = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [selectedLocationName, setSelectedLocationName] = useState();
    const [selectedLocation, setSelectedLocation] = useState();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locQ, setLocQ] = useState();
    const [zip, setZip] = useState();

    const loadQueryLocations = async (query) => {
        const res = await axios.get(`/api/city?q=${query}`);
        setLocations([...res.data]);
        if (res.data.length === 1) {
            setSelectedLocationName(res.data[0].name);
        }
        setLoading(false);
    };
    const debouncedLoadQuery = debounce(loadQueryLocations, 500);
    const loadZipLocations = async () => {
        const res = await axios.get(`/api/city?zip=${zip}`);
        setLocations([...res.data]);
        if (res.data.length === 1) {
            setSelectedLocationName(res.data[0].name);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (zip && zip.length > 4) {
            setLoading(true);
            loadZipLocations(zip);
            setLoading(false);
        }
    }, [zip]);
    useEffect(() => {
        const newLoc = {
            ...find(locations, (o) => o.name === selectedLocationName),
        };
        setSelectedLocation(newLoc);
    }, [selectedLocationName]);
    useEffect(() => {}, [selectedLocation]);
    return (
        <>
            <Button
                onClick={onOpen}
                mt={2}
                w={"full"}
                variant={"ghost"}
                fontSize={14}
                justifyContent={"start"}
                leftIcon={<Icon as={MdLocationSearching} />}
            >
                Location
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={6}>
                        <Heading size={"md"} mb={4}>
                            Location
                        </Heading>
                        <HStack></HStack>
                        <HStack mb={2} spacing={0}>
                            <Input
                                placeholder={"City Name"}
                                flex={1}
                                onChange={(e) => {
                                    setLoading(true);
                                    debouncedLoadQuery(e.target.value);
                                }}
                            />
                            <Text mx={2}>or</Text>
                            <Input
                                placeholder={"Zipcode"}
                                flex={1}
                                onChange={(e) => setZip(e.target.value)}
                            />
                        </HStack>
                        <HStack>
                            <Select
                                mb={2}
                                icon={
                                    loading && (
                                        <Spinner colorScheme={"blackAlpha"} />
                                    )
                                }
                                value={selectedLocationName}
                                onChange={(e) =>
                                    setSelectedLocationName(e.target.value)
                                }
                                isDisabled={loading}
                            >
                                <option value={""}>None</option>
                                {locations.map((l) => (
                                    <option value={l.name}>
                                        {l.name}, {l.state}
                                    </option>
                                ))}
                            </Select>
                        </HStack>
                        {selectedLocation && (
                            <Box
                                height={200}
                                borderRadius={5}
                                overflow={"hidden"}
                            >
                                <GoogleMapReact
                                    center={{
                                        lat: selectedLocation.latitude,
                                        lng: selectedLocation.longitude,
                                    }}
                                    options={{
                                        fullscreenControl: false,
                                        zoomControl: false,
                                        panControl: false,
                                        gestureHandling: "none",
                                    }}
                                    zoom={12}
                                />
                            </Box>
                        )}
                        <Button w={"full"} mt={4} colorScheme={"messenger"}>
                            Apply
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
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
