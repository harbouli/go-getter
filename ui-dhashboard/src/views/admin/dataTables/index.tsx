import React, { useEffect, useState } from "react";
// Chakra imports
import { Box, Spinner } from "@chakra-ui/react";
import AdminsTable, {
  RowObj,
} from "views/admin/dataTables/components/AdminsTable";

// Utils Import
import { getAdmins } from "utils/api";
import { RootState } from "store";
import { useSelector } from "react-redux";
import Pagination from "components/pagination/Pagination";
import axios from "axios";

export default function Settings() {
  const { CreateUser, updateUserID } = useSelector(
    (state: RootState) => state.moderator
  );

  // React Hooks

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }
  const [isLoading, setIsLoading] = useState(false);
  const [moderators, setModerators] = useState<RowObj[]>([]);
  const source = axios.CancelToken.source();

  useEffect(() => {
    const getModerators = async () => {
      try {
        const res = await getAdmins(
          { page: currentPage, perPage: 10 },
          source.token
        );

        setTotalPages(res.data.pages);
        const convertedArray: RowObj[] = res.data.admins.map((item) => ({
          id: item.id,
          name: `${item.firstName} ${item.lastName}`,
          phoneNumber: item.phoneNumber,
          email: item.email,
          role: item.adminType,
        }));
        setModerators(convertedArray);
        setIsLoading(true);
      } catch (error) {
        source.cancel();
      }
    };
    getModerators();
    setIsLoading(false);
    return () => {
      setIsLoading(false);

      // second;
    };
  }, [CreateUser, currentPage, updateUserID]);

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Box mb="20px">
        {!isLoading ? (
          <Box
            display="flex"
            sx={{
              width: "100%",
              height: "80vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner size="xl" />
          </Box>
        ) : (
          <>
            <AdminsTable tableData={moderators} />
            <Box width={250} mx="auto" my={10}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
