import { useLayoutEffect, useState } from "react";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ButtonGroup from "@mui/material/ButtonGroup";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

import Menu from "../Menu";

import useCommonSettings from "../../hooks/useSettings";

import { u } from "../utils";
import useDimension from "../../hooks/useDimensions";

const Theme = () => {
  const [open, setOpen] = useState(false);
  const { update, theme } = useCommonSettings();
  const { t } = useDimension();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useLayoutEffect(() => {
    document
      .querySelector("meta[name=theme-color]")
      .setAttribute("content", t.palette.background.paper);
  }, [t]);

  const Bt = ({ type, Icon, name, ...rest }) => (
    <Button
      sx={{ justifyContent: "flex-start", pl: 2 }}
      onClick={() => {
        update("theme", type);
        handleClose();
      }}
      disableRipple
      variant={theme === type ? "contained" : "text"}
      startIcon={<Icon />}
      {...rest}
      children={name}
    />
  );

  return (
    <Menu
      open={open}
      onClose={handleClose}
      Clickable={(props) => (
        <Tooltip title={"Theme - " + u(theme)}>
          <IconButton
            sx={{ fontWeight: "bold", mr: 2 }}
            {...props}
            onClick={(e) => {
              handleOpen();
              props.onClick(e);
            }}
          >
            {theme === "light" ? (
              <LightModeIcon />
            ) : theme === "dark" ? (
              <DarkModeIcon />
            ) : (
              <SettingsBrightnessIcon />
            )}
          </IconButton>
        </Tooltip>
      )}
    >
      <ButtonGroup variant="text" orientation="vertical" sx={{ width: 150 }}>
        <Bt type="light" Icon={LightModeIcon} name="Light" />
        <Bt type="system" Icon={SettingsBrightnessIcon} name="System" />
        <Bt type="dark" Icon={DarkModeIcon} name="Dark" />
      </ButtonGroup>
    </Menu>
  );
};

export default Theme;
