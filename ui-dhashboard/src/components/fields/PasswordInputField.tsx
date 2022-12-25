import {
  Button,
  ComponentWithAs,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  onClick?: () => void;
} & any;

const PasswordInputField = React.forwardRef<HTMLSelectElement, Props>(
  ({ onClick, ...rest }, ref) => {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    return (
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          {...rest}
        />
        <InputRightElement width="4.5rem">
          <Button variant="main" h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  }
);

export default PasswordInputField;
