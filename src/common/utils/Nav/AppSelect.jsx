import { useState } from "react";

import { Link, useNavigation, useHref } from "react-router-dom";

import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckIcon from "@mui/icons-material/Check";

import Menu from "../Menu";

export default function AppSelect() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const location = useHref();

  const MI = ({ disabled, children, to }) => (
    <MenuItem disabled={disabled}>
      {children}{" "}
      {(to
        .split("/")
        .filter((a) => a)
        .some((n) =>
          location
            .split("/")
            .filter((b) => b)
            .some((n2) => n === n2)
        ) ||
        to === location) && <CheckIcon color="primary" sx={{ ml: 1 }} />}
    </MenuItem>
  );

  const MyLink = ({ to, disabled, children }) =>
    disabled ? (
      <MI disabled to={to} children={children} />
    ) : (
      <Link to={to}>
        <MI children={children} to={to} />
      </Link>
    );

  return (
    <Menu
      open={open}
      onClose={handleClose}
      Clickable={(props) => (
        <Button
          sx={{ fontWeight: "bold", ml: 4 }}
          endIcon={<ArrowDropDownIcon />}
          {...props}
          onClick={(e) => {
            handleOpen();
            props.onClick(e);
          }}
        >
          Apps
        </Button>
      )}
    >
      <MyLink to="/">All Apps</MyLink>
      <MyLink to="/schedules/current" disabled>
        CFSOC Schedule
      </MyLink>
      <MyLink to="/splunk">Splunk Webhook</MyLink>
    </Menu>
  );
}
