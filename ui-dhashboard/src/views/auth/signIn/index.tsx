import React from "react";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { Formik, Form } from "formik";
import { currentUser, getAdminById, signIn } from "utils/api";
import { useHistory } from "react-router-dom";
import useToken from "hooks/useToken";
import axios from "axios";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { setUser } from "store/moderatores/moderatoreSlice";

function SignIn(props: { authenticated: boolean }) {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const bg = useColorModeValue("white", "secondaryGray.900");
  // Hooks
  const [user, setUserCredentials] = React.useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const toast = useToast();
  const history = useHistory();
  const { getToken, setAcccesToken } = useToken();
  const storedToken = getToken();
  React.useEffect(() => {
    if (storedToken) history.push("/admin");
  }, [storedToken]);
  const dispatch = useDispatch<AppDispatch>();

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
    <Box bgColor={bg} width="100%" height="100vh">
      <DefaultAuth illustrationBackground={illustration} image={illustration}>
        <Flex
          maxW={{ base: "100%", md: "max-content" }}
          w="100%"
          mx={{ base: "auto", lg: "0px" }}
          me="auto"
          h="100%"
          alignItems="start"
          justifyContent="center"
          mb={{ base: "30px", md: "60px" }}
          px={{ base: "25px", md: "0px" }}
          mt={{ base: "40px", md: "14vh" }}
          flexDirection="column"
        >
          <Box me="auto">
            <Heading color={textColor} fontSize="36px" mb="10px">
              Sign In
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColorSecondary}
              fontWeight="400"
              fontSize="md"
            >
              Enter your email and password to sign in!
            </Text>
          </Box>
          <Flex
            zIndex="2"
            direction="column"
            w={{ base: "100%", md: "420px" }}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            mx={{ base: "auto", lg: "unset" }}
            me="auto"
            mb={{ base: "20px", md: "auto" }}
          >
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={async (val) => {
                console.log(val);
                try {
                  const res = await signIn(val);
                  console.log(res);
                  const token = res.data.access_token;
                  setAcccesToken(token);
                  axios.defaults.headers.common[
                    "Authorization"
                  ] = `Bearer ${token}`;
                  const user = await currentUser(res.data.access_token);
                  dispatch(setUser(user.data));
                  history.push("/admin");
                } catch (errors: any) {
                  console.log(errors);
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
                <Form>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Email<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    errorBorderColor="crimson"
                    isInvalid={errors.email && touched.email ? true : false}
                    value={user.email}
                    onChange={(event: React.FocusEvent<HTMLInputElement>) => {
                      setFieldValue("email", event.target.value);
                      return setUserCredentials({
                        ...user,
                        email: event.target.value,
                      });
                    }}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: "0px", md: "0px" }}
                    placeholder="mail@gogetter.com"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                  />
                  <FormLabel
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    display="flex"
                  >
                    Password<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      errorBorderColor="crimson"
                      isInvalid={
                        errors.password && touched.password ? true : false
                      }
                      value={user.password}
                      onChange={(event: React.FocusEvent<HTMLInputElement>) => {
                        setFieldValue("password", event.target.value);
                        return setUserCredentials({
                          ...user,
                          password: event.target.value,
                        });
                      }}
                      fontSize="sm"
                      placeholder="Min. 6 characters"
                      mb="24px"
                      size="lg"
                      type={show ? "text" : "password"}
                      variant="auth"
                    />
                    <InputRightElement
                      display="flex"
                      alignItems="center"
                      mt="4px"
                    >
                      <Icon
                        color={textColorSecondary}
                        _hover={{ cursor: "pointer" }}
                        as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                        onClick={handleClick}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Flex justifyContent="space-between" align="center" mb="24px">
                    <FormControl display="flex" alignItems="center">
                      <Checkbox
                        id="remember-login"
                        colorScheme="brandScheme"
                        me="10px"
                      />
                      <FormLabel
                        htmlFor="remember-login"
                        mb="0"
                        fontWeight="normal"
                        color={textColor}
                        fontSize="sm"
                      >
                        Keep me logged in
                      </FormLabel>
                    </FormControl>
                  </Flex>
                  <Button
                    type="submit"
                    fontSize="sm"
                    variant="brand"
                    fontWeight="500"
                    w="100%"
                    h="50"
                    mb="24px"
                  >
                    Sign In
                  </Button>
                </Form>
              )}
            </Formik>

            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="start"
              maxW="100%"
              mt="0px"
            ></Flex>
          </Flex>
        </Flex>
      </DefaultAuth>
    </Box>
  );
}

export default SignIn;
