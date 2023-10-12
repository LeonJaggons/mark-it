import { fireAuth } from "@/firebase/firebase-init";
import {
    setLoginPassword,
    setLoginUsername,
    setNewUserEmail,
    setNewUserFirstName,
    setNewUserLastName,
    setNewUserPassword,
    signOut,
} from "@/redux/reducer/accountSlice";
import { toggleShowLogin } from "@/redux/reducer/appSlice";
import { createAccount, loginUser } from "@/services/auth_services";
import { postRandomItem } from "@/services/item_service";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    HStack,
    Heading,
    Icon,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Select,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    VStack,
} from "@chakra-ui/react";
import { signOut as fireSignOut } from "firebase/auth";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
    MdAdd,
    MdLocationOn,
    MdOutlineChatBubbleOutline,
    MdOutlineFavoriteBorder,
    MdOutlineNotifications,
    MdOutlineShoppingBag,
    MdStore,
    MdUpload,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
const MarkItHeader = () => {
    const labelStyles = {
        mt: 2,
        fontSize: "sm",
    };
    return (
        <VStack id={"mark-it-header"} spacing={"18px"} w={"full"}>
            <HStack
                w={"full"}
                justify-content={"space-between"}
                spacing={"38px"}
            >
                <MarkItLogo />
                <Box flex={1}></Box>
                <MarkItMenu />
            </HStack>
        </VStack>
    );
};

const LocationButton = () => {
    return (
        <Popover placement={"bottom-start"}>
            <PopoverTrigger>
                <Button
                    variant={"link"}
                    textDecoration={"none !important"}
                    colorScheme={"black"}
                    leftIcon={<Icon as={MdLocationOn} />}
                    fontSize={14}
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
                <Heading fontSize={30} fontWeight={700} letterSpacing={-1}>
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
            { href: "/about", label: "About" },
            { href: "/help", label: "Help" },
            { label: "Sign In", onClick: handleOpenLogin },
        ];
        const loggedInMI = [
            { href: "/sell", label: "Sell", icon: MdOutlineShoppingBag },
            { href: "/saved", label: "Saved", icon: MdOutlineFavoriteBorder },
            {
                href: "/notifications",
                label: "Notifications",
                icon: MdOutlineNotifications,
            },
            {
                href: "/message",
                label: "Message",
                icon: MdOutlineChatBubbleOutline,
            },
        ];
        setMenuItems(loggedIn ? loggedInMI : loggedOutMI);
    }, [loggedIn]);

    return (
        <HStack spacing={8}>
            {loggedIn && (
                <Button
                    leftIcon={<Icon as={MdAdd} />}
                    as={NextLink}
                    href={"/post"}
                    size={"sm"}
                    fontSize={12}
                    colorScheme={"messenger"}
                >
                    Post an Item
                </Button>
            )}

            {/* <PostRandomItemButton /> */}
            {menuItems.map((m) => (
                <MarkItMenuItem
                    key={m.label + "-menu-item"}
                    href={m.href ?? null}
                    label={m.label}
                    onClick={m.onClick}
                    icon={m.icon}
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
                        ></Avatar>
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

const PostRandomItemButton = () => {
    return (
        <Button colorScheme={"red"} size={"sm"} onClick={postRandomItem}>
            Post Random Item
        </Button>
    );
};
const MarkItMenuItem = ({ label, onClick, href, icon }) => {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    useEffect(() => {
        router.pathname.split("/");
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
            fontWeight={isActive ? 700 : 600}
            className="mark-it-menu-item"
            _hover={{
                color: "messenger.500",
            }}
        >
            <VStack spacing={0}>
                <p style={{ whiteSpace: "nowrap", fontSize: 12 }}>{label}</p>
            </VStack>
        </Link>
    );
};

const MarkItLoginModal = () => {
    const [readOnly, setReadOnly] = useState(true);
    const dispatch = useDispatch();
    const [canSubmit, setCanSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveLogin, setSaveLogin] = useState(false);
    const [newUserPhoto, setNewUserPhoto] = useState();
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
                                                size={"sm"}
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
                                                {/* <Button
                                                    variant={"ghost"}
                                                    leftIcon={
                                                        <Icon as={MdShuffle} />
                                                    }
                                                    size={"sm"}
                                                    onClick={genNewColors}
                                                >
                                                    Random
                                                </Button> */}
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
