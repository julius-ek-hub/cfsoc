import { useLayoutEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";

import CheckIcon from "@mui/icons-material/Check";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";

import Menu from "../Menu";
import Middle from "../Middle";

import useCommonSettings from "../../hooks/useSettings";
import useDimension from "../../hooks/useDimensions";

import { u } from "../utils";

const Theme = () => {
  const [open, setOpen] = useState(false);
  const { update, theme, primary_colors, primary_color } = useCommonSettings();
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
      onClick={() => update("theme", type)}
      disableRipple
      variant={theme === type ? "contained" : "text"}
      startIcon={<Icon />}
      {...rest}
      children={name}
    />
  );

  return (
    <Menu
      alpha={0.5}
      open={open}
      onClose={handleClose}
      Initiator={(props) => (
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
      <Box p={2}>
        <ButtonGroup variant="text" orientation="vertical" sx={{ width: 150 }}>
          <Bt type="light" Icon={LightModeIcon} name="Light" />
          <Bt type="system" Icon={SettingsBrightnessIcon} name="System" />
          <Bt type="dark" Icon={DarkModeIcon} name="Dark" />
        </ButtonGroup>
        <Middle flexDirection="row" mt={2} gap={1}>
          {primary_colors.map((col) => (
            <Middle
              key={col}
              onClick={() => update("primary_color", col)}
              sx={{
                height: 40,
                width: 40,
                bgcolor: col,
                borderRadius: 20,
                cursor: "pointer",
              }}
              {...(col === primary_color && {
                children: <CheckIcon sx={{ color: "common.white" }} />,
              })}
            />
          ))}
        </Middle>
      </Box>
    </Menu>
  );
};

export default Theme;
