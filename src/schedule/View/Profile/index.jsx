import Box from "@mui/material/Box";

import WithWrapper from "./Wrapper";
import History from "./History";
import SettingsMenu from "./Settings/Menu";

const Profile = (props) => {
  return (
    <WithWrapper {...props}>
      <Box
        overflow="auto"
        height="100%"
        position="relative"
        bgcolor="background.paper"
      >
        <SettingsMenu />
        <History />
      </Box>
    </WithWrapper>
  );
};

export default Profile;
