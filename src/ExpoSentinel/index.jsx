import { useEffect } from "react";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import Ui from "./UI";
import Menu from "./Menu";
import Nav from "../common/utils/Nav";
import Sections from "./utils/Section";
import ManualSearch from "./UI/Filter/ManualSeach";
import SearchParamFilter from "./UI/Filter/SearchParamFilter";

import useSheet from "./hooks/useSheet";
import useFetcher from "./hooks/useFetcher";
import useSettings from "./hooks/useSettings";
import useLoading from "../common/hooks/useLoading";
import useCommonSettings from "../common/hooks/useSettings";
import useLocalStorage from "../common/hooks/useLocalStorage";

import { _keys, _values, field_separator as fs } from "./utils/utils";

const ExpoSentinel = () => {
  const { fetchAllFromDB } = useFetcher();
  const { loading } = useLoading();
  const { active_sheet, updateSheet } = useSheet();
  const { uname, staffs, hide_header } = useCommonSettings();
  const { settings, updateSettings } = useSettings();
  const { get } = useLocalStorage();

  const key = active_sheet?.key;

  useEffect(() => {
    if (settings.sheets_by) fetchAllFromDB(key);
    else updateSettings("sheets_by", get("sheets_by") || []);

    if (key) {
      document.querySelector(
        "title"
      ).textContent = `Expo Sentinel - ${active_sheet.name}`;
      updateSheet(`${key + fs}selected`, []);
    }
  }, [key, uname, (settings.sheets_by || []).join("")]);

  if (!uname || !staffs) return null;

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box>
        <Nav app="Expo Sentinel" />
      </Box>
      <ManualSearch />
      <SearchParamFilter />
      {!hide_header && <Menu />}
      <Ui />
      <Sections />
      <Backdrop open={Boolean(loading.all_mitre)} sx={{ zIndex: 10000 }}>
        <CircularProgress />
      </Backdrop>
    </Box>
  );
};

export default ExpoSentinel;
