import { useLayoutEffect } from "react";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

import Search from "./Search";
import Notify from "./Notify";
import Nav from "../common/utils/Nav";
import Severities from "./Severities";
import AddNotify from "./AddNotify";
import IconButton from "../common/utils/IconButton";
import Alerts from "./Alerts";

import useCommonSettings from "../common/hooks/useSettings";
import useAlerts from "./hooks/useAlerts";
import useDimension from "../common/hooks/useDimensions";

const Splunk = () => {
  const { alarm, init, show_splunk_info, updateClient } = useAlerts();
  const { user, staffs } = useCommonSettings();
  const { up } = useDimension();

  useLayoutEffect(() => {
    user && init();
    document.querySelector("title").textContent = "Splunk Webhook";
  }, [user]);

  const toggleOpen = () => {
    updateClient("show_splunk_info", !show_splunk_info);
  };

  if (!staffs || !user) return null;

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <Nav app="Splunk webhook" />
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          overflow: "auto",
          p: 3,
        }}
      >
        <Box display="flex" my={2} justifyContent="space-between">
          <Typography
            variant="h4"
            fontWeight=" bold"
            sx={{ wordBreak: "normal" }}
          >
            Splunk Webhook
          </Typography>
          <Box whiteSpace="nowrap">
            <audio
              src="/alert.mp3"
              id="splunk-alert-audio"
              hidden
              muted={!alarm}
            />
            <IconButton
              Icon={ArrowForwardIosIcon}
              size="small"
              sx={{ mr: 2 }}
              iprop={{
                sx: {
                  transform: `rotate(${show_splunk_info ? 90 : 180}deg)`,
                  transition: "200ms transform",
                },
              }}
              onClick={toggleOpen}
            />
            <IconButton
              Icon={alarm ? NotificationsActiveIcon : NotificationsOffIcon}
              iprop={{ fontSize: "large" }}
              onClick={() => {
                updateClient("alarm", alarm ? undefined : "ok");
              }}
            />
          </Box>
        </Box>

        <Box>
          <Collapse
            in={
              typeof show_splunk_info === "boolean" ? show_splunk_info : false
            }
          >
            <Box
              display="flex"
              gap={4}
              flexWrap="wrap"
              pb={2}
              sx={{
                "&>div": {
                  ...(up.xsm && {
                    width: "100%",
                  }),
                  ...(up.md && {
                    "&:nth-of-type(1)": { width: "20%" },
                    "&:nth-of-type(2)": { width: "70%" },
                    "&:nth-of-type(3)": { width: "70%" },
                    "&:nth-of-type(4)": { width: "20%" },
                  }),
                  ...(up.lg && {
                    width: 200,
                    "&:nth-of-type(1)": { width: 200 },
                    "&:nth-of-type(2)": { width: 400, flexGrow: 1 },
                    "&:nth-of-type(3)": { width: 500 },
                    "&:nth-of-type(4)": { width: 300 },
                  }),
                },
              }}
            >
              <Severities />
              <Search />
              <Notify />
              <AddNotify />
            </Box>
          </Collapse>
        </Box>
        <Alerts />
      </Box>
    </Box>
  );
};

export default Splunk;
