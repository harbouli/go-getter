import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import InputFieldEditable from "components/fields/InputFieldEditable";
import MainSelector from "components/fields/MainSelector";
import { getAdminById, updateAdmin, updateAdminForSuperAdmin } from "utils/api";
import { ROLES } from "utils/constant";
import { ModeratorType } from "utils/types/RespondType";
import { Formik } from "formik";
import * as Yup from "yup";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { UpdateUser } from "store/moderatores/moderatoreSlice";

type groupedOptions = {
  label: string;
  options?: {
    value: ROLES;
    label: string;
    color?: string;
  }[];
}[];
type Props = {
  id: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const options: groupedOptions = [
  {
    label: "Roles",
    options: [
      {
        value: ROLES.Admin,
        label: "Admin",
      },
      {
        value: ROLES.Auther,
        label: "Auther",
      },
    ],
  },
];

const validation = Yup.object({
  firstName: Yup.string().optional(),
  lastName: Yup.string().optional(),
  email: Yup.string().email("Email Formate Is unvalid").optional(),
  phoneNumber: Yup.string().optional(),
  adminType: Yup.string().optional(),
});

const ModifyModal = ({ id, isOpen, onOpen, onClose }: Props) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bg = useColorModeValue("white", "#1B254B");

  const dispatch = useDispatch<AppDispatch>();

  const [user, setUser] = useState<ModeratorType>({
    adminType: ROLES.Admin,
    email: "",
    firstName: "",
    id: 0,
    lastName: "",
    phoneNumber: "",
  });
  const [Loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const inputColor = useColorModeValue("#1B254B", "white");
  useEffect(() => {
    // first;
    setLoading(true);
    const getTargetUser = async () => {
      if (isOpen && id) {
        try {
          const res = await getAdminById({ id });

          setUser(res.data);
          setLoading(false);
          console.log(res);
        } catch (error) {
          setLoading(true);
        }
      }
    };
    getTargetUser();
    return () => {
      // second;
    };
  }, [isOpen]);

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <>
          <ModalOverlay />
          <ModalContent color={textColor} bgColor={bg}>
            <ModalHeader>Update account</ModalHeader>
            <ModalCloseButton />
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                adminType: "",
                phoneNumber: "",
              }}
              validationSchema={validation}
              onSubmit={async (val) => {
                console.log(val);
                const params = {
                  ...(val.adminType !== "" && {
                    adminType: val.adminType,
                  }),

                  ...(val.email !== "" && {
                    email: val.email,
                  }),
                  ...(val.firstName !== "" && {
                    firstName: val.firstName,
                  }),
                  ...(val.lastName !== "" && {
                    lastName: val.lastName,
                  }),
                  ...(val.phoneNumber !== "" && {
                    phoneNumber: val.phoneNumber,
                  }),
                };
                try {
                  const res = await updateAdminForSuperAdmin({
                    id,
                    payload: params,
                  });
                  dispatch(UpdateUser(id));
                  toast({
                    title: "Account updated.",
                    description: "Just Update Your account.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                  onClose();
                } catch (errors: any) {
                  const error = errors.response.data.message;
                  toast({
                    title: "Error occurred.",
                    description: error,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                }
              }}
            >
              {({ setFieldValue, errors, touched, handleSubmit }) => (
                <>
                  <ModalBody pb={6}>
                    {Loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <Text color={textColor}>First name</Text>
                        <InputFieldEditable
                          focusBorderColor={inputColor}
                          errorBorderColor="crimson"
                          color={inputColor}
                          isInvalid={
                            errors.firstName && touched.firstName ? true : false
                          }
                          autoComplete="false"
                          placeholder={"eg. Mohamed"}
                          value={user.firstName}
                          onChange={(
                            event: React.FocusEvent<HTMLInputElement>
                          ) => {
                            setFieldValue("firstName", event.target.value);
                            return setUser({
                              ...user,
                              firstName: event.target.value,
                            });
                          }}
                          defaultValue={user?.firstName}
                        />

                        <Text color={textColor} mt={4}>
                          Last name
                        </Text>
                        <InputFieldEditable
                          focusBorderColor={inputColor}
                          errorBorderColor="crimson"
                          color={inputColor}
                          isInvalid={
                            errors.lastName && touched.lastName ? true : false
                          }
                          value={user.lastName}
                          onChange={(
                            event: React.FocusEvent<HTMLInputElement>
                          ) => {
                            setFieldValue("lastName", event.target.value);
                            return setUser({
                              ...user,
                              lastName: event.target.value,
                            });
                          }}
                          placeholder={"eg. Harbouli"}
                          defaultValue={user?.lastName}
                        />

                        <Text color={textColor} mt={4}>
                          Phone Number
                        </Text>
                        <InputFieldEditable
                          focusBorderColor={inputColor}
                          errorBorderColor="crimson"
                          color={inputColor}
                          isInvalid={
                            errors.phoneNumber && touched.phoneNumber
                              ? true
                              : false
                          }
                          value={user.phoneNumber}
                          onChange={(
                            event: React.FocusEvent<HTMLInputElement>
                          ) => {
                            setFieldValue("phoneNumber", event.target.value);
                            return setUser({
                              ...user,
                              phoneNumber: event.target.value,
                            });
                          }}
                          placeholder="eg. +212 665-88419"
                          defaultValue={
                            user?.phoneNumber
                              ? user?.phoneNumber
                              : "eg. +212 665-884194"
                          }
                        />
                        <Text color={textColor} mt={4}>
                          Email
                        </Text>
                        <InputFieldEditable
                          focusBorderColor={inputColor}
                          errorBorderColor="crimson"
                          color={inputColor}
                          isInvalid={
                            errors.email && touched.email ? true : false
                          }
                          value={user.email}
                          onChange={(
                            event: React.FocusEvent<HTMLInputElement>
                          ) => {
                            setFieldValue("email", event.target.value);
                            return setUser({
                              ...user,
                              email: event.target.value,
                            });
                          }}
                          placeholder={"eg. mohamed@harbouli.com"}
                          defaultValue={user?.email}
                        />

                        <Text color={textColor} mt={4}>
                          Role
                        </Text>
                        <MainSelector
                          focusBorderColor={inputColor}
                          errorBorderColor="crimson"
                          color={inputColor}
                          isInvalid={
                            errors.adminType && touched.adminType ? true : false
                          }
                          onChange={(e: { value: ROLES; label: string }) =>
                            setFieldValue("adminType", e.value)
                          }
                          name="Select Role"
                          placeholder="Role"
                          defaultValue={user?.adminType}
                          groupedOptions={options}
                        />
                      </>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      type="submit"
                      onClick={() => handleSubmit()}
                      variant="darkBrand"
                      color="white"
                      fontSize="sm"
                      fontWeight="500"
                      borderRadius="70px"
                      px="24px"
                      py="5px"
                      mr={3}
                    >
                      Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </ModalFooter>
                </>
              )}
            </Formik>
          </ModalContent>
        </>
      </Modal>
    </>
  );
};

export default ModifyModal;
