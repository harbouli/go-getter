import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import MainSelector from "components/fields/MainSelector";
import { ROLES } from "utils/constant";
import { Form, Formik } from "formik";
import PasswordInputField from "components/fields/PasswordInputField";
import * as Yup from "yup";
import { createUserParam } from "utils/types/Reqtype";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { CreateModeratorThunk } from "store/moderatores/moderatorsThunk";

type groupedOptions = {
  label: string;
  options: {
    value: ROLES;
    label: string;
    role?: string;
  }[];
}[];
type Props = {
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

// Yup Validation
const validation = Yup.object({
  firstName: Yup.string().required("Please Enter  FirstName"),
  lastName: Yup.string().required("Please Enter  LastName"),
  email: Yup.string().required().email("Email Formate Is unvalid"),
  password: Yup.string()
    .required("Enter Password")
    .min(6, "You password must be at least 6 characters")
    .max(250),
  phoneNumber: Yup.string(),
  adminType: Yup.string().required("Please Select One Role "),
});

const CreateAdminModal = ({ isOpen, onOpen, onClose }: Props) => {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bg = useColorModeValue("white", "#1B254B");
  const inputColor = useColorModeValue("#1B254B", "white");

  const [user, setUser] = useState<createUserParam>({
    adminType: ROLES.Admin,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  useEffect(() => {
    return () => {
      setUser({
        adminType: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
      });
    };
  }, [isOpen]);
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.moderator);

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
            <ModalHeader>Create account</ModalHeader>
            <ModalCloseButton />
            <>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  adminType: "",
                  password: "",
                  phoneNumber: "",
                }}
                validationSchema={validation}
                onSubmit={async (val) => {
                  console.log(val);
                  const params = {
                    adminType: val.adminType,
                    email: val.email,
                    firstName: val.firstName,
                    lastName: val.lastName,
                    password: val.password,
                    ...(val.phoneNumber !== "" && {
                      phoneNumber: val.phoneNumber,
                    }),
                  };

                  // useDispatch()
                  const res = await dispatch(CreateModeratorThunk(params));
                  // const res = await createAdmin(params);

                  if (res.type === "admins/create/fulfilled") {
                    console.log(res);
                    onClose();

                    toast({
                      title: "Account created.",
                      description: "We've created an account for you.",
                      status: "success",
                      duration: 9000,
                      isClosable: true,
                    });
                  } else {
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
                {/* Form Header */}
                {({ setFieldValue, errors, touched }) => (
                  <Form>
                    <ModalBody pb={6}>
                      <Text color={textColor}>First name</Text>
                      <Input
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
                      />
                      {/* LastName Input  */}
                      <Text color={textColor} mt={4}>
                        Last name
                      </Text>
                      <Input
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
                      />
                      {/* Phone Number Input */}

                      <Text color={textColor} mt={4}>
                        Phone Number
                      </Text>
                      <Input
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
                      />
                      {/* Email Input  */}

                      <Text color={textColor} mt={4}>
                        Email
                      </Text>
                      <Input
                        focusBorderColor={inputColor}
                        errorBorderColor="crimson"
                        color={inputColor}
                        isInvalid={errors.email && touched.email ? true : false}
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
                      />

                      {/* Password Input */}
                      <Text color={textColor} mt={4}>
                        Password
                      </Text>
                      <PasswordInputField
                        focusBorderColor={inputColor}
                        errorBorderColor="crimson"
                        color={inputColor}
                        isInvalid={
                          errors.password && touched.password ? true : false
                        }
                        value={user.password}
                        onChange={(
                          event: React.FocusEvent<HTMLInputElement>
                        ) => {
                          setFieldValue("password", event.target.value);
                          return setUser({
                            ...user,
                            password: event.target.value,
                          });
                        }}
                      />
                      {/* Role Selector */}
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
                        groupedOptions={options}
                      />
                    </ModalBody>
                    {/* Submit Field */}
                    <ModalFooter>
                      <Button
                        variant="darkBrand"
                        color="white"
                        fontSize="sm"
                        fontWeight="500"
                        borderRadius="70px"
                        px="24px"
                        py="5px"
                        mr={3}
                        type="submit"
                      >
                        Save
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            </>
          </ModalContent>
        </>
      </Modal>
    </>
  );
};

export default CreateAdminModal;
