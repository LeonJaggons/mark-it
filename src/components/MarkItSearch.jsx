import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useState } from "react";
import { MdSearch } from "react-icons/md";

export const MarkItSearch = () => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    return (
        <InputGroup>
            <InputLeftElement>
                <Icon as={MdSearch} mb={2} mr={1} />
            </InputLeftElement>
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
