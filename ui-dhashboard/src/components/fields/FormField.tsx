import React, { FC, FocusEvent } from "react";
import { useField } from "formik";
import { Input } from "@chakra-ui/react";

const FormField: FC<any> = (props) => {
  const [enterdValue, setEnterdValue] = React.useState("");

  const [field, meta] = useField(props);
  return (
    <Input
      {...field}
      {...props}
      error={meta.error && meta.touched ? true : false}
      helperText={meta.error && meta.touched ? meta.error : ""}
      onChange={(e: FocusEvent<HTMLInputElement>) => {
        setEnterdValue(e.target.value);
        props.setfieldvalue(props.name, e.target.value);
      }}
      value={enterdValue}
    />
  );
};

export default FormField;
