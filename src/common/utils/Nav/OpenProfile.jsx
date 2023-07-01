import { useState } from "react";

import { Link } from "react-router-dom";

import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import Menu from "../Menu";
import IconButton from "../IconButton";
import Logout from "../Logout";

export default function OpenProfile() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const MyLink = ({ children, to }) => (
    <Link to={to}>
      <MenuItem>{children} </MenuItem>
    </Link>
  );

  return (
    <Menu
      open={open}
      onClose={handleClose}
      Clickable={(props) => (
        <IconButton
          Icon={ArrowDropDownIcon}
          size="small"
          {...props}
          onClick={(e) => {
            handleOpen();
            props.onClick(e);
          }}
        />
      )}
    >
      <Logout fullWidth sx={{ justifyContent: "flex-start", pl: 2.5 }} />
      <MyLink to="/account">
        <Avatar sx={{ height: 22, width: 22, mr: 1 }} /> Account
      </MyLink>
    </Menu>
  );
}
