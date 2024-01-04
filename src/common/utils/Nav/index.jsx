import { useEffect } from "react";

import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AppsIcon from "@mui/icons-material/Apps";

import Theme from "./Theme";
import IconButton from "../IconButton";
import UpdateUI from "./UpdateUI";

import useCommonSettings from "../../hooks/useSettings";
import useDimension from "../../hooks/useDimensions";

const Nav = ({ app = "All Apps", title }) => {
  const { user, getName } = useCommonSettings();
  const { up } = useDimension();

  useEffect(() => {
    document.querySelector("title").textContent = title;
  }, [title]);

  if (!user) return null;

  let ap = app;

  if (typeof ap === "object") ap = "";

  return (
    <Box
      p={1.5}
      fontWeight="bold"
      display="flex"
      position="relative"
      justifyContent="space-between"
      borderBottom={(t) => `1px solid ${t.palette.divider}`}
      whiteSpace="nowrap"
      sx={{ overflowX: "auto", backdropFilter: "blur(10)" }}
    >
      <Box display="flex" alignItems="center">
        CFSOC
        <ArrowForwardIosIcon fontSize="x-small" sx={{ mx: 1 }} />
        <Typography component="span" color="primary.main" fontWeight="bold">
          {typeof app === "object"
            ? app
            : up.sm
            ? app
            : app.substring(0, 4) + "..."}
        </Typography>
        {(typeof app === "object" || ap.toLocaleLowerCase() !== "all apps") && (
          <Link to="/" style={{ color: "inherit" }}>
            <IconButton Icon={AppsIcon} sx={{ ml: 2 }} title="All Apps" />
          </Link>
        )}
        <UpdateUI user={user} />
      </Box>
      <Box mr={2} display="flex" alignItems="center">
        <Theme />
        {ap.toLocaleLowerCase() !== "accounts" && (
          <Link
            to="/account"
            style={{ textDecoration: "none" }}
            title={getName()}
          >
            <Avatar sx={{ height: 30, width: 30, mr: 1, fontSize: 16 }}>
              {getName()
                .split(" ")
                .map((_) => _[0])
                .join("")}
            </Avatar>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default Nav;
