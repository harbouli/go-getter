import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import { UpdateUser } from "store/moderatores/moderatoreSlice";
import { deleteModerator } from "utils/api";
type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  id: number;
  rest?: any;
};

export const AlertDialogDelete = ({
  id,
  isOpen,
  onOpen,
  onClose,

  ...rest
}: Props) => {
  const cancelRef = React.useRef();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bg = useColorModeValue("white", "#1B254B");
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  // Delete Handler
  const deletHandler = async () => {
    try {
      await deleteModerator({ id });
      dispatch(UpdateUser(id));
      toast({
        title: "Deleted Successfully.",
        description: "Moderator Deleted 🐱‍👤",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error: any) {
      // dis;
      const errorMessage = error.response.data.message;
      toast({
        title: "Error occurred.",
        description: errorMessage,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    onClose();
  };
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bgColor={bg}>
            <AlertDialogHeader
              color={textColor}
              fontSize="lg"
              fontWeight="bold"
            >
              Delete Moderator
            </AlertDialogHeader>

            <AlertDialogBody color={textColor}>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deletHandler} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
