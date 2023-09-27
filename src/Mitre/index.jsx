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
import SearchParamFilter from "./UI/Filter/SearchParamFilter";
import useSettings from "./hooks/useSettings";

const Mitre = () => {
  const { fetchAllFromDB, fetchSheetContent } = useFetcher();
  const { loading } = useLoading();
  const { active_sheet, updateSheet, important_sheets } = useSheet();
  const { settings, updateSettings } = useSettings();

  const key = active_sheet?.key;

  const initialize = async () => {
    await fetchAllFromDB();
    await Promise.all(
      important_sheets
        .filter((im) => im !== settings.deleted)
        .map(fetchSheetContent)
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
    <Box display="flex" flexDirection="column" height="100%">
      <Box>
        <Nav app="Use Case Management" />
      </Box>
      <SearchParamFilter />
      <Menu />
      <Ui />
      <Sections />
      <Backdrop open={Boolean(loading.all_mitre)}>
        <CircularProgress />
      </Backdrop>
    </Box>
  );
};

export default Mitre;
