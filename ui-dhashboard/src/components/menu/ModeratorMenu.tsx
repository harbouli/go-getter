import React from "react";

// Chakra imports
import {
  Icon,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import {
  MdOutlineMoreHoriz,
  MdOutlineModeEditOutline,
  MdOutlineDelete,
} from "react-icons/md";
import ModifyModal from "components/modals/ModifyModal";
import { AlertDialogDelete } from "components/alertDialog/AlertDeleteModerator";

export default function Banner(props: { [x: string]: any; id: number }) {
  const { id, ...rest } = props;

  const textColor = useColorModeValue("secondaryGray.500", "white");
  const textHover = useColorModeValue(
    { color: "secondaryGray.900", bg: "unset" },
    { color: "secondaryGray.500", bg: "unset" }
  );
  const iconColor = useColorModeValue("brand.500", "white");
  const bgList = useColorModeValue("white", "whiteAlpha.100");
  const bgShadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  // Ellipsis modals
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();

  return (
    <>
      <Menu isOpen={isOpen1} onClose={onClose1}>
        <MenuButton
          alignItems="center"
          justifyContent="center"
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w="37px"
          h="37px"
          lineHeight="100%"
          onClick={onOpen1}
          borderRadius="10px"
          {...rest}
        >
          <Icon as={MdOutlineMoreHoriz} color={iconColor} w="24px" h="24px" />
        </MenuButton>
        <MenuList
          w="150px"
          minW="unset"
          maxW="150px !important"
          border="transparent"
          backdropFilter="blur(63px)"
          bg={bgList}
          boxShadow={bgShadow}
          borderRadius="20px"
          p="15px"
        >
          <MenuItem
            transition="0.2s linear"
            color={textColor}
            _hover={textHover}
            p="0px"
            borderRadius="8px"
            onClick={onOpen2}
            _active={{
              bg: "transparent",
            }}
            _focus={{
              bg: "transparent",
            }}
            mb="10px"
          >
            <Flex align="center">
              <Icon as={MdOutlineModeEditOutline} h="16px" w="16px" me="8px" />
              <Text fontSize="sm" fontWeight="400">
                Modify
              </Text>
            </Flex>
          </MenuItem>
          <MenuItem
            transition="0.2s linear"
            p="0px"
            borderRadius="8px"
            color={textColor}
            _hover={textHover}
            onClick={onOpen3}
            _active={{
              bg: "transparent",
            }}
            _focus={{
              bg: "transparent",
            }}
            mb="10px"
          >
            <Flex align="center">
              <Icon as={MdOutlineDelete} h="16px" w="16px" me="8px" />
              <Text fontSize="sm" fontWeight="400">
                Delete
              </Text>
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
      <ModifyModal
        isOpen={isOpen2}
        onClose={onClose2}
        onOpen={onOpen2}
        id={id}
      />
      <AlertDialogDelete
        isOpen={isOpen3}
        onClose={onClose3}
        onOpen={onOpen3}
        id={id}
      />
    </>
  );
}
