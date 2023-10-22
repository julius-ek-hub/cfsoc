import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  const handleDownload = (format) => {
    setOpen(false);
    onChange(format);
  };

  const MenuOption = ({ Icon, id = "json" }) => (
    <MenuItem onClick={() => handleDownload(id)}>
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
      open={open}
      onClose={() => setOpen(false)}
      Clickable={(props) => (
        <Button
          color="inherit"
          onClick={(e) => {
            setOpen(true);
            props.onClick(e);
          }}
          startIcon={<DownloadIcon />}
          endIcon={<KeyboardArrowDownIcon />}
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
