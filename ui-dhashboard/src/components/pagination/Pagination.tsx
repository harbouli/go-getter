import { Button, Flex } from "@chakra-ui/react";
import React from "react";

type Props = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

const Pagination = (props: Props) => {
  const { currentPage, totalPages, onChange } = props;

  function handlePageChange(page: number) {
    onChange(page);
  }

  return (
    <Flex justifyContent="space-around">
      {currentPage > 1 && (
        <Button
          variant="main"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
      )}
      {currentPage < totalPages && (
        <Button onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
      )}
    </Flex>
  );
};

export default Pagination;
