import { useEffect } from "react";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import Ui from "./UI";
import Menu from "./Menu";
import Nav from "../common/utils/Nav";
import Sections from "./utils/Section";

import useFetcher from "./hooks/useFetcher";
import useLoading from "../common/hooks/useLoading";
import useSheet from "./hooks/useSheet";

import { field_separator as fs } from "./utils/utils";
import useCommonSettings from "../common/hooks/useSettings";

const ExpoSentinel = () => {
  const { fetchAllFromDB } = useFetcher();
  const { loading } = useLoading();
  const { active_sheet, updateSheet } = useSheet();
  const { uname, staffs } = useCommonSettings();

  const key = active_sheet?.key;

  useEffect(() => {
    fetchAllFromDB();
    if (key) {
      document.querySelector(
        "title"
      ).textContent = `Expo Sentinel - ${active_sheet.name}`;
      updateSheet(`${key + fs}selected`, []);
    }
  }, [key, uname]);

  if (!uname || !staffs) return null;

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box>
        <Nav app="Expo Sentinel" />
      </Box>
      <Menu />
      <Ui />
      <Sections />
      <Backdrop open={Boolean(loading.all_mitre)} sx={{ zIndex: 10000 }}>
        <CircularProgress />
      </Backdrop>
    </Box>
  );
};

export default ExpoSentinel;
