import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import DataObjectIcon from "@mui/icons-material/DataObject";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import MyMenu from "../../common/utils/Menu";

const Download = ({ onChange }) => {
  const MenuOption = ({ Icon, id = "json" }) => (
    <MenuItem onClick={() => onChange(id)}>
      <ListItemIcon>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{id === "json" ? "JSON" : "Excel"}</ListItemText>
      <ListItemIcon>
        <DownloadIcon fontSize="small" />
      </ListItemIcon>
    </MenuItem>
  );

  return (
    <MyMenu
      stateless
      Clickable={(props) => (
        <Button
          color="inherit"
          startIcon={<DownloadIcon />}
          endIcon={<KeyboardArrowDownIcon />}
          {...props}
        >
          Download
        </Button>
      )}
    >
      <Box minWidth={200}>
        <Typography ml={2} my={1} color="primary">
          Choose format:
        </Typography>
        <MenuList>
          <MenuOption id="json" Icon={DataObjectIcon} />
          <MenuOption id="table" Icon={BorderAllIcon} />
        </MenuList>
      </Box>
    </MyMenu>
  );
};

export default Download;
