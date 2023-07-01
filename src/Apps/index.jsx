import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";

import SearchIcon from "@mui/icons-material/Search";

import Card from "./Card";
import Nav from "../common/utils/Nav";
import Middle from "../common/utils/Middle";
import IconButton from "../common/utils/IconButton";
import useCommonSettings from "../common/hooks/useSettings";

const Apps = () => {
  const { user } = useCommonSettings();

  if (!user) return null;

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Nav />
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        p={2}
        overflow="hidden"
      >
        <Middle flexDirection="row" gap={2} mt={2}>
          <TextField size="small" placeholder="Search Apps" type="search" />
          <IconButton Icon={SearchIcon} />
        </Middle>
        <Divider sx={{ my: 3 }} />
        <Box
          flexGrow={1}
          display="flex"
          gap={2}
          flexWrap="wrap"
          alignContent="flex-start"
          overflow="auto"
        >
          <Card
            to="/splunk"
            description="Gets live notification from Splunk server whenever there is an alert, and plays a sound."
            title="Splunk Webhook"
            icon="/app-icons/splunk.png"
          />
          <Card
            to="/schedules/current"
            description="Auto generate monthly schedules for CFSOC team"
            title="CFSOC Schedules"
            icon="/app-icons/schedules.png"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Apps;
