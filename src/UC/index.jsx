import { useEffect } from "react";

import Box from "@mui/material/Box";
import Nav from "../common/utils/Nav";
import Sections from "./utils/Section";
import useFetcher from "./hooks/useFetcher";
import useSheet from "./hooks/useSheet";

import View from "./View";
import MainFilter from "./utils/MainFilter";
import Intro from "./View/Intro";

import { _keys } from "../common/utils/utils";

const UseCaseManagement = () => {
  const { fetchAllFromDB, fetcUC, fetchFilters } = useFetcher();
  const { active_sheet, sp_filter, contents } = useSheet();

  const key = active_sheet?.key;

  const initialize = async () => {
    await fetchAllFromDB();
    await fetcUC();
  };

  useEffect(() => {
    if (sp_filter) initialize();
    else fetchFilters();
  }, [sp_filter]);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      <Box>
        <Nav
          app="Use Case Management"
          title={`CFSOC Use Case Management - ${active_sheet?.name}`}
        />
      </Box>
      {active_sheet && _keys(contents).length >= 5 && (
        <>
          {key == "intro" ? (
            <Intro />
          ) : (
            <>
              <MainFilter />
              <View location={key} />
            </>
          )}
          <Sections />
        </>
      )}
    </Box>
  );
};

export default UseCaseManagement;
