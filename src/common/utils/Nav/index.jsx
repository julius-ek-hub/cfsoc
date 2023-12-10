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
import { useEffect } from "react";

const Nav = ({ app = "All Apps", title }) => {
  const { user, getName, hide_header } = useCommonSettings();

  useEffect(() => {
    document.querySelector("title").textContent = title;
  }, [title]);

  if (!user || hide_header) return null;

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
        <ArrowForwardIosIcon fontSize="x-small" sx={{ mx: 1 }} />
        <Typography component="span" color="success.main" fontWeight="bold">
          {app}
        </Typography>
        {app.toLocaleLowerCase() !== "all apps" && (
          <Link to="/" style={{ color: "inherit" }}>
            <IconButton Icon={AppsIcon} sx={{ ml: 4 }} title="All Apps" />
          </Link>
        )}
        <UpdateUI user={user} />
      </Box>
      <Box mr={2} display="flex" alignItems="center">
        <Theme />
        {app.toLocaleLowerCase() !== "accounts" && (
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
