import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import IconButton from "../IconButton";
import AppSelect from "./AppSelect";
import Theme from "./Theme";
import OpenProfile from "./OpenProfile";
import useCommonSettings from "../../hooks/useSettings";

const Nav = ({ app = "All Apps" }) => {
  const { getName } = useCommonSettings();

  return (
    <Box
      p={1.5}
      fontWeight="bold"
      display="flex"
      position="relative"
      justifyContent="space-between"
      borderBottom={(t) => `1px solid ${t.palette.divider}`}
      whiteSpace="nowrap"
      overflow="hidden"
      sx={{ overflowX: "auto" }}
    >
      <Box display="flex" alignItems="center">
        CFSOC
        <ArrowForwardIosIcon fontSize="x-small" />
        <Typography component="span" color="success.main" fontWeight="bold">
          {app}
        </Typography>
        <AppSelect />
      </Box>
      <Box mr={2} display="flex" alignItems="center">
        <Theme />
        <OpenProfile />
        {getName()}
      </Box>
    </Box>
  );
};

export default Nav;
