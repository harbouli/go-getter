import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  useEditableControls,
} from "@chakra-ui/react";

function InputFieldEditable({
  defaultValue,
  ...rest
}: {
  defaultValue: string;
} & any) {
  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          aria-label="check"
          icon={<CheckIcon />}
          {...getSubmitButtonProps()}
        />
        <IconButton
          aria-label="check"
          icon={<CloseIcon />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton aria-label="check" size="sm" {...getEditButtonProps()}>
          <EditIcon />
        </IconButton>
      </Flex>
    );
  }

  return (
    <Editable
      textAlign="center"
      defaultValue={defaultValue}
      fontSize="md"
      color="gray.400"
      isPreviewFocusable={false}
    >
      <Flex justifyContent={"space-between"}>
        <EditablePreview />
        {/* Here is the custom input */}
        <Input variant="main" {...rest} as={EditableInput} mr={2} />
        <EditableControls />
      </Flex>
    </Editable>
  );
}
export default InputFieldEditable;
