import { useEffect } from "react";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import Ui from "./UI";
import Menu from "./Menu";
import Nav from "../common/utils/Nav";
import Sections from "./utils/Section";
import SearchParamFilter from "./UI/Filter/SearchParamFilter";

import useFetcher from "./hooks/useFetcher";
import useLoading from "../common/hooks/useLoading";
import useSheet from "./hooks/useSheet";
import useSettings from "./hooks/useSettings";
import useCommonSettings from "../common/hooks/useSettings";

import { field_separator as fs } from "./utils/utils";

const UCM = () => {
  const { fetchAllFromDB, fetchSheetContent } = useFetcher();
  const { loading } = useLoading();
  const { active_sheet, updateSheet } = useSheet();
  const { settings, updateSettings } = useSettings();
  const { hide_header } = useCommonSettings();

  const key = active_sheet?.key;

  const initialize = async () => {
    await fetchAllFromDB();
    await Promise.all(
      ["l4_uc", "l3_uc", "l2_uc", "l1_uc"]
        .filter((im) => im !== settings.deleted)
        .map((k) => fetchSheetContent(k))
    );
    updateSettings("deleted", undefined);
  };

  useEffect(() => {
    initialize();
    if (key) {
      document.querySelector(
        "title"
      ).textContent = `CFSOC Use Case Management - ${active_sheet.name}`;
      updateSheet(`${key + fs}selected`, []);
    }
  }, [key, settings.deleted]);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box>
        <Nav app="Use Case Management" />
      </Box>
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

export default UCM;
