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
            to="/schedules/current"
            description="Auto generate monthly schedules for CFSOC team"
            title="CFSOC Schedules"
            icon="/app-icons/schedules.png"
            status="experimental"
          />
          <Card
            to="/use-case-management"
            description="<No description>"
            title="Use Case Management"
            status="production"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Apps;
