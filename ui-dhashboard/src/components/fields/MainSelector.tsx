import React from "react";
import { Select } from "chakra-react-select";
import { ROLES } from "utils/constant";

type Props = {
  groupedOptions: {
    label: string;
    options: {
      value: string;
      label: string;
      color: string;
    }[];
  }[];
  defaultValue?: ROLES;
} & any;

const MainSelector = ({ groupedOptions, defaultValue, ...rest }: Props) => {
  return (
    <Select
      defaultValue={defaultValue}
      errorBorderColor="crimson"
      options={groupedOptions}
      {...rest}
    />
  );
};

export default MainSelector;
