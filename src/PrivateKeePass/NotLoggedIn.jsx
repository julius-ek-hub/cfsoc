import Typography from "@mui/material/Typography";

import Logout from "../common/utils/Logout";
import Middle from "../common/utils/Middle";
import UserInfo from "../common/utils/UserInfo";

const NotLoggedIn = () => {
  return (
    <Middle flexGrow={1} overflow="auto">
      <UserInfo />
      <Logout />
      <Typography m={2} textAlign="center">
        You need to Logout from the Default Account and login to your Private
        Account
      </Typography>
    </Middle>
  );
};

export default NotLoggedIn;
