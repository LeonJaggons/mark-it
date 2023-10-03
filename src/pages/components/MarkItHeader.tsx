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
} from "@chakra-ui/react";
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
} from "@/redux/reducer/accountSlice";
import { RootState } from "@/redux/store";
import { loginUser } from "@/services/auth_services";
import axios from "axios";
import { MdLocationOn, MdShop, MdShop2, MdStore } from "react-icons/md";
const MarkItHeader = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const getCategories = async () => {
        const res = await axios.get("/api/category");
        setCategories([...res.data]);
    };

    useEffect(() => {
        getCategories();
    }, []);
    return (
        <VStack id={"mark-it-header"} spacing={"14px"} w={"full"}>
            <HStack w={"full"} spacing={"38px"}>
                <MarkItLogo />
                <MarkItSearch />
                <MarkItMenu />
            </HStack>
            <HStack w={"100%"} spacing={0} overflow={"hidden"} align={"center"}>
                <Button
                    variant={"link"}
                    textDecoration={"none !important"}
                    colorScheme="messenger"
                    leftIcon={<Icon as={MdLocationOn} />}
                    py={3}
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
                <HStack
                    flex={1}
                    overflowX={"scroll"}
                    py={3}
                    align={"center"}
                    spacing={4}
                    pl={6}
                >
                    {categories.map((c) => (
                        <>
                            <CategoryMenuItem label={c.name} />

                            <Divider
                                orientation={"vertical"}
                                height={"14px"}
                                borderColor={"white"}
                                mx={0}
                                px={0}
                            />
                        </>
                    ))}
                </HStack>
            </HStack>
        </VStack>
    );
};

const CategoryMenuItem = (props: { href: string }) => {
    return (
        <Link
            as={NextLink}
            href={props.href ?? ""}
            // onClick={newLocal}
            _hover={{
                color: "messenger.500",
            }}
            fontWeight={500}
            fontSize={13}
        >
            <Text style={{ whiteSpace: "nowrap" }}>{props.label}</Text>
        </Link>
    );
};

const MarkItSearch = () => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    return (
        <InputGroup height="46px">
            <InputLeftElement>
                <Icon
                    as={IoSearch}
                    color={isFocused ? "blue.500" : "blackAlpha.500"}
                    boxSize={5}
                />
            </InputLeftElement>
            <Input
                variant={"filled"}
                placeholder={"Search"}
                onFocus={handleFocus}
                onBlur={handleBlur}
                size={"md"}
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
            <HStack spacing={1}>
                <Icon as={MdStore} boxSize={7} />
                <Heading size={"lg"}>MarkIt</Heading>
            </HStack>
        </Link>
    );
};

const MarkItMenu = () => {
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const user = useSelector<RootState, any>(
        (state: RootState) => state.account.user
    );
    const dispatch = useDispatch();
    const handleOpenLogin = () => {
        dispatch(toggleShowLogin());
    };
    const loggedIn = useSelector<RootState, boolean>(
        (state) => state.account.loggedIn
    );

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
            { href: "/sell", label: "Selling" },
            { href: "/notifications", label: "Notifications" },
            { href: "/messages", label: "Messages" },
        ];
        setMenuItems(loggedIn ? loggedInMI : loggedOutMI);
    }, [loggedIn]);

    // { href: "/notifications", label: "Notifications" },
    return (
        <HStack spacing={8} flex={1}>
            {menuItems.map((m) => (
                <MarkItMenuItem key={m.label + "-menu-item"} {...m} />
            ))}
            {loggedIn && (
                <Avatar
                    size={"sm"}
                    name={user.firstName + " " + user.lastName}
                />
            )}
            <MarkItLoginModal />
        </HStack>
    );
};

const MarkItMenuItem = (props: {
    label?: string;
    href?: string;
    onClick?: () => any;
}) => {
    const newLocal = (e: any) => {
        !props.href && e.preventDefault();
        props.onClick && props.onClick();
    };
    return (
        <Link
            as={NextLink}
            href={props.href ?? ""}
            onClick={newLocal}
            className="mark-it-menu-item"
            _hover={{
                color: "blue.600",
            }}
        >
            <p style={{ whiteSpace: "nowrap" }}>{props.label}</p>
        </Link>
    );
};

const MarkItLoginModal = () => {
    const dispatch = useDispatch();
    const [canSubmit, setCanSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const loggedIn = useSelector<RootState, boolean>(
        (state) => state.account.loggedIn
    );
    const user = useSelector<RootState, any>(
        (state: RootState) => state.account.user
    );
    const showLogin = useSelector<any, boolean>(
        (state: any) => state.app.showLogin
    );
    const loginCreds = useSelector<RootState, LoginCreds>(
        (state: RootState) => state.account.loginCreds
    );

    useEffect(() => {
        if (user?.userID !== null) {
            handleClose();
        }
    }, [user]);

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

    const handleUpdateUsername = (e: any) =>
        dispatch(setLoginUsername(e.target.value));
    const handleUpdatePassword = (e: any) =>
        dispatch(setLoginPassword(e.target.value));

    const handleLogin = async () => {
        setLoading(true);
        await loginUser();
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
                                placeholder={"Email"}
                                value={loginCreds.email}
                                onChange={handleUpdateUsername}
                            />
                            <Input
                                type={"password"}
                                placeholder={"Password"}
                                value={loginCreds.password}
                                onChange={handleUpdatePassword}
                            />
                            <HStack justify={"space-between"}>
                                <Checkbox>Remember me</Checkbox>
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
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default MarkItHeader;
