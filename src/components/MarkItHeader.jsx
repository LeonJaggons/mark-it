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
} from "@chakra-ui/react";
import { signOut as fireSignOut } from "firebase/auth";
import { IoSearch } from "react-icons/io5";
import NextLink from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, toggleShowLogin } from "@/redux/reducer/appSlice";
import {
    AccountState,
    LoginCreds,
    setLoginPassword,
    setLoginUsername,
    setUser,
    signOut,
} from "@/redux/reducer/accountSlice";
import { RootState } from "@/redux/store";
import { loginUser } from "@/services/auth_services";
import axios from "axios";
import { MdEdit, MdLocationOn, MdShop, MdShop2, MdStore } from "react-icons/md";
import * as CryptoJS from "crypto-js";
import Scrollbars from "react-custom-scrollbars-2";
import { fireAuth } from "@/firebase/firebase-init";
import { useRouter } from "next/router";
const MarkItHeader = () => {
    const [categories, setCategories] = useState([]);
    const getCategories = async () => {
        const res = await axios.get("/api/category");
        setCategories([...res.data]);
    };

    useEffect(() => {
        getCategories();
    }, []);
    return (
        <VStack id={"mark-it-header"} spacing={"6px"} w={"full"}>
            <HStack w={"full"} spacing={"38px"}>
                <MarkItLogo />
                <MarkItSearch />
                <MarkItMenu />
            </HStack>
            <HStack w={"100%"} spacing={0} align={"center"}>
                <Button
                    variant={"link"}
                    textDecoration={"none !important"}
                    colorScheme="messenger"
                    leftIcon={<Icon as={MdLocationOn} />}
                    fontSize={14}
                    py={3}
                    mb={2}
                    // __css={{ textDecor: "none !important" }}
                >
                    Location
                </Button>
                <Divider
                    orientation={"vertical"}
                    height={"14px"}
                    borderColor={"gray.300"}
                    ml={6}
                    px={0}
                />
                {/* <HStack align={"center"} spacing={4} pl={6}> */}
                <HStack
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        overflowX: "scroll",
                        paddingLeft: 12,
                        paddingTop: 4,
                    }}
                    spacing={8}
                    flex={1}
                >
                    {categories.map((c) => (
                        <CategoryMenuItem
                            label={c.name}
                            key={"CAT-" + c.name}
                        />
                    ))}
                </HStack>
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
    const handleNav = () => {
        router.push({
            pathname: "/browse",
            query: { category: label },
        });
    };
    useEffect(() => {
        console.log(selectedCategory);
    }, [selectedCategory]);
    return (
        <Box
            cursor={"pointer"}
            onClick={handleNav}
            // onClick={newLocal}
            fontWeight={selectedCategory === label ? 600 : 400}
            _hover={{
                color: "messenger.500",
            }}
            fontSize={12}
        >
            <Text
                color={selectedCategory === label ? "messenger.500" : "black"}
                style={{ whiteSpace: "nowrap" }}
            >
                {label}
            </Text>
        </Box>
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

const MarkItLoginModal = () => {
    const [readOnly, setReadOnly] = useState(true);
    const dispatch = useDispatch();
    const [canSubmit, setCanSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveLogin, setSaveLogin] = useState(false);
    const loggedIn = useSelector((state) => state.account.loggedIn);
    const user = useSelector((state) => state.account.user);
    const showLogin = useSelector((state) => state.app.showLogin);
    const loginCreds = useSelector((state) => state.account.loginCreds);

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
    return (
        <Modal isOpen={!loggedIn && showLogin} onClose={handleClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalBody padding={6}>
                    <Stack spacing={4}>
                        <Heading size={"md"}>Sign In</Heading>
                        <Stack>
                            <Input
                                readOnly={readOnly}
                                placeholder={"Email"}
                                value={loginCreds.email}
                                onChange={handleUpdateUsername}
                                onFocus={() => setReadOnly(false)}
                                onBlur={() => setReadOnly(true)}
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
                            />
                            <HStack justify={"space-between"}>
                                <Checkbox
                                    onChange={(e) =>
                                        setSaveLogin(e.target.checked)
                                    }
                                >
                                    Remember me
                                </Checkbox>
                                <Button variant={"link"} size={"sm"}>
                                    Forgot password?
                                </Button>
                            </HStack>
                        </Stack>
                        <Button
                            onClick={handleLogin}
                            isLoading={loading}
                            isDisabled={!canSubmit}
                        >
                            Continue
                        </Button>
                    </Stack>
                    <HStack spacing={4} my={6}>
                        <Divider />
                        <Text
                            fontSize={"sm"}
                            fontWeight={"bold"}
                            color={"blackAlpha.500"}
                        >
                            OR
                        </Text>
                        <Divider />
                    </HStack>
                    <Button w={"full"} colorScheme={"messenger"}>
                        Sign Up
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default MarkItHeader;
