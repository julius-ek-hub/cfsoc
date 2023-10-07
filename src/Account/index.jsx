import { useLayoutEffect } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import Nav from "../common/utils/Nav";
import Middle from "../common/utils/Middle";
import UserInfo from "../common/utils/UserInfo";
import Staffs from "./Staffs";
import Logout from "../common/utils/Logout";

import useCommonSettings from "../common/hooks/useSettings";

const Account = () => {
  const { user, getName } = useCommonSettings();

  useLayoutEffect(() => {
    document.querySelector(
      "title"
    ).textContent = `CFSOC Accounts - ${getName()}`;
  });

  if (!user) return null;

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Nav app="Accounts" />
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        p={2}
        overflow="auto"
      >
        <Middle gap={2} mt={2}>
          <UserInfo />
          <Logout />
          <Divider sx={{ my: 3, width: "100%" }} />
          <Staffs />
        </Middle>
      </Box>
    </Box>
  );
};

export default Account;
