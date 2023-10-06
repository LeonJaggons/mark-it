import {
    AbsoluteCenter,
    Box,
    Button,
    Checkbox,
    Divider,
    HStack,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Stack,
    Text,
    Avatar,
    VStack,
    Tag,
    InputRightElement,
    IconButton,
    InputRightAddon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Slider,
    SliderTrack,
    SliderThumb,
    SliderFilledTrack,
    SliderMark,
    Select,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Tab,
} from "@chakra-ui/react";
import { signOut as fireSignOut } from "firebase/auth";
import { IoSearch } from "react-icons/io5";
import NextLink from "next/link";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, toggleShowLogin } from "@/redux/reducer/appSlice";
import {
    AccountState,
    LoginCreds,
    setLoginPassword,
    setLoginUsername,
    setNewUserEmail,
    setNewUserFirstName,
    setNewUserLastName,
    setNewUserPassword,
    setUser,
    signOut,
} from "@/redux/reducer/accountSlice";
import { RootState } from "@/redux/store";
import { createAccount, loginUser } from "@/services/auth_services";
import axios from "axios";
import {
    MdApps,
    MdEdit,
    MdLocationOn,
    MdLocationSearching,
    MdShop,
    MdShop2,
    MdShuffle,
    MdStore,
    MdUpload,
} from "react-icons/md";
import * as CryptoJS from "crypto-js";
import Scrollbars from "react-custom-scrollbars-2";
import { fireAuth } from "@/firebase/firebase-init";
import { useRouter } from "next/router";
import { setSelectedCategory } from "@/redux/reducer/itemSlice";
import BoringAvatar from "boring-avatars";
const MarkItHeader = () => {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [catSelected, setCatSelected] = useState(false);
    const getCategories = async () => {
        const res = await axios.get("/api/category");
        setCategories([...res.data]);
    };

    useEffect(() => {
        const selectedCat = router.query.category;
        setCatSelected(selectedCat != null);
    }, [router]);
    useEffect(() => {
        getCategories();
    }, []);
    const labelStyles = {
        mt: 2,
        fontSize: "sm",
    };
    return (
        <VStack id={"mark-it-header"} spacing={"18px"} w={"full"}>
            <HStack w={"full"} spacing={"38px"}>
                <MarkItLogo />
                <MarkItSearch />
                <MarkItMenu />
            </HStack>
            <HStack
                w={"100%"}
                spacing={12}
                align={"center"}
                // justify={"space-between"}
            >
                <Popover placement={"bottom-start"}>
                    <PopoverTrigger>
                        <Button
                            variant={"link"}
                            textDecoration={"none !important"}
                            colorScheme={"black"}
                            leftIcon={<Icon as={MdLocationOn} />}
                            fontSize={16}
                            // __css={{ textDecor: "none !important" }}
                        >
                            Location
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Box p={4} borderBottom={"1px solid rgba(0,0,0,.1)"}>
                            <Heading size={"sm"}>Location</Heading>
                        </Box>
                        <Box p={4}>
                            <Stack>
                                <Stack>
                                    <Heading size={"xs"}>Distance</Heading>
                                    <Select size={"sm"}>
                                        <option>5 mi</option>
                                    </Select>
                                </Stack>
                            </Stack>
                        </Box>
                        <Box p={4} borderTop={"1px solid rgba(0,0,0,.1)"}>
                            <Button
                                size={"sm"}
                                w={"full"}
                                colorScheme={"messenger"}
                                variant={"outline"}
                            >
                                Apply
                            </Button>
                        </Box>
                    </PopoverContent>
                </Popover>
                {/* <HStack align={"center"} spacing={4} pl={6}> */}
                <Popover trigger={"hover"} placement={"bottom-start"}>
                    <PopoverTrigger>
                        <Button
                            variant={"link"}
                            textDecoration={"none !important"}
                            colorScheme="black"
                            leftIcon={<Icon as={MdApps} />}
                            fontSize={16}
                            color={catSelected && "messenger.500"}
                            // __css={{ textDecor: "none !important" }}
                        >
                            Categories
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        height={"300px"}
                        w={"220px"}
                        overflowY={"scroll"}
                    >
                        <PopoverBody p={0}>
                            <VStack
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    height: "100%",
                                }}
                                spacing={0}
                                flex={1}
                            >
                                <CategoryMenuItem
                                    label={"All"}
                                    key={"CAT-ALL"}
                                />
                                {categories.map((c) => (
                                    <CategoryMenuItem
                                        label={c.name}
                                        key={"CAT-" + c.name}
                                    />
                                ))}
                            </VStack>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                {/* </HStack> */}
            </HStack>
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
        console.log(selectedCategory);
    }, [selectedCategory]);
    return (
        <Button
            cursor={"pointer"}
            variant={selectedCategory === label ? "solid" : "ghost"}
            colorScheme={"messenger"}
            w={"full"}
            color={selectedCategory === label ? "white" : "black"}
            justifyContent={"space-between"}
            onClick={handleNav}
            fontWeight={selectedCategory === label ? 600 : 400}
            fontSize={12}
            borderRadius={0}
        >
            {label}
        </Button>
    );
};

const MarkItSearch = () => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    return (
        <InputGroup>
            <Input
                variant={"filled"}
                placeholder={"Search"}
                onFocus={handleFocus}
                onBlur={handleBlur}
                size={"sm"}
                borderRadius={5}
                _hover={{
                    borderColor: "messenger.500",
                }}
            />
        </InputGroup>
    );
};

const MarkItLogo = () => {
    return (
        <Link
            as={NextLink}
            href={"/"}
            cursor={"pointer"}
            textDecoration={"none !important"}
        >
            <HStack
                spacing={".5px"}
                _hover={{
                    color: "gray.600",
                }}
            >
                <Icon as={MdStore} boxSize={7} />
                <Heading fontSize={30} fontWeight={800} letterSpacing={-1}>
                    MarkIt
                </Heading>
            </HStack>
        </Link>
    );
};

const MarkItMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const user = useSelector((state) => state.account.user);
    const dispatch = useDispatch();
    const handleOpenLogin = () => {
        dispatch(toggleShowLogin());
    };
    const loggedIn = useSelector((state) => state.account.loggedIn);

    useEffect(() => {
        const loggedOutMI = [
            { href: "/", label: "Browse" },
            { href: "/about", label: "About" },
            { href: "/help", label: "Help" },
            { label: "Sign In", onClick: handleOpenLogin },
        ];
        const loggedInMI = [
            { href: "/", label: "Browse" },
            { href: "/saved", label: "Saved" },
            { href: "/sell", label: "Sell" },
            { href: "/notifications", label: "Notifications" },
            { href: "/message", label: "Message" },
        ];
        setMenuItems(loggedIn ? loggedInMI : loggedOutMI);
    }, [loggedIn]);

    // { href: "/notifications", label: "Notifications" },
    return (
        <HStack spacing={8} flex={1}>
            {menuItems.map((m) => (
                <MarkItMenuItem
                    key={m.label + "-menu-item"}
                    href={m.href ?? null}
                    label={m.label}
                    onClick={m.onClick}
                />
            ))}
            {loggedIn && <UserAvatar />}
            <MarkItLoginModal />
        </HStack>
    );
};

const UserAvatar = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const handleSignOut = () => {
        router.push("/");
        fireSignOut(fireAuth);

        localStorage.removeItem("email");
        localStorage.removeItem("password");
        dispatch(signOut());
    };
    const user = useSelector((state) => state.account.user);
    return (
        <Popover placement="bottom-end">
            <PopoverTrigger>
                <Button p={1} variant={"link"}>
                    <Avatar
                        cursor={"pointer"}
                        size={"sm"}
                        name={user.firstName + " " + user.lastName}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent w={"240px"}>
                <PopoverBody p={4}>
                    <VStack w={"full"}>
                        <Avatar
                            size={"lg"}
                            name={user.firstName + " " + user.lastName}
                            position={"relative"}
                        >
                            {/* <IconButton
                                size={"xs"}
                                aspectRatio={1}
                                boxSize={4}
                                bottom={-1}
                                right={-1}
                                position={"absolute"}
                                icon={<Icon as={MdEdit} boxSize={3} />}
                            /> */}
                        </Avatar>
                        <Heading size="md" mt={1}>
                            Hi, {user.firstName}!
                        </Heading>
                        <Button
                            onClick={handleSignOut}
                            w={"full"}
                            size={"sm"}
                            variant={"ghost"}
                            colorScheme={"red"}
                        >
                            Sign out
                        </Button>
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};
const MarkItMenuItem = ({ label, onClick, href }) => {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    useEffect(() => {
        console.log(router.pathname.split("/"));
        setIsActive(
            router.pathname.split("/").length !== 0 &&
                router.pathname.split("/")[1] === label.toLowerCase()
        );
    }, [router.pathname]);
    const newLocal = (e) => {
        !href && e.preventDefault();
        onClick && onClick();
    };
    return (
        <Link
            as={NextLink}
            href={href ? href : "/"}
            onClick={newLocal}
            color={isActive ? "messenger.500" : "gray.700"}
            fontWeight={isActive ? 700 : 500}
            className="mark-it-menu-item"
            _hover={{
                color: "messenger.500",
            }}
        >
            <p style={{ whiteSpace: "nowrap" }}>{label}</p>
        </Link>
    );
};

function generateRandomHexColors(length) {
    const colors = [];

    for (let i = 0; i < length; i++) {
        const randomColor =
            "#" + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(randomColor);
    }

    return colors;
}

const MarkItLoginModal = () => {
    const [readOnly, setReadOnly] = useState(true);
    const dispatch = useDispatch();
    const [canSubmit, setCanSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveLogin, setSaveLogin] = useState(false);
    const [newUserPhoto, setNewUserPhoto] = useState();
    const [randomColors, setRandomColors] = useState(
        generateRandomHexColors(5)
    );
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const user = useSelector((state) => state.account.user);
    const showLogin = useSelector((state) => state.app.showLogin);
    const loginCreds = useSelector((state) => state.account.loginCreds);
    const newUserCreds = useSelector((state) => state.account.newUserCreds);

    useEffect(() => {
        if (user?.userID !== null) {
            handleClose();
        }
    }, [user]);

    useEffect(() => {
        if (!showLogin) {
            dispatch(setLoginUsername(""));
            dispatch(setLoginPassword(""));
        }
    }, [showLogin]);
    useEffect(() => {
        updateCanSubmit();
    }, [loginCreds]);

    const genNewColors = () => setRandomColors(generateRandomHexColors(5));

    const updateCanSubmit = () => {
        const hasEmail =
            loginCreds.email != null && loginCreds.email.trim() !== "";
        const hasPassword =
            loginCreds.password != null && loginCreds.password.trim() !== "";
        setCanSubmit(hasEmail && hasPassword);
    };

    const handleClose = () => dispatch(toggleShowLogin());

    const handleUpdateUsername = (e) =>
        dispatch(setLoginUsername(e.target.value));
    const handleUpdatePassword = (e) =>
        dispatch(setLoginPassword(e.target.value));

    const handleSaveLogin = () => {
        const ISSERVER = typeof window === "undefined";
        if (!ISSERVER) {
            localStorage.setItem("email", loginCreds.email);
            localStorage.setItem("password", loginCreds.password);
        }
    };
    const handleLogin = async () => {
        setLoading(true);
        await loginUser();
        saveLogin && handleSaveLogin();
        setLoading(false);
    };

    const handleUpdateNewUserFirstName = (e) =>
        dispatch(setNewUserFirstName(e.target.value));
    const handleUpdateNewUserLastName = (e) =>
        dispatch(setNewUserLastName(e.target.value));
    const handleUpdateNewUserEmail = (e) =>
        dispatch(setNewUserEmail(e.target.value));
    const handleUpdateNewUserPassword = (e) =>
        dispatch(setNewUserPassword(e.target.value));

    const inputRef = useRef();
    const handleChange = (e) => {
        const file = e.target.files[0];

        file && setNewUserPhoto(URL.createObjectURL(file));
    };

    const handleSignUp = async () => {
        if (newUserPhoto) {
            setLoading(true);
            await createAccount(newUserPhoto);
            setLoading(false);
            dispatch(toggleShowLogin());
        }
    };
    return (
        <Modal isOpen={!loggedIn && showLogin} onClose={handleClose} isCentered>
            <ModalOverlay />
            <ModalContent
                minH={"320px"}
                borderRadius={5}
                overflow={"hidden"}
                borderWidth={0}
            >
                <ModalBody p={0}>
                    <Tabs
                        isFitted
                        variant={"enclosed-colored"}
                        colorScheme={"messenger"}
                    >
                        <TabList>
                            <Tab borderTopWidth={4}>Sign In</Tab>
                            <Tab borderTopWidth={4}>Sign Up</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Stack spacing={6}>
                                    <Heading size={"md"} mb={2}>
                                        Sign In
                                    </Heading>
                                    <Stack spacing={4}>
                                        <Input
                                            readOnly={readOnly}
                                            placeholder={"Email"}
                                            value={loginCreds.email}
                                            onChange={handleUpdateUsername}
                                            onFocus={() => setReadOnly(false)}
                                            onBlur={() => setReadOnly(true)}
                                            size={"sm"}
                                        />
                                        <Input
                                            readOnly={readOnly}
                                            type={"password"}
                                            placeholder={"Password"}
                                            value={loginCreds.password}
                                            onChange={handleUpdatePassword}
                                            onFocus={() => setReadOnly(false)}
                                            onBlur={() => setReadOnly(true)}
                                            autoComplete={"new-password"}
                                            size={"sm"}
                                        />
                                        <HStack justify={"space-between"}>
                                            <Checkbox
                                                onChange={(e) =>
                                                    setSaveLogin(
                                                        e.target.checked
                                                    )
                                                }
                                            >
                                                Remember me
                                            </Checkbox>
                                            <Button
                                                variant={"link"}
                                                size={"sm"}
                                            >
                                                Forgot password?
                                            </Button>
                                        </HStack>
                                    </Stack>
                                    <Button
                                        onClick={handleLogin}
                                        isLoading={loading}
                                        isDisabled={!canSubmit}
                                        colorScheme={"messenger"}
                                    >
                                        Continue
                                    </Button>
                                </Stack>
                            </TabPanel>
                            <TabPanel>
                                <Stack spacing={6} mb={6}>
                                    <Heading size={"md"} mb={2}>
                                        Sign Up
                                    </Heading>
                                    <Stack spacing={4}>
                                        <VStack>
                                            <Avatar
                                                src={newUserPhoto}
                                                size={"2xl"}
                                            />
                                            <Input
                                                display={"none"}
                                                type={"file"}
                                                ref={inputRef}
                                                onChange={handleChange}
                                            />
                                            <HStack>
                                                <Button
                                                    variant={"ghost"}
                                                    leftIcon={
                                                        <Icon as={MdShuffle} />
                                                    }
                                                    size={"sm"}
                                                    onClick={genNewColors}
                                                >
                                                    Random
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        inputRef?.current?.click()
                                                    }
                                                    variant={"ghost"}
                                                    leftIcon={
                                                        <Icon as={MdUpload} />
                                                    }
                                                    size={"sm"}
                                                >
                                                    Upload photo
                                                </Button>
                                            </HStack>
                                        </VStack>
                                        <HStack spacing={4}>
                                            <Input
                                                placeholder={"First Name"}
                                                value={newUserCreds.firstName}
                                                onChange={
                                                    handleUpdateNewUserFirstName
                                                }
                                                size={"sm"}
                                            />
                                            <Input
                                                placeholder={"Last Name"}
                                                value={newUserCreds.lastName}
                                                onChange={
                                                    handleUpdateNewUserLastName
                                                }
                                                size={"sm"}
                                            />
                                        </HStack>
                                        <Input
                                            placeholder={"Email"}
                                            value={newUserCreds.email}
                                            onChange={handleUpdateNewUserEmail}
                                            size={"sm"}
                                        />
                                        <Input
                                            type={"password"}
                                            placeholder={"Password"}
                                            value={newUserCreds.password}
                                            onChange={
                                                handleUpdateNewUserPassword
                                            }
                                            size={"sm"}
                                        />
                                    </Stack>
                                </Stack>
                                <Button
                                    w={"full"}
                                    colorScheme={"messenger"}
                                    onClick={handleSignUp}
                                    isLoading={loading}
                                >
                                    Sign Up
                                </Button>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default MarkItHeader;
